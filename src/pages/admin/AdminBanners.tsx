import { useState } from "react";
import { useAdminData } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit2,
  Trash2,
  Image,
  Loader2,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ImageUpload } from "@/components/admin/ImageUpload";

const AdminBanners = () => {
  const { banners, loading, createBanner, updateBanner, deleteBanner } =
    useAdminData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    link_url: "",
    is_active: true,
    position: 0,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image_url: "",
      link_url: "",
      is_active: true,
      position: banners.length,
    });
    setEditingBanner(null);
  };

  const openEditDialog = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image_url: banner.image_url || "",
      link_url: banner.link_url || "",
      is_active: banner.is_active,
      position: banner.position,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (editingBanner) {
      const { error } = await updateBanner(editingBanner.id, formData);
      if (error) {
        toast.error("Failed to update banner");
      } else {
        toast.success("Banner updated");
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await createBanner(formData);
      if (error) {
        toast.error("Failed to create banner");
      } else {
        toast.success("Banner created");
        setIsDialogOpen(false);
        resetForm();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    const { error } = await deleteBanner(id);
    if (error) {
      toast.error("Failed to delete banner");
    } else {
      toast.success("Banner deleted");
    }
  };

  const handleToggleActive = async (banner: any) => {
    const { error } = await updateBanner(banner.id, {
      is_active: !banner.is_active,
    });
    if (error) {
      toast.error("Failed to update banner");
    } else {
      toast.success(`Banner ${!banner.is_active ? "enabled" : "disabled"}`);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Banners
          </h1>
          <p className="font-body text-muted-foreground">
            Manage homepage banners and promotions
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Summer Sale"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="e.g., Up to 50% off"
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                label="Banner Image"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="banners"
                aspectRatio="banner"
              />

              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) =>
                    setFormData({ ...formData, link_url: e.target.value })
                  }
                  placeholder="/shop or https://..."
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Banner is active</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingBanner ? (
                    "Update Banner"
                  ) : (
                    "Create Banner"
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

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg text-foreground mb-2">
              No banners yet
            </h3>
            <p className="font-body text-muted-foreground">
              Create your first banner to showcase on your homepage
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Image Preview */}
                    <div className="w-48 h-32 bg-muted flex-shrink-0 relative overflow-hidden">
                      {banner.image_url ? (
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant="outline"
                          className={
                            banner.is_active
                              ? "bg-green-500/90 text-white border-0"
                              : "bg-gray-500/90 text-white border-0"
                          }
                        >
                          {banner.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <div>
                          <h4 className="font-display font-semibold text-foreground">
                            {banner.title}
                          </h4>
                          {banner.subtitle && (
                            <p className="font-body text-sm text-muted-foreground">
                              {banner.subtitle}
                            </p>
                          )}
                          {banner.link_url && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                              <ExternalLink size={10} />
                              <span className="truncate max-w-[200px]">
                                {banner.link_url}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Switch
                          checked={banner.is_active}
                          onCheckedChange={() => handleToggleActive(banner)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(banner)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
