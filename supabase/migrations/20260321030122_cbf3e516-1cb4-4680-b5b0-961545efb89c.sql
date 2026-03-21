
-- Product reviews table
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view product reviews" ON public.product_reviews
  FOR SELECT TO public USING (true);

-- Anyone can insert reviews (no auth required for buyers)
CREATE POLICY "Anyone can add product reviews" ON public.product_reviews
  FOR INSERT TO public WITH CHECK (true);

-- Site reviews table (sellers review the site)
CREATE TABLE public.site_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view site reviews
CREATE POLICY "Anyone can view site reviews" ON public.site_reviews
  FOR SELECT TO public USING (true);

-- Authenticated users can insert site reviews
CREATE POLICY "Authenticated users can add site reviews" ON public.site_reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can delete own site reviews
CREATE POLICY "Users can delete own site reviews" ON public.site_reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
