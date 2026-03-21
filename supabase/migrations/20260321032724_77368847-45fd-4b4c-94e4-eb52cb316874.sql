ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_price numeric DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;