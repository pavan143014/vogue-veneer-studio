import { useState, useCallback } from "react";
import { useCategories, CategoryWithChildren } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Loader2,
  FolderTree,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableCategoryItem } from "@/components/admin/SortableCategoryItem";
import { supabase } from "@/integrations/supabase/client";

const AdminCategories = () => {
  const { categoryTree, categories, loading, createCategory, updateCategory, deleteCategory, reorderCategories } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithChildren | null>(null);
  const [parentCategory, setParentCategory] = useState<CategoryWithChildren | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", image_url: "" });
    setEditingCategory(null);
    setParentCategory(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `category-${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("admin-uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("admin-uploads")
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddCategory = (parent?: CategoryWithChildren) => {
    resetForm();
    setParentCategory(parent || null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: CategoryWithChildren) => {
    setEditingCategory(category);
    setParentCategory(null);
    setFormData({ name: category.name, slug: category.slug });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    setSaving(true);

    if (editingCategory) {
      const { error } = await updateCategory(editingCategory.id, {
        name: formData.name,
        slug: formData.slug,
      });
      if (error) {
        toast.error("Failed to update category");
      } else {
        toast.success("Category updated");
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await createCategory({
        name: formData.name,
        slug: formData.slug,
        parent_id: parentCategory?.id || null,
      });
      if (error) {
        toast.error("Failed to create category");
      } else {
        toast.success(parentCategory ? "Subcategory added" : "Category created");
        setIsDialogOpen(false);
        resetForm();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string, hasChildren: boolean) => {
    const message = hasChildren
      ? "This will also delete all subcategories. Are you sure?"
      : "Are you sure you want to delete this category?";
    
    if (!confirm(message)) return;

    const { error } = await deleteCategory(id);
    if (error) {
      toast.error("Failed to delete category");
    } else {
      toast.success("Category deleted");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent, parentId: string | null) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    // Get siblings at this level
    const siblings = parentId 
      ? categories.filter(c => c.parent_id === parentId)
      : categories.filter(c => c.parent_id === null);
    
    const orderedIds = siblings
      .sort((a, b) => a.position - b.position)
      .map(c => c.id);

    const oldIndex = orderedIds.indexOf(active.id as string);
    const newIndex = orderedIds.indexOf(over.id as string);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder the array
    const newOrder = [...orderedIds];
    newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, active.id as string);

    await reorderCategories(parentId, newOrder);
    toast.success("Categories reordered");
  }, [categories, reorderCategories]);

  const renderSortableCategories = useCallback((cats: CategoryWithChildren[], depth: number = 0, parentId: string | null = null) => {
    const ids = cats.map(c => c.id);

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={(event) => handleDragEnd(event, parentId)}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {cats.map(category => (
              <SortableCategoryItem
                key={category.id}
                category={category}
                depth={depth}
                isExpanded={expandedCategories.has(category.id)}
                onToggleExpand={toggleExpand}
                onAddSubcategory={handleAddCategory}
                onEdit={handleEditCategory}
                onDelete={handleDelete}
                renderChildren={(children, d) => renderSortableCategories(children, d, category.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }, [sensors, expandedCategories, handleDragEnd]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Categories
          </h1>
          <p className="font-body text-muted-foreground">
            Manage product categories and subcategories
          </p>
        </div>
        <Button onClick={() => handleAddCategory()} className="gap-2">
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="font-display text-xl">Category Tree</CardTitle>
          <CardDescription>
            Drag to reorder • Click + to add subcategories • Click arrow to expand
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categoryTree.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg text-foreground mb-2">
                No categories yet
              </h3>
              <p className="font-body text-muted-foreground mb-4">
                Create your first category to organize products
              </p>
              <Button onClick={() => handleAddCategory()} className="gap-2">
                <Plus size={16} />
                Add Category
              </Button>
            </div>
          ) : (
            renderSortableCategories(categoryTree, 0, null)
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingCategory
                ? "Edit Category"
                : parentCategory
                ? `Add Subcategory to "${parentCategory.name}"`
                : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    name,
                    slug: editingCategory ? formData.slug : generateSlug(name),
                  });
                }}
                placeholder="e.g., Silk Sarees"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., silk-sarees"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL: /category/{formData.slug || "..."}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingCategory ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
