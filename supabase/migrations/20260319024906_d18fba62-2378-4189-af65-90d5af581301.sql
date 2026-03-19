
-- Add extra_details column to profiles for social media, website, etc.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS extra_details text DEFAULT NULL;

-- Create product_images table for multiple photos per product
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view images of approved products
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT TO public
  USING (EXISTS (SELECT 1 FROM public.products WHERE products.id = product_images.product_id AND products.is_approved = true));

-- Sellers can view own product images
CREATE POLICY "Sellers can view own product images" ON public.product_images
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.products WHERE products.id = product_images.product_id AND products.seller_id = auth.uid()));

-- Sellers can insert images for own products
CREATE POLICY "Sellers can insert product images" ON public.product_images
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.products WHERE products.id = product_images.product_id AND products.seller_id = auth.uid()));

-- Sellers can delete own product images
CREATE POLICY "Sellers can delete own product images" ON public.product_images
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.products WHERE products.id = product_images.product_id AND products.seller_id = auth.uid()));

-- Admins can manage all product images
CREATE POLICY "Admins can manage product images" ON public.product_images
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'supreme_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "Users can delete own product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete own products" ON public.products
  FOR DELETE TO authenticated
  USING (auth.uid() = seller_id);
