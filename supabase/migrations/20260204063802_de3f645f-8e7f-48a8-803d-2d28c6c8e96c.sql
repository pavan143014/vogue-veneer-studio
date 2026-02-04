-- Create a site_content table for editable storefront content
CREATE TABLE public.site_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Admins can manage content
CREATE POLICY "Admins can manage site content"
ON public.site_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can read active content
CREATE POLICY "Anyone can read active content"
ON public.site_content
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content sections
INSERT INTO public.site_content (section_key, content) VALUES
('hero', '{
  "badge": "New Collection 2026",
  "title_line1": "Where Tradition",
  "title_line2": "Meets Style",
  "description": "Discover our exquisite collection of handcrafted ethnic wear — where every stitch tells a story of artistry and elegance.",
  "cta_primary": "Shop Collection",
  "cta_secondary": "View Lookbook",
  "starting_price": "₹999",
  "discount_text": "UPTO 40% OFF",
  "stats": [
    {"value": "500+", "label": "Designs"},
    {"value": "15K+", "label": "Happy Customers"},
    {"value": "4.9★", "label": "Rating"},
    {"value": "50+", "label": "Artisan Partners"}
  ],
  "image_url": ""
}'::jsonb),
('brand_story', '{
  "badge": "Our Story",
  "title_line1": "Crafting Elegance,",
  "title_line2": "One Stitch at a Time",
  "paragraph1": "Born from a passion for preserving Indias rich textile heritage, Aroma Ethnic brings you handcrafted pieces that tell stories of tradition and artisanship.",
  "paragraph2": "Each kurthi and dress in our collection is thoughtfully designed, combining age-old techniques with contemporary aesthetics. We work directly with skilled artisans across India, ensuring fair practices and authentic craftsmanship.",
  "years_of_excellence": "5+",
  "stats": [
    {"value": "500+", "label": "Unique Designs"},
    {"value": "50+", "label": "Artisan Partners"},
    {"value": "15K+", "label": "Happy Customers"}
  ],
  "image_url": ""
}'::jsonb),
('promo_flash', '{
  "text": "⚡ FLASH SALE: Extra 30% OFF Everything! Use Code: FLASH30 ⚡",
  "is_active": true
}'::jsonb),
('promo_secondary', '{
  "badge": "Limited Offer",
  "title": "Buy 2, Get 1 Free!",
  "subtitle": "On all Kurthis & Dresses • Valid till stocks last",
  "cta": "Shop Now"
}'::jsonb),
('promo_primary', '{
  "badge": "New Collection Arrived",
  "title_line1": "Festive Season",
  "title_line2": "Special",
  "description": "Celebrate with our exclusive handcrafted pieces. Each design tells a story of tradition and elegance.",
  "cta_primary": "Explore Collection",
  "cta_secondary": "View Lookbook"
}'::jsonb);