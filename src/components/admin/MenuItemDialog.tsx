import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface MenuItemForm {
  label: string;
  href: string;
}

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: MenuItemForm;
  onFormChange: (form: MenuItemForm) => void;
  onSave: () => void;
  saving: boolean;
  isEditing: boolean;
  isAddingChild: boolean;
  parentLabel?: string;
}

export const MenuItemDialog = ({
  open,
  onOpenChange,
  form,
  onFormChange,
  onSave,
  saving,
  isEditing,
  isAddingChild,
  parentLabel,
}: MenuItemDialogProps) => {
  const getTitle = () => {
    if (isAddingChild && parentLabel) {
      return `Add Sub-item to "${parentLabel}"`;
    }
    return isEditing ? "Edit Menu Item" : "Add Menu Item";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={form.label}
              onChange={(e) =>
                onFormChange({ ...form, label: e.target.value })
              }
              placeholder="e.g., Home, Shop, About"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="href">Link URL</Label>
            <Input
              id="href"
              value={form.href}
              onChange={(e) =>
                onFormChange({ ...form, href: e.target.value })
              }
              placeholder="e.g., /, /shop, /about"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onSave}
              disabled={saving || !form.label || !form.href}
              className="flex-1"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                "Update Item"
              ) : (
                "Add Item"
              )}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
