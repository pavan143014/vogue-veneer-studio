import { useState, useEffect } from "react";
import { useAdminData } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Store,
  Mail,
  Globe,
  Truck,
  Loader2,
  Save,
  Facebook,
  ShoppingCart,
  Code,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
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

  const handleChange = (section: string, key: string, value: string | boolean) => {
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
          Configure your store settings, tracking, and integrations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 flex-wrap h-auto gap-1">
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
          <TabsTrigger value="facebook_pixel" className="gap-2">
            <Facebook size={16} />
            Facebook Pixel
          </TabsTrigger>
          <TabsTrigger value="google_merchant" className="gap-2">
            <ShoppingCart size={16} />
            Google Merchant
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

        {/* Facebook Pixel Settings */}
        <TabsContent value="facebook_pixel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      <Facebook className="h-5 w-5 text-[#1877F2]" />
                      Facebook Pixel
                    </CardTitle>
                    <CardDescription className="font-body">
                      Track conversions and optimize Facebook/Meta ads
                    </CardDescription>
                  </div>
                  {formData.facebook_pixel?.enabled && formData.facebook_pixel?.pixel_id ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Configured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <h4 className="font-body font-medium text-foreground">Enable Facebook Pixel</h4>
                    <p className="text-sm text-muted-foreground font-body">
                      Track page views, add to cart, and purchase events
                    </p>
                  </div>
                  <Switch
                    checked={formData.facebook_pixel?.enabled || false}
                    onCheckedChange={(checked) =>
                      handleChange("facebook_pixel", "enabled", checked)
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pixel_id">Pixel ID</Label>
                    <Input
                      id="pixel_id"
                      value={formData.facebook_pixel?.pixel_id || ""}
                      onChange={(e) =>
                        handleChange("facebook_pixel", "pixel_id", e.target.value)
                      }
                      placeholder="Enter your Facebook Pixel ID (e.g., 123456789012345)"
                    />
                    <p className="text-xs text-muted-foreground font-body">
                      Find your Pixel ID in{" "}
                      <a
                        href="https://business.facebook.com/events_manager"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Facebook Events Manager
                        <ExternalLink size={10} />
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="access_token">Conversions API Access Token (Optional)</Label>
                    <Input
                      id="access_token"
                      type="password"
                      value={formData.facebook_pixel?.access_token || ""}
                      onChange={(e) =>
                        handleChange("facebook_pixel", "access_token", e.target.value)
                      }
                      placeholder="Enter access token for server-side tracking"
                    />
                    <p className="text-xs text-muted-foreground font-body">
                      For enhanced matching and server-side event tracking
                    </p>
                  </div>
                </div>

                {/* Events Tracking Options */}
                <div className="space-y-3">
                  <h4 className="font-body font-medium text-foreground">Track Events</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { key: "track_page_view", label: "Page View", desc: "Track all page visits" },
                      { key: "track_view_content", label: "View Content", desc: "Track product views" },
                      { key: "track_add_to_cart", label: "Add to Cart", desc: "Track cart additions" },
                      { key: "track_purchase", label: "Purchase", desc: "Track completed orders" },
                      { key: "track_initiate_checkout", label: "Initiate Checkout", desc: "Track checkout starts" },
                      { key: "track_search", label: "Search", desc: "Track product searches" },
                    ].map((event) => (
                      <div
                        key={event.key}
                        className="flex items-center justify-between p-3 rounded-lg border bg-background"
                      >
                        <div>
                          <p className="font-body text-sm font-medium">{event.label}</p>
                          <p className="text-xs text-muted-foreground">{event.desc}</p>
                        </div>
                        <Switch
                          checked={formData.facebook_pixel?.[event.key] ?? true}
                          onCheckedChange={(checked) =>
                            handleChange("facebook_pixel", event.key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    onClick={() => handleSave("facebook_pixel")}
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

            {/* Code Preview */}
            {formData.facebook_pixel?.pixel_id && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    Pixel Code Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-muted-foreground">
{`<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${formData.facebook_pixel.pixel_id}');
  fbq('track', 'PageView');
</script>`}
                    </pre>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-body">
                    This code is automatically injected when the Pixel is enabled.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* Google Merchant Center Settings */}
        <TabsContent value="google_merchant">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-[#4285F4]" />
                      Google Merchant Center
                    </CardTitle>
                    <CardDescription className="font-body">
                      List products on Google Shopping and run Shopping ads
                    </CardDescription>
                  </div>
                  {formData.google_merchant?.enabled && formData.google_merchant?.merchant_id ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Configured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <h4 className="font-body font-medium text-foreground">Enable Google Merchant</h4>
                    <p className="text-sm text-muted-foreground font-body">
                      Sync products and enable Google Shopping features
                    </p>
                  </div>
                  <Switch
                    checked={formData.google_merchant?.enabled || false}
                    onCheckedChange={(checked) =>
                      handleChange("google_merchant", "enabled", checked)
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="merchant_id">Merchant Center ID</Label>
                    <Input
                      id="merchant_id"
                      value={formData.google_merchant?.merchant_id || ""}
                      onChange={(e) =>
                        handleChange("google_merchant", "merchant_id", e.target.value)
                      }
                      placeholder="Enter your Merchant Center ID (e.g., 123456789)"
                    />
                    <p className="text-xs text-muted-foreground font-body">
                      Find your ID in{" "}
                      <a
                        href="https://merchants.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Google Merchant Center
                        <ExternalLink size={10} />
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gtag_id">Google Tag (gtag.js) ID</Label>
                    <Input
                      id="gtag_id"
                      value={formData.google_merchant?.gtag_id || ""}
                      onChange={(e) =>
                        handleChange("google_merchant", "gtag_id", e.target.value)
                      }
                      placeholder="e.g., AW-123456789 or G-XXXXXXXXXX"
                    />
                    <p className="text-xs text-muted-foreground font-body">
                      For conversion tracking and remarketing
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conversion_id">Conversion ID (Optional)</Label>
                    <Input
                      id="conversion_id"
                      value={formData.google_merchant?.conversion_id || ""}
                      onChange={(e) =>
                        handleChange("google_merchant", "conversion_id", e.target.value)
                      }
                      placeholder="e.g., AW-123456789/AbCdEfGhIjKlMnOp"
                    />
                    <p className="text-xs text-muted-foreground font-body">
                      For tracking purchase conversions in Google Ads
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conversion_label">Conversion Label (Optional)</Label>
                    <Input
                      id="conversion_label"
                      value={formData.google_merchant?.conversion_label || ""}
                      onChange={(e) =>
                        handleChange("google_merchant", "conversion_label", e.target.value)
                      }
                      placeholder="e.g., purchase"
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-body font-medium text-foreground">Features</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { key: "enable_remarketing", label: "Remarketing", desc: "Dynamic remarketing tags" },
                      { key: "enable_conversion_tracking", label: "Conversion Tracking", desc: "Track purchases" },
                      { key: "enable_product_feed", label: "Product Feed", desc: "Auto-sync products" },
                      { key: "enable_analytics", label: "Enhanced Analytics", desc: "E-commerce analytics" },
                    ].map((feature) => (
                      <div
                        key={feature.key}
                        className="flex items-center justify-between p-3 rounded-lg border bg-background"
                      >
                        <div>
                          <p className="font-body text-sm font-medium">{feature.label}</p>
                          <p className="text-xs text-muted-foreground">{feature.desc}</p>
                        </div>
                        <Switch
                          checked={formData.google_merchant?.[feature.key] ?? true}
                          onCheckedChange={(checked) =>
                            handleChange("google_merchant", feature.key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    onClick={() => handleSave("google_merchant")}
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

            {/* Google Tag Code Preview */}
            {formData.google_merchant?.gtag_id && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    Google Tag Code Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-muted-foreground">
{`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${formData.google_merchant.gtag_id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${formData.google_merchant.gtag_id}');
</script>`}
                    </pre>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-body">
                    This code is automatically injected when Google Merchant is enabled.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Setup Guide */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/5 to-green-500/5">
              <CardHeader>
                <CardTitle className="font-display text-lg">Setup Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 font-body text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                    <span>Create a Google Merchant Center account at merchants.google.com</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                    <span>Verify and claim your website URL in Merchant Center</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                    <span>Copy your Merchant ID and paste it above</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
                    <span>Link Google Ads for conversion tracking (optional)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">5</span>
                    <span>Enable the integration and save changes</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
