-- Create storage bucket for admin uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('admin-uploads', 'admin-uploads', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Allow admins to upload files
CREATE POLICY "Admins can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'admin-uploads' AND has_role(auth.uid(), 'admin'));

-- Allow admins to update/delete their uploads
CREATE POLICY "Admins can manage uploads"
ON storage.objects
FOR ALL
USING (bucket_id = 'admin-uploads' AND has_role(auth.uid(), 'admin'));

-- Allow public read access to uploaded images
CREATE POLICY "Public can view uploads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'admin-uploads');