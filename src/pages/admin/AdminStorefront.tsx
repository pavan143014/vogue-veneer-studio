import { useState, useEffect } from "react";
import { useAdminStorefrontContent } from "@/hooks/useStorefrontContent";
import { useAdminData } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Save,
  Image as ImageIcon,
  Type,
  Megaphone,
  Sparkles,
  LayoutDashboard,
  Eye,
  EyeOff,
  PanelTop,
  PanelBottom,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StorageGallery } from "@/components/admin/StorageGallery";

const AdminStorefront = () => {
  const { sections, loading, updateSection, toggleSection } = useAdminStorefrontContent();
  const { banners } = useAdminData();
  const [saving, setSaving] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, any>>({});

  useEffect(() => {
    if (sections.length > 0) {
      const contentMap: Record<string, any> = {};
      sections.forEach(s => {
        contentMap[s.section_key] = s.content;
      });
      setEditedContent(contentMap);
    }
  }, [sections]);

  const handleSave = async (sectionKey: string) => {
    setSaving(sectionKey);
    const { error } = await updateSection(sectionKey, editedContent[sectionKey]);
    if (error) {
      toast.error("Failed to save changes");
    } else {
      toast.success("Changes saved successfully");
    }
    setSaving(null);
  };

  const updateField = (sectionKey: string, field: string, value: any) => {
    setEditedContent(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const updateStatField = (sectionKey: string, index: number, field: string, value: string) => {
    setEditedContent(prev => {
      const stats = [...(prev[sectionKey]?.stats || [])];
      stats[index] = { ...stats[index], [field]: value };
      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          stats,
        },
      };
    });
  };

  const updateArrayItem = (sectionKey: string, arrayField: string, index: number, field: string, value: string) => {
    setEditedContent(prev => {
      const arr = [...(prev[sectionKey]?.[arrayField] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [sectionKey]: { ...prev[sectionKey], [arrayField]: arr } };
    });
  };

  const addArrayItem = (sectionKey: string, arrayField: string, defaultItem: any) => {
    setEditedContent(prev => {
      const arr = [...(prev[sectionKey]?.[arrayField] || []), defaultItem];
      return { ...prev, [sectionKey]: { ...prev[sectionKey], [arrayField]: arr } };
    });
  };

  const removeArrayItem = (sectionKey: string, arrayField: string, index: number) => {
    setEditedContent(prev => {
      const arr = [...(prev[sectionKey]?.[arrayField] || [])];
      arr.splice(index, 1);
      return { ...prev, [sectionKey]: { ...prev[sectionKey], [arrayField]: arr } };
    });
  };

  const updatePromoMessage = (index: number, value: string) => {
    setEditedContent(prev => {
      const msgs = [...(prev.header?.promo_messages || [])];
      msgs[index] = value;
      return { ...prev, header: { ...prev.header, promo_messages: msgs } };
    });
  };

  const addPromoMessage = () => {
    setEditedContent(prev => {
      const msgs = [...(prev.header?.promo_messages || []), "New promo message"];
      return { ...prev, header: { ...prev.header, promo_messages: msgs } };
    });
  };

  const removePromoMessage = (index: number) => {
    setEditedContent(prev => {
      const msgs = [...(prev.header?.promo_messages || [])];
      msgs.splice(index, 1);
      return { ...prev, header: { ...prev.header, promo_messages: msgs } };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const heroContent = editedContent.hero || {};
  const brandStoryContent = editedContent.brand_story || {};
  const promoFlashContent = editedContent.promo_flash || {};
  const promoSecondaryContent = editedContent.promo_secondary || {};
  const promoPrimaryContent = editedContent.promo_primary || {};
  const headerContent = editedContent.header || {};
  const footerContent = editedContent.footer || {};

  const activeBanners = banners.filter(b => b.is_active);

  const SaveButton = ({ sectionKey, label }: { sectionKey: string; label: string }) => (
    <div className="flex justify-end pt-4">
      <Button onClick={() => handleSave(sectionKey)} disabled={saving === sectionKey}>
        {saving === sectionKey ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        {label}
      </Button>
    </div>
  );

  const LinkEditor = ({ sectionKey, arrayField, links }: { sectionKey: string; arrayField: string; links: any[] }) => (
    <div className="space-y-3">
      {(links || []).map((link: any, i: number) => (
        <div key={i} className="flex gap-2 items-center">
          <Input value={link.name || link.label || ""} onChange={(e) => updateArrayItem(sectionKey, arrayField, i, link.name !== undefined ? "name" : "label", e.target.value)} placeholder="Label" className="flex-1" />
          <Input value={link.href || ""} onChange={(e) => updateArrayItem(sectionKey, arrayField, i, "href", e.target.value)} placeholder="/path" className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => removeArrayItem(sectionKey, arrayField, i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => addArrayItem(sectionKey, arrayField, { name: "", href: "#" })}>
        <Plus className="h-4 w-4 mr-1" /> Add Link
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Storefront Content</h1>
          <p className="font-body text-muted-foreground">Edit homepage sections, header, footer, and promotional content</p>
        </div>
      </div>

      {activeBanners.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />Active Banners ({activeBanners.length})
            </CardTitle>
            <CardDescription>These banners are synced and displayed on your storefront</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activeBanners.map(banner => (
                <Badge key={banner.id} variant="secondary" className="px-3 py-1">{banner.title}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="header" className="gap-2">
            <PanelTop className="h-4 w-4" />
            <span className="hidden sm:inline">Header</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2">
            <PanelBottom className="h-4 w-4" />
            <span className="hidden sm:inline">Footer</span>
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="brand" className="gap-2">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Brand Story</span>
          </TabsTrigger>
          <TabsTrigger value="promos" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Promos</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>
        </TabsList>

        {/* ====== HEADER TAB ====== */}
        <TabsContent value="header" className="space-y-4 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Logo & Branding</CardTitle>
                <CardDescription>Upload a logo image or use text. If an image is set, it replaces the text logo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo Image (optional — overrides text logo)</Label>
                  {headerContent.logo_image_url && (
                    <div className="flex items-center gap-4 p-3 border border-border rounded-lg bg-muted/30">
                      <img src={headerContent.logo_image_url} alt="Logo preview" className="h-10 w-auto object-contain" />
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => updateField("header", "logo_image_url", "")}>
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  )}
                  <ImageUpload
                    value={headerContent.logo_image_url || ""}
                    onChange={(url) => updateField("header", "logo_image_url", url)}
                    folder="logos"
                    label="Logo"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Logo Text (Primary){headerContent.logo_image_url ? " — hidden when image is set" : ""}</Label>
                    <Input value={headerContent.logo_text_1 || ""} onChange={(e) => updateField("header", "logo_text_1", e.target.value)} placeholder="e.g., Aroma" />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo Text (Secondary){headerContent.logo_image_url ? " — hidden when image is set" : ""}</Label>
                    <Input value={headerContent.logo_text_2 || ""} onChange={(e) => updateField("header", "logo_text_2", e.target.value)} placeholder="e.g., Ethnic" />
                  </div>
                </div>
                <SaveButton sectionKey="header" label="Save Header" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Promo Banner Messages</CardTitle>
                <CardDescription>Rotating promotional messages shown at the top of the site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(headerContent.promo_messages || []).map((msg: string, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input value={msg} onChange={(e) => updatePromoMessage(i, e.target.value)} placeholder="Promo message..." className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => removePromoMessage(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addPromoMessage}>
                  <Plus className="h-4 w-4 mr-1" /> Add Message
                </Button>
                <SaveButton sectionKey="header" label="Save Header" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Sub-Header Quick Links</CardTitle>
                <CardDescription>Links displayed in the secondary navigation bar below the main header</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(headerContent.sub_links || []).map((link: any, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input value={link.label || ""} onChange={(e) => updateArrayItem("header", "sub_links", i, "label", e.target.value)} placeholder="Label" className="flex-1" />
                    <Input value={link.href || ""} onChange={(e) => updateArrayItem("header", "sub_links", i, "href", e.target.value)} placeholder="/path" className="flex-1" />
                    <select value={link.icon || "tag"} onChange={(e) => updateArrayItem("header", "sub_links", i, "icon", e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option value="tag">Tag</option>
                      <option value="heart">Heart</option>
                      <option value="percent">Percent</option>
                      <option value="truck">Truck</option>
                      <option value="gift">Gift</option>
                      <option value="sparkles">Sparkles</option>
                    </select>
                    <Button variant="ghost" size="icon" onClick={() => removeArrayItem("header", "sub_links", i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addArrayItem("header", "sub_links", { label: "", href: "#", icon: "tag" })}>
                  <Plus className="h-4 w-4 mr-1" /> Add Link
                </Button>
                <SaveButton sectionKey="header" label="Save Header" />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ====== FOOTER TAB ====== */}
        <TabsContent value="footer" className="space-y-4 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Brand Info</CardTitle>
                <CardDescription>Footer brand name, description, and contact info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo Image (optional — overrides text logo)</Label>
                  {footerContent.logo_image_url && (
                    <div className="flex items-center gap-4 p-3 border border-border rounded-lg bg-muted/30">
                      <img src={footerContent.logo_image_url} alt="Footer logo preview" className="h-10 w-auto object-contain" />
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => updateField("footer", "logo_image_url", "")}>
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  )}
                  <ImageUpload
                    value={footerContent.logo_image_url || ""}
                    onChange={(url) => updateField("footer", "logo_image_url", url)}
                    folder="logos"
                    label="Footer Logo"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Brand Name (Primary){footerContent.logo_image_url ? " — hidden when image is set" : ""}</Label>
                    <Input value={footerContent.brand_name_1 || ""} onChange={(e) => updateField("footer", "brand_name_1", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Brand Name (Secondary){footerContent.logo_image_url ? " — hidden when image is set" : ""}</Label>
                    <Input value={footerContent.brand_name_2 || ""} onChange={(e) => updateField("footer", "brand_name_2", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Brand Description</Label>
                  <Textarea value={footerContent.brand_description || ""} onChange={(e) => updateField("footer", "brand_description", e.target.value)} rows={3} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={footerContent.email || ""} onChange={(e) => updateField("footer", "email", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={footerContent.phone || ""} onChange={(e) => updateField("footer", "phone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={footerContent.address || ""} onChange={(e) => updateField("footer", "address", e.target.value)} />
                  </div>
                </div>
                <SaveButton sectionKey="footer" label="Save Footer" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Newsletter Section</CardTitle>
                <CardDescription>Newsletter title and subtitle displayed in the footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={footerContent.newsletter_title || ""} onChange={(e) => updateField("footer", "newsletter_title", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input value={footerContent.newsletter_subtitle || ""} onChange={(e) => updateField("footer", "newsletter_subtitle", e.target.value)} />
                  </div>
                </div>
                <SaveButton sectionKey="footer" label="Save Footer" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Social Media Links</CardTitle>
                <CardDescription>Social media URLs shown in the footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(footerContent.social_links || []).map((social: any, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    <select value={social.platform || "facebook"} onChange={(e) => updateArrayItem("footer", "social_links", i, "platform", e.target.value)} className="h-10 px-3 rounded-md border border-input bg-background text-sm w-32">
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="youtube">YouTube</option>
                    </select>
                    <Input value={social.url || ""} onChange={(e) => updateArrayItem("footer", "social_links", i, "url", e.target.value)} placeholder="https://..." className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => removeArrayItem("footer", "social_links", i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addArrayItem("footer", "social_links", { platform: "facebook", url: "#" })}>
                  <Plus className="h-4 w-4 mr-1" /> Add Social Link
                </Button>
                <SaveButton sectionKey="footer" label="Save Footer" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Shop Links</CardTitle>
                <CardDescription>Links shown in the "Shop" column of the footer</CardDescription>
              </CardHeader>
              <CardContent>
                <LinkEditor sectionKey="footer" arrayField="shop_links" links={footerContent.shop_links || []} />
                <SaveButton sectionKey="footer" label="Save Footer" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Help Links</CardTitle>
                <CardDescription>Links shown in the "Help" column of the footer</CardDescription>
              </CardHeader>
              <CardContent>
                <LinkEditor sectionKey="footer" arrayField="help_links" links={footerContent.help_links || []} />
                <SaveButton sectionKey="footer" label="Save Footer" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Company Links</CardTitle>
                <CardDescription>Links shown in the "Company" column of the footer</CardDescription>
              </CardHeader>
              <CardContent>
                <LinkEditor sectionKey="footer" arrayField="company_links" links={footerContent.company_links || []} />
                <SaveButton sectionKey="footer" label="Save Footer" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Bottom Bar</CardTitle>
                <CardDescription>Copyright text and bottom links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Copyright Text</Label>
                  <Input value={footerContent.copyright_text || ""} onChange={(e) => updateField("footer", "copyright_text", e.target.value)} />
                </div>
                <Label>Bottom Links</Label>
                <LinkEditor sectionKey="footer" arrayField="bottom_links" links={footerContent.bottom_links || []} />
                <SaveButton sectionKey="footer" label="Save Footer" />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ====== HERO TAB ====== */}
        <TabsContent value="hero" className="space-y-4 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Hero Section</CardTitle>
                <CardDescription>Edit the main hero banner on your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Badge Text</Label>
                    <Input value={heroContent.badge || ""} onChange={(e) => updateField("hero", "badge", e.target.value)} placeholder="e.g., New Collection 2026" />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Badge</Label>
                    <Input value={heroContent.discount_text || ""} onChange={(e) => updateField("hero", "discount_text", e.target.value)} placeholder="e.g., UPTO 40% OFF" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title Line 1</Label>
                    <Input value={heroContent.title_line1 || ""} onChange={(e) => updateField("hero", "title_line1", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Line 2 (Highlighted)</Label>
                    <Input value={heroContent.title_line2 || ""} onChange={(e) => updateField("hero", "title_line2", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={heroContent.description || ""} onChange={(e) => updateField("hero", "description", e.target.value)} rows={3} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Primary CTA</Label>
                    <Input value={heroContent.cta_primary || ""} onChange={(e) => updateField("hero", "cta_primary", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary CTA</Label>
                    <Input value={heroContent.cta_secondary || ""} onChange={(e) => updateField("hero", "cta_secondary", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Price</Label>
                    <Input value={heroContent.starting_price || ""} onChange={(e) => updateField("hero", "starting_price", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Trust Stats</Label>
                  <div className="grid gap-3 md:grid-cols-4">
                    {(heroContent.stats || []).map((stat: any, index: number) => (
                      <div key={index} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <Input value={stat.value} onChange={(e) => updateStatField("hero", index, "value", e.target.value)} placeholder="Value" className="text-center font-bold" />
                        <Input value={stat.label} onChange={(e) => updateStatField("hero", index, "label", e.target.value)} placeholder="Label" className="text-center text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
                <SaveButton sectionKey="hero" label="Save Hero" />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ====== BRAND STORY TAB ====== */}
        <TabsContent value="brand" className="space-y-4 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Brand Story Section</CardTitle>
                <CardDescription>Edit the "About Us" section on your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input value={brandStoryContent.badge || ""} onChange={(e) => updateField("brand_story", "badge", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Excellence</Label>
                    <Input value={brandStoryContent.years_of_excellence || ""} onChange={(e) => updateField("brand_story", "years_of_excellence", e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title Line 1</Label>
                    <Input value={brandStoryContent.title_line1 || ""} onChange={(e) => updateField("brand_story", "title_line1", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Line 2 (Highlighted)</Label>
                    <Input value={brandStoryContent.title_line2 || ""} onChange={(e) => updateField("brand_story", "title_line2", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Paragraph 1</Label>
                  <Textarea value={brandStoryContent.paragraph1 || ""} onChange={(e) => updateField("brand_story", "paragraph1", e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Paragraph 2</Label>
                  <Textarea value={brandStoryContent.paragraph2 || ""} onChange={(e) => updateField("brand_story", "paragraph2", e.target.value)} rows={3} />
                </div>
                <div className="space-y-3">
                  <Label>Stats</Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {(brandStoryContent.stats || []).map((stat: any, index: number) => (
                      <div key={index} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <Input value={stat.value} onChange={(e) => updateStatField("brand_story", index, "value", e.target.value)} placeholder="Value" className="text-center font-bold" />
                        <Input value={stat.label} onChange={(e) => updateStatField("brand_story", index, "label", e.target.value)} placeholder="Label" className="text-center text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
                <SaveButton sectionKey="brand_story" label="Save Brand Story" />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ====== PROMOS TAB ====== */}
        <TabsContent value="promos" className="space-y-4 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-display">Flash Sale Banner</CardTitle>
                    <CardDescription>The scrolling promo banner at the top</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {promoFlashContent.is_active ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><Eye className="h-3 w-3 mr-1" /> Active</Badge>
                    ) : (
                      <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1" /> Hidden</Badge>
                    )}
                    <Switch checked={promoFlashContent.is_active || false} onCheckedChange={(checked) => updateField("promo_flash", "is_active", checked)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Banner Text</Label>
                  <Input value={promoFlashContent.text || ""} onChange={(e) => updateField("promo_flash", "text", e.target.value)} placeholder="e.g., ⚡ FLASH SALE: Extra 30% OFF!" />
                </div>
                <SaveButton sectionKey="promo_flash" label="Save" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Secondary Promo</CardTitle>
                <CardDescription>The "Buy 2 Get 1 Free" style banner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input value={promoSecondaryContent.badge || ""} onChange={(e) => updateField("promo_secondary", "badge", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Button</Label>
                    <Input value={promoSecondaryContent.cta || ""} onChange={(e) => updateField("promo_secondary", "cta", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={promoSecondaryContent.title || ""} onChange={(e) => updateField("promo_secondary", "title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input value={promoSecondaryContent.subtitle || ""} onChange={(e) => updateField("promo_secondary", "subtitle", e.target.value)} />
                </div>
                <SaveButton sectionKey="promo_secondary" label="Save" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Primary Promo (Festive)</CardTitle>
                <CardDescription>The large promotional banner with gradient background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input value={promoPrimaryContent.badge || ""} onChange={(e) => updateField("promo_primary", "badge", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Line 1</Label>
                    <Input value={promoPrimaryContent.title_line1 || ""} onChange={(e) => updateField("promo_primary", "title_line1", e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title Line 2 (Highlighted)</Label>
                    <Input value={promoPrimaryContent.title_line2 || ""} onChange={(e) => updateField("promo_primary", "title_line2", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary CTA</Label>
                    <Input value={promoPrimaryContent.cta_primary || ""} onChange={(e) => updateField("promo_primary", "cta_primary", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={promoPrimaryContent.description || ""} onChange={(e) => updateField("promo_primary", "description", e.target.value)} rows={2} />
                </div>
                <SaveButton sectionKey="promo_primary" label="Save" />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ====== IMAGES TAB ====== */}
        <TabsContent value="images" className="space-y-4 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Hero Image</CardTitle>
                <CardDescription>Upload or update the main hero banner image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload label="Hero Banner" value={heroContent.image_url || ""} onChange={(url) => updateField("hero", "image_url", url)} folder="storefront" aspectRatio="video" />
                <SaveButton sectionKey="hero" label="Save Hero Image" />
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Brand Story Image</CardTitle>
                <CardDescription>Upload or update the about section image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload label="Brand Story" value={brandStoryContent.image_url || ""} onChange={(url) => updateField("brand_story", "image_url", url)} folder="storefront" aspectRatio="square" />
                <SaveButton sectionKey="brand_story" label="Save Brand Image" />
              </CardContent>
            </Card>
            <StorageGallery />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStorefront;
