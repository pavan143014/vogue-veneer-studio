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
  X,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { DraggableCategoryItem } from "@/components/admin/DraggableCategoryItem";
import { CategoryDropZone } from "@/components/admin/CategoryDropZone";
import { supabase } from "@/integrations/supabase/client";

const AdminCategories = () => {
  const { categoryTree, categories, loading, createCategory, updateCategory, deleteCategory, reorderCategories, moveCategory } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithChildren | null>(null);
  const [parentCategory, setParentCategory] = useState<CategoryWithChildren | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

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
    useSensor(KeyboardSensor)
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
    setFormData({ 
      name: category.name, 
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
    });
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
        description: formData.description || null,
        image_url: formData.image_url || null,
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    // Check if dropping into a category to make it a child
    if (overId.startsWith("drop-into-")) {
      const targetParentId = overId.replace("drop-into-", "");
      
      // Prevent dropping a category into itself or its own descendants
      const isDescendant = (parentId: string, childId: string): boolean => {
        const children = categories.filter(c => c.parent_id === parentId);
        if (children.some(c => c.id === childId)) return true;
        return children.some(c => isDescendant(c.id, childId));
      };

      if (draggedId === targetParentId || isDescendant(draggedId, targetParentId)) {
        toast.error("Cannot move a category into its own subcategory");
        return;
      }

      const draggedCategory = categories.find(c => c.id === draggedId);
      if (draggedCategory?.parent_id === targetParentId) {
        return; // Already a child of this parent
      }

      const { error } = await moveCategory(draggedId, targetParentId);
      if (error) {
        toast.error("Failed to move category");
      } else {
        toast.success("Category moved");
        // Auto-expand the parent to show the moved category
        setExpandedCategories(prev => new Set([...prev, targetParentId]));
      }
      return;
    }

    // Check if dropping to root level
    if (overId === "drop-to-root") {
      const draggedCategory = categories.find(c => c.id === draggedId);
      if (draggedCategory?.parent_id === null) {
        return; // Already at root
      }

      const { error } = await moveCategory(draggedId, null);
      if (error) {
        toast.error("Failed to move category");
      } else {
        toast.success("Category moved to root level");
      }
      return;
    }

    // Same-level reordering
    const draggedCategory = categories.find(c => c.id === draggedId);
    const overCategory = categories.find(c => c.id === overId);

    if (!draggedCategory || !overCategory) return;

    // Only reorder if they share the same parent
    if (draggedCategory.parent_id === overCategory.parent_id) {
      const parentId = draggedCategory.parent_id;
      const siblings = categories
        .filter(c => c.parent_id === parentId)
        .sort((a, b) => a.position - b.position);

      const oldIndex = siblings.findIndex(c => c.id === draggedId);
      const newIndex = siblings.findIndex(c => c.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = siblings.map(c => c.id);
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, draggedId);

      await reorderCategories(parentId, newOrder);
      toast.success("Categories reordered");
    }
  }, [categories, reorderCategories, moveCategory]);

  const activeCategory = activeId ? categories.find(c => c.id === activeId) : null;

  const renderCategories = useCallback((cats: CategoryWithChildren[], depth: number = 0) => {
    return (
      <div className="space-y-2">
        {cats.map(category => (
          <DraggableCategoryItem
            key={category.id}
            category={category}
            depth={depth}
            isExpanded={expandedCategories.has(category.id)}
            onToggleExpand={toggleExpand}
            onAddSubcategory={handleAddCategory}
            onEdit={handleEditCategory}
            onDelete={handleDelete}
            renderChildren={(children, d) => renderCategories(children, d)}
          />
        ))}
      </div>
    );
  }, [expandedCategories]);

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
            Drag to reorder • Drop onto a category to nest • Drop on "Root Level" to un-nest
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-4">
                {/* Root level drop zone */}
                <CategoryDropZone
                  id="drop-to-root"
                  label="Drop here to move to root level"
                  className="mb-4"
                />
                
                {renderCategories(categoryTree, 0)}
              </div>

              <DragOverlay>
                {activeCategory && (
                  <div className="p-3 rounded-xl bg-background border-2 border-primary shadow-lg">
                    <div className="flex items-center gap-3">
                      {activeCategory.image_url ? (
                        <img
                          src={activeCategory.image_url}
                          alt={activeCategory.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            {activeCategory.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium">{activeCategory.name}</span>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
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
                  setFormData((prev) => ({
                    ...prev,
                    name,
                    slug: editingCategory ? prev.slug : generateSlug(name),
                  }));
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description for the category page"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Category Image</Label>
              {formData.image_url ? (
                <div className="relative group w-full h-32 rounded-xl overflow-hidden border border-border">
                  <img 
                    src={formData.image_url} 
                    alt="Category" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
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
