-- Add image_url column to categories table
ALTER TABLE public.categories 
ADD COLUMN image_url TEXT;

-- Add description column for category pages
ALTER TABLE public.categories 
ADD COLUMN description TEXT;