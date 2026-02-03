import { useState } from "react";
import { useAdminData } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ExternalLink,
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
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itemForm, setItemForm] = useState({ label: "", href: "" });

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
    if (!selectedMenu || !itemForm.label || !itemForm.href) return;

    setSaving(true);
    let items = [...(selectedMenu.items as MenuItem[])];

    if (editingItem) {
      // Update existing item
      items = items.map((item) =>
        item.id === editingItem.id
          ? { ...item, label: itemForm.label, href: itemForm.href }
          : item
      );
    } else {
      // Add new item
      items.push({
        id: Date.now().toString(),
        label: itemForm.label,
        href: itemForm.href,
        children: [],
      });
    }

    const { error } = await updateMenu(selectedMenu.id, items);
    if (error) {
      toast.error("Failed to save menu");
    } else {
      toast.success(editingItem ? "Menu item updated" : "Menu item added");
      setSelectedMenu({ ...selectedMenu, items });
      setIsDialogOpen(false);
    }
    setSaving(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedMenu) return;
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    setSaving(true);
    const items = (selectedMenu.items as MenuItem[]).filter(
      (item) => item.id !== itemId
    );

    const { error } = await updateMenu(selectedMenu.id, items);
    if (error) {
      toast.error("Failed to delete menu item");
    } else {
      toast.success("Menu item deleted");
      setSelectedMenu({ ...selectedMenu, items });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Navigation Menus
        </h1>
        <p className="font-body text-muted-foreground">
          Manage your store navigation menus. Changes sync instantly to storefront.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Menu List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Available Menus
          </h3>
          {menus.map((menu, index) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`border-0 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                  selectedMenu?.id === menu.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => setSelectedMenu(menu)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <Menu className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-body font-medium text-foreground">
                      {menu.name}
                    </h4>
                    <p className="font-body text-xs text-muted-foreground">
                      {(menu.items as MenuItem[])?.length || 0} items
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Menu Editor */}
        <div className="lg:col-span-2">
          {selectedMenu ? (
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-xl">
                  {selectedMenu.name}
                </CardTitle>
                <Button size="sm" onClick={handleAddItem} className="gap-2">
                  <Plus size={16} />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                {(selectedMenu.items as MenuItem[])?.length === 0 ? (
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
                    {(selectedMenu.items as MenuItem[]).map((item, index) => (
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
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Menu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg text-foreground mb-2">
                  Select a menu
                </h3>
                <p className="font-body text-muted-foreground">
                  Choose a menu from the left to edit its items
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
