CREATE POLICY "Anyone can view approved seller profiles"
ON public.profiles
FOR SELECT
TO public
USING (is_seller_approved = true);