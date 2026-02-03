import { useState, useEffect } from "react";
import { useAdminData } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Menu,
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  Loader2,
  Link as LinkIcon,
  LayoutTemplate,
  Footprints,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

const AdminMenus = () => {
  const { menus, loading, updateMenu } = useAdminData();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itemForm, setItemForm] = useState({ label: "", href: "" });
  const [activeTab, setActiveTab] = useState("header");

  const headerMenu = menus.find((m) => m.slug === "header");
  const footerMenu = menus.find((m) => m.slug === "footer");

  const currentMenu = activeTab === "header" ? headerMenu : footerMenu;

  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({ label: "", href: "" });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({ label: item.label, href: item.href });
    setIsDialogOpen(true);
  };

  const handleSaveItem = async () => {
    if (!currentMenu || !itemForm.label || !itemForm.href) return;

    setSaving(true);
    let items = [...(currentMenu.items as MenuItem[])];

    if (editingItem) {
      items = items.map((item) =>
        item.id === editingItem.id
          ? { ...item, label: itemForm.label, href: itemForm.href }
          : item
      );
    } else {
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
      toast.success(editingItem ? "Menu item updated" : "Menu item added");
      setIsDialogOpen(false);
    }
    setSaving(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!currentMenu) return;
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    setSaving(true);
    const items = (currentMenu.items as MenuItem[]).filter(
      (item) => item.id !== itemId
    );

    const { error } = await updateMenu(currentMenu.id, items);
    if (error) {
      toast.error("Failed to delete menu item");
    } else {
      toast.success("Menu item deleted");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const MenuItemsList = ({ menu }: { menu: any }) => {
    if (!menu) return null;
    const items = menu.items as MenuItem[];

    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-xl">{menu.name}</CardTitle>
          <Button size="sm" onClick={handleAddItem} className="gap-2">
            <Plus size={16} />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          {items?.length === 0 ? (
            <div className="text-center py-12">
              <Menu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg text-foreground mb-2">
                No menu items
              </h3>
              <p className="font-body text-muted-foreground">
                Add your first menu item to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 group hover:bg-muted transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-foreground">
                      {item.label}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <LinkIcon size={10} />
                      <span className="truncate">{item.href}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Navigation Menus
        </h1>
        <p className="font-body text-muted-foreground">
          Manage your store navigation. Changes sync instantly to storefront.
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
            <MenuItemsList menu={headerMenu} />
          </motion.div>
        </TabsContent>

        <TabsContent value="footer">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MenuItemsList menu={footerMenu} />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={itemForm.label}
                onChange={(e) =>
                  setItemForm({ ...itemForm, label: e.target.value })
                }
                placeholder="e.g., Home, Shop, About"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="href">Link URL</Label>
              <Input
                id="href"
                value={itemForm.href}
                onChange={(e) =>
                  setItemForm({ ...itemForm, href: e.target.value })
                }
                placeholder="e.g., /, /shop, /about"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveItem}
                disabled={saving || !itemForm.label || !itemForm.href}
                className="flex-1"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingItem ? (
                  "Update Item"
                ) : (
                  "Add Item"
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMenus;
