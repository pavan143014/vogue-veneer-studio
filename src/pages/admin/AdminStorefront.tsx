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
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

  const activeBanners = banners.filter(b => b.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Storefront Content
          </h1>
          <p className="font-body text-muted-foreground">
            Edit homepage sections, banners, and promotional content
          </p>
        </div>
      </div>

      {/* Active Banners Preview */}
      {activeBanners.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Active Banners ({activeBanners.length})
            </CardTitle>
            <CardDescription>
              These banners are synced and displayed on your storefront
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activeBanners.map(banner => (
                <Badge key={banner.id} variant="secondary" className="px-3 py-1">
                  {banner.title}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
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

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Hero Section</CardTitle>
                <CardDescription>
                  Edit the main hero banner on your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Badge Text</Label>
                    <Input
                      value={heroContent.badge || ""}
                      onChange={(e) => updateField("hero", "badge", e.target.value)}
                      placeholder="e.g., New Collection 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Badge</Label>
                    <Input
                      value={heroContent.discount_text || ""}
                      onChange={(e) => updateField("hero", "discount_text", e.target.value)}
                      placeholder="e.g., UPTO 40% OFF"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title Line 1</Label>
                    <Input
                      value={heroContent.title_line1 || ""}
                      onChange={(e) => updateField("hero", "title_line1", e.target.value)}
                      placeholder="e.g., Where Tradition"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Line 2 (Highlighted)</Label>
                    <Input
                      value={heroContent.title_line2 || ""}
                      onChange={(e) => updateField("hero", "title_line2", e.target.value)}
                      placeholder="e.g., Meets Style"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={heroContent.description || ""}
                    onChange={(e) => updateField("hero", "description", e.target.value)}
                    placeholder="Main hero description..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Primary CTA</Label>
                    <Input
                      value={heroContent.cta_primary || ""}
                      onChange={(e) => updateField("hero", "cta_primary", e.target.value)}
                      placeholder="e.g., Shop Collection"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary CTA</Label>
                    <Input
                      value={heroContent.cta_secondary || ""}
                      onChange={(e) => updateField("hero", "cta_secondary", e.target.value)}
                      placeholder="e.g., View Lookbook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Price</Label>
                    <Input
                      value={heroContent.starting_price || ""}
                      onChange={(e) => updateField("hero", "starting_price", e.target.value)}
                      placeholder="e.g., ₹999"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <Label>Trust Stats</Label>
                  <div className="grid gap-3 md:grid-cols-4">
                    {(heroContent.stats || []).map((stat: any, index: number) => (
                      <div key={index} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <Input
                          value={stat.value}
                          onChange={(e) => updateStatField("hero", index, "value", e.target.value)}
                          placeholder="Value"
                          className="text-center font-bold"
                        />
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStatField("hero", index, "label", e.target.value)}
                          placeholder="Label"
                          className="text-center text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => handleSave("hero")} disabled={saving === "hero"}>
                    {saving === "hero" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Hero
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Brand Story */}
        <TabsContent value="brand" className="space-y-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Brand Story Section</CardTitle>
                <CardDescription>
                  Edit the "About Us" section on your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input
                      value={brandStoryContent.badge || ""}
                      onChange={(e) => updateField("brand_story", "badge", e.target.value)}
                      placeholder="e.g., Our Story"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Excellence</Label>
                    <Input
                      value={brandStoryContent.years_of_excellence || ""}
                      onChange={(e) => updateField("brand_story", "years_of_excellence", e.target.value)}
                      placeholder="e.g., 5+"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title Line 1</Label>
                    <Input
                      value={brandStoryContent.title_line1 || ""}
                      onChange={(e) => updateField("brand_story", "title_line1", e.target.value)}
                      placeholder="e.g., Crafting Elegance,"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Line 2 (Highlighted)</Label>
                    <Input
                      value={brandStoryContent.title_line2 || ""}
                      onChange={(e) => updateField("brand_story", "title_line2", e.target.value)}
                      placeholder="e.g., One Stitch at a Time"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Paragraph 1</Label>
                  <Textarea
                    value={brandStoryContent.paragraph1 || ""}
                    onChange={(e) => updateField("brand_story", "paragraph1", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Paragraph 2</Label>
                  <Textarea
                    value={brandStoryContent.paragraph2 || ""}
                    onChange={(e) => updateField("brand_story", "paragraph2", e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <Label>Stats</Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {(brandStoryContent.stats || []).map((stat: any, index: number) => (
                      <div key={index} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <Input
                          value={stat.value}
                          onChange={(e) => updateStatField("brand_story", index, "value", e.target.value)}
                          placeholder="Value"
                          className="text-center font-bold"
                        />
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStatField("brand_story", index, "label", e.target.value)}
                          placeholder="Label"
                          className="text-center text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => handleSave("brand_story")} disabled={saving === "brand_story"}>
                    {saving === "brand_story" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Brand Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Promos */}
        <TabsContent value="promos" className="space-y-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Flash Promo */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-display">Flash Sale Banner</CardTitle>
                    <CardDescription>
                      The scrolling promo banner at the top
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {promoFlashContent.is_active ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        <Eye className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" /> Hidden
                      </Badge>
                    )}
                    <Switch
                      checked={promoFlashContent.is_active || false}
                      onCheckedChange={(checked) => updateField("promo_flash", "is_active", checked)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Banner Text</Label>
                  <Input
                    value={promoFlashContent.text || ""}
                    onChange={(e) => updateField("promo_flash", "text", e.target.value)}
                    placeholder="e.g., ⚡ FLASH SALE: Extra 30% OFF!"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("promo_flash")} disabled={saving === "promo_flash"}>
                    {saving === "promo_flash" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Promo */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Secondary Promo</CardTitle>
                <CardDescription>
                  The "Buy 2 Get 1 Free" style banner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input
                      value={promoSecondaryContent.badge || ""}
                      onChange={(e) => updateField("promo_secondary", "badge", e.target.value)}
                      placeholder="e.g., Limited Offer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Button</Label>
                    <Input
                      value={promoSecondaryContent.cta || ""}
                      onChange={(e) => updateField("promo_secondary", "cta", e.target.value)}
                      placeholder="e.g., Shop Now"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={promoSecondaryContent.title || ""}
                    onChange={(e) => updateField("promo_secondary", "title", e.target.value)}
                    placeholder="e.g., Buy 2, Get 1 Free!"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={promoSecondaryContent.subtitle || ""}
                    onChange={(e) => updateField("promo_secondary", "subtitle", e.target.value)}
                    placeholder="e.g., On all Kurthis & Dresses"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("promo_secondary")} disabled={saving === "promo_secondary"}>
                    {saving === "promo_secondary" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Primary Promo */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Primary Promo (Festive)</CardTitle>
                <CardDescription>
                  The large promotional banner with gradient background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input
                      value={promoPrimaryContent.badge || ""}
                      onChange={(e) => updateField("promo_primary", "badge", e.target.value)}
                      placeholder="e.g., New Collection Arrived"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Line 1</Label>
                    <Input
                      value={promoPrimaryContent.title_line1 || ""}
                      onChange={(e) => updateField("promo_primary", "title_line1", e.target.value)}
                      placeholder="e.g., Festive Season"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title Line 2 (Highlighted)</Label>
                    <Input
                      value={promoPrimaryContent.title_line2 || ""}
                      onChange={(e) => updateField("promo_primary", "title_line2", e.target.value)}
                      placeholder="e.g., Special"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary CTA</Label>
                    <Input
                      value={promoPrimaryContent.cta_primary || ""}
                      onChange={(e) => updateField("promo_primary", "cta_primary", e.target.value)}
                      placeholder="e.g., Explore Collection"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={promoPrimaryContent.description || ""}
                    onChange={(e) => updateField("promo_primary", "description", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("promo_primary")} disabled={saving === "promo_primary"}>
                    {saving === "promo_primary" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images" className="space-y-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Hero Image */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Hero Image</CardTitle>
                <CardDescription>
                  Upload or update the main hero banner image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  label="Hero Banner"
                  value={heroContent.image_url || ""}
                  onChange={(url) => updateField("hero", "image_url", url)}
                  folder="storefront"
                  aspectRatio="video"
                />
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("hero")} disabled={saving === "hero"}>
                    {saving === "hero" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Hero Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Brand Story Image */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Brand Story Image</CardTitle>
                <CardDescription>
                  Upload or update the about section image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  label="Brand Story"
                  value={brandStoryContent.image_url || ""}
                  onChange={(url) => updateField("brand_story", "image_url", url)}
                  folder="storefront"
                  aspectRatio="square"
                />
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("brand_story")} disabled={saving === "brand_story"}>
                    {saving === "brand_story" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Brand Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing Images Gallery */}
            <StorageGallery />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStorefront;
