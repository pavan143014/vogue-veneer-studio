import { useState } from "react";
import { useCategories, CategoryWithChildren } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  FolderTree,
  ChevronRight,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const AdminCategories = () => {
  const { categoryTree, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithChildren | null>(null);
  const [parentCategory, setParentCategory] = useState<CategoryWithChildren | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "" });
    setEditingCategory(null);
    setParentCategory(null);
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

  const renderCategory = (category: CategoryWithChildren, depth: number = 0) => {
    const hasChildren = category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="space-y-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center gap-2 p-3 rounded-xl bg-muted/50 group hover:bg-muted transition-colors ${
            depth > 0 ? "ml-8 border-l-2 border-muted" : ""
          }`}
        >
          {/* Drag handle */}
          <button className="touch-none cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent transition-colors">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Expand button */}
          <button
            onClick={() => toggleExpand(category.id)}
            className="p-1 rounded hover:bg-accent transition-colors"
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>

          {/* Category info */}
          <div className="flex-1 min-w-0">
            <p className="font-body font-medium text-foreground">{category.name}</p>
            <p className="text-xs text-muted-foreground">/category/{category.slug}</p>
          </div>

          {hasChildren && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
              {category.children.length} subcategories
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleAddCategory(category)}
              title="Add subcategory"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleEditCategory(category)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => handleDelete(category.id, hasChildren)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Children */}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {category.children.map(child => renderCategory(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

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
            Click + to add subcategories • Click arrow to expand
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
            <div className="space-y-2">
              {categoryTree.map(category => renderCategory(category))}
            </div>
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
