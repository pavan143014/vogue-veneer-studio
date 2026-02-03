import { useState, useEffect } from "react";
import { useAdminData } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Store,
  Mail,
  Globe,
  Truck,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminSettings = () => {
  const { siteSettings, loading, updateSetting } = useAdminData();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    setFormData(siteSettings);
  }, [siteSettings]);

  const handleChange = (section: string, key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    const { error } = await updateSetting(section, formData[section]);
    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved successfully");
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
          Settings
        </h1>
        <p className="font-body text-muted-foreground">
          Configure your store settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="general" className="gap-2">
            <Store size={16} />
            General
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail size={16} />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Globe size={16} />
            Social
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck size={16} />
            Shipping
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  General Settings
                </CardTitle>
                <CardDescription className="font-body">
                  Basic store information and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Store Name</Label>
                    <Input
                      id="site_name"
                      value={formData.general?.site_name || ""}
                      onChange={(e) =>
                        handleChange("general", "site_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.general?.tagline || ""}
                      onChange={(e) =>
                        handleChange("general", "tagline", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={formData.general?.currency || "INR"}
                      onChange={(e) =>
                        handleChange("general", "currency", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency_symbol">Currency Symbol</Label>
                    <Input
                      id="currency_symbol"
                      value={formData.general?.currency_symbol || "₹"}
                      onChange={(e) =>
                        handleChange("general", "currency_symbol", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={() => handleSave("general")}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription className="font-body">
                  How customers can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact?.email || ""}
                    onChange={(e) =>
                      handleChange("contact", "email", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.contact?.phone || ""}
                    onChange={(e) =>
                      handleChange("contact", "phone", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.contact?.address || ""}
                    onChange={(e) =>
                      handleChange("contact", "address", e.target.value)
                    }
                  />
                </div>
                <div className="pt-4">
                  <Button
                    onClick={() => handleSave("contact")}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Social Settings */}
        <TabsContent value="social">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Social Media Links
                </CardTitle>
                <CardDescription className="font-body">
                  Connect your social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.social?.instagram || ""}
                      onChange={(e) =>
                        handleChange("social", "instagram", e.target.value)
                      }
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.social?.facebook || ""}
                      onChange={(e) =>
                        handleChange("social", "facebook", e.target.value)
                      }
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.social?.twitter || ""}
                      onChange={(e) =>
                        handleChange("social", "twitter", e.target.value)
                      }
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={formData.social?.youtube || ""}
                      onChange={(e) =>
                        handleChange("social", "youtube", e.target.value)
                      }
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={() => handleSave("social")}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Shipping Settings
                </CardTitle>
                <CardDescription className="font-body">
                  Configure shipping rates and thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="free_shipping_threshold">
                      Free Shipping Threshold (₹)
                    </Label>
                    <Input
                      id="free_shipping_threshold"
                      type="number"
                      value={formData.shipping?.free_shipping_threshold || "999"}
                      onChange={(e) =>
                        handleChange(
                          "shipping",
                          "free_shipping_threshold",
                          e.target.value
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground font-body">
                      Orders above this amount get free shipping
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default_shipping_cost">
                      Default Shipping Cost (₹)
                    </Label>
                    <Input
                      id="default_shipping_cost"
                      type="number"
                      value={formData.shipping?.default_shipping_cost || "99"}
                      onChange={(e) =>
                        handleChange(
                          "shipping",
                          "default_shipping_cost",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={() => handleSave("shipping")}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
