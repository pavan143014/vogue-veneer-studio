import { useState } from "react";
import { useAdminData } from "@/hooks/useAdmin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutTemplate, Footprints, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { MenuItemsList } from "@/components/admin/MenuItemsList";
import { MenuItemDialog } from "@/components/admin/MenuItemDialog";
import { MenuItem } from "@/components/admin/SortableMenuItem";

const AdminMenus = () => {
  const { menus, loading, updateMenu } = useAdminData();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [addingToParentId, setAddingToParentId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itemForm, setItemForm] = useState({ label: "", href: "" });
  const [activeTab, setActiveTab] = useState("header");

  const headerMenu = menus.find((m) => m.slug === "header");
  const footerMenu = menus.find((m) => m.slug === "footer");
  const currentMenu = activeTab === "header" ? headerMenu : footerMenu;

  const getParentLabel = () => {
    if (!addingToParentId || !currentMenu) return undefined;
    const parent = (currentMenu.items as MenuItem[]).find(
      (i) => i.id === addingToParentId
    );
    return parent?.label;
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setEditingParentId(null);
    setIsAddingChild(false);
    setAddingToParentId(null);
    setItemForm({ label: "", href: "" });
    setIsDialogOpen(true);
  };

  const handleAddChild = (parentId: string) => {
    setEditingItem(null);
    setEditingParentId(null);
    setIsAddingChild(true);
    setAddingToParentId(parentId);
    setItemForm({ label: "", href: "" });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem, parentId?: string) => {
    setEditingItem(item);
    setEditingParentId(parentId || null);
    setIsAddingChild(false);
    setAddingToParentId(null);
    setItemForm({ label: item.label, href: item.href });
    setIsDialogOpen(true);
  };

  const handleSaveItem = async () => {
    if (!currentMenu || !itemForm.label || !itemForm.href) return;

    setSaving(true);
    let items = [...(currentMenu.items as MenuItem[])];

    if (editingItem) {
      // Editing existing item
      if (editingParentId) {
        // Editing a child item
        items = items.map((item) =>
          item.id === editingParentId
            ? {
                ...item,
                children: (item.children || []).map((child) =>
                  child.id === editingItem.id
                    ? { ...child, label: itemForm.label, href: itemForm.href }
                    : child
                ),
              }
            : item
        );
      } else {
        // Editing a top-level item
        items = items.map((item) =>
          item.id === editingItem.id
            ? { ...item, label: itemForm.label, href: itemForm.href }
            : item
        );
      }
    } else if (isAddingChild && addingToParentId) {
      // Adding a child item
      items = items.map((item) =>
        item.id === addingToParentId
          ? {
              ...item,
              children: [
                ...(item.children || []),
                {
                  id: Date.now().toString(),
                  label: itemForm.label,
                  href: itemForm.href,
                },
              ],
            }
          : item
      );
    } else {
      // Adding a new top-level item
      items.push({
        id: Date.now().toString(),
        label: itemForm.label,
        href: itemForm.href,
        children: [],
      });
    }

    const { error } = await updateMenu(currentMenu.id, items);
    if (error) {
      toast.error("Failed to save menu");
    } else {
      const message = editingItem
        ? "Menu item updated"
        : isAddingChild
        ? "Sub-item added"
        : "Menu item added";
      toast.success(message);
      setIsDialogOpen(false);
    }
    setSaving(false);
  };

  const handleDeleteItem = async (itemId: string, parentId?: string) => {
    if (!currentMenu) return;
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    setSaving(true);
    let items = currentMenu.items as MenuItem[];

    if (parentId) {
      // Deleting a child item
      items = items.map((item) =>
        item.id === parentId
          ? {
              ...item,
              children: (item.children || []).filter(
                (child) => child.id !== itemId
              ),
            }
          : item
      );
    } else {
      // Deleting a top-level item
      items = items.filter((item) => item.id !== itemId);
    }

    const { error } = await updateMenu(currentMenu.id, items);
    if (error) {
      toast.error("Failed to delete menu item");
    } else {
      toast.success("Menu item deleted");
    }
    setSaving(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !currentMenu) return;

    const items = currentMenu.items as MenuItem[];
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedItems = arrayMove(items, oldIndex, newIndex);

    const { error } = await updateMenu(currentMenu.id, reorderedItems);
    if (error) {
      toast.error("Failed to reorder menu items");
    } else {
      toast.success("Menu order updated");
    }
  };

  const handleChildDragEnd = async (parentId: string, event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !currentMenu) return;

    const items = currentMenu.items as MenuItem[];
    const parentIndex = items.findIndex((item) => item.id === parentId);

    if (parentIndex === -1) return;

    const parent = items[parentIndex];
    const children = parent.children || [];

    const oldIndex = children.findIndex((child) => child.id === active.id);
    const newIndex = children.findIndex((child) => child.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedChildren = arrayMove(children, oldIndex, newIndex);
    const updatedItems = items.map((item) =>
      item.id === parentId ? { ...item, children: reorderedChildren } : item
    );

    const { error } = await updateMenu(currentMenu.id, updatedItems);
    if (error) {
      toast.error("Failed to reorder sub-items");
    } else {
      toast.success("Sub-item order updated");
    }
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
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Navigation Menus
        </h1>
        <p className="font-body text-muted-foreground">
          Manage your store navigation with nested sub-menus. Changes sync
          instantly.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="header" className="gap-2">
            <LayoutTemplate size={16} />
            Header Menu
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2">
            <Footprints size={16} />
            Footer Menu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MenuItemsList
              menu={
                headerMenu
                  ? {
                      id: headerMenu.id,
                      name: headerMenu.name,
                      items: headerMenu.items as MenuItem[],
                    }
                  : null
              }
              menuType="header"
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onAddChild={handleAddChild}
              onDragEnd={handleDragEnd}
              onChildDragEnd={handleChildDragEnd}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="footer">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MenuItemsList
              menu={
                footerMenu
                  ? {
                      id: footerMenu.id,
                      name: footerMenu.name,
                      items: footerMenu.items as MenuItem[],
                    }
                  : null
              }
              menuType="footer"
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onAddChild={handleAddChild}
              onDragEnd={handleDragEnd}
              onChildDragEnd={handleChildDragEnd}
            />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Item Dialog */}
      <MenuItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={itemForm}
        onFormChange={setItemForm}
        onSave={handleSaveItem}
        saving={saving}
        isEditing={!!editingItem}
        isAddingChild={isAddingChild}
        parentLabel={getParentLabel()}
      />
    </div>
  );
};

export default AdminMenus;
