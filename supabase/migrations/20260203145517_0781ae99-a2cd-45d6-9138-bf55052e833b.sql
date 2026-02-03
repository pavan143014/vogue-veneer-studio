-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create site_settings table for admin configurations
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
ON public.site_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create navigation_menus table for dynamic menus
CREATE TABLE public.navigation_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.navigation_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active menus"
ON public.navigation_menus FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage menus"
ON public.navigation_menus FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create payment_gateways table
CREATE TABLE public.payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  is_test_mode BOOLEAN DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payment gateways"
ON public.payment_gateways FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create admin_products table for local product management
CREATE TABLE public.admin_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  images JSONB DEFAULT '[]',
  category TEXT,
  tags TEXT[],
  variants JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
ON public.admin_products FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products"
ON public.admin_products FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create banners table for homepage management
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link_url TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
ON public.banners FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage banners"
ON public.banners FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default navigation menus
INSERT INTO public.navigation_menus (name, slug, items) VALUES
('Header Menu', 'header', '[
  {"id": "1", "label": "Home", "href": "/", "children": []},
  {"id": "2", "label": "Shop", "href": "/shop", "children": []},
  {"id": "3", "label": "About", "href": "/about", "children": []},
  {"id": "4", "label": "Contact", "href": "/contact", "children": []}
]'),
('Footer Menu', 'footer', '[
  {"id": "1", "label": "Privacy Policy", "href": "/privacy", "children": []},
  {"id": "2", "label": "Terms of Service", "href": "/terms", "children": []},
  {"id": "3", "label": "FAQ", "href": "/faq", "children": []}
]');

-- Insert default payment gateways
INSERT INTO public.payment_gateways (name, provider, config) VALUES
('PhonePe', 'phonepe', '{"merchant_id": "", "salt_key": "", "salt_index": "1"}'),
('Cashfree', 'cashfree', '{"app_id": "", "secret_key": ""}');

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
('general', '{"site_name": "Ethnic Elegance", "tagline": "Traditional Indian Fashion", "currency": "INR", "currency_symbol": "₹"}'),
('contact', '{"email": "hello@store.com", "phone": "+91 1234567890", "address": "Mumbai, India"}'),
('social', '{"instagram": "", "facebook": "", "twitter": "", "youtube": ""}'),
('shipping', '{"free_shipping_threshold": 999, "default_shipping_cost": 99}');

-- Trigger for updated_at
CREATE TRIGGER update_navigation_menus_updated_at
BEFORE UPDATE ON public.navigation_menus
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_gateways_updated_at
BEFORE UPDATE ON public.payment_gateways
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_products_updated_at
BEFORE UPDATE ON public.admin_products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();