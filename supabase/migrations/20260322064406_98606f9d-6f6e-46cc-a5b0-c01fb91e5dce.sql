
-- Create storage bucket for team member photos
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true);

-- Allow anyone to view team photos
CREATE POLICY "Anyone can view team photos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'team-photos');

-- Supreme admins can upload team photos
CREATE POLICY "Supreme admins can upload team photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'supreme_admin'));

-- Supreme admins can update team photos
CREATE POLICY "Supreme admins can update team photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'supreme_admin'));

-- Supreme admins can delete team photos
CREATE POLICY "Supreme admins can delete team photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'supreme_admin'));
