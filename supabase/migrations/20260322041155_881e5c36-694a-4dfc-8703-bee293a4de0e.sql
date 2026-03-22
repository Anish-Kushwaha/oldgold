
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  role_label text NOT NULL,
  description text,
  email text,
  phone text,
  whatsapp text,
  photo_url text,
  social_links jsonb DEFAULT '[]'::jsonb,
  companies jsonb DEFAULT '[]'::jsonb,
  display_order int NOT NULL DEFAULT 0,
  is_founder boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members"
ON public.team_members FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Supreme admins can manage team members"
ON public.team_members FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'supreme_admin'))
WITH CHECK (public.has_role(auth.uid(), 'supreme_admin'));

-- Seed the initial team
INSERT INTO public.team_members (name, title, role_label, description, email, phone, whatsapp, photo_url, display_order, is_founder, social_links, companies) VALUES
(
  'Anish Kushwaha',
  'Founder & CEO — Anish Enterprises',
  'FOUNDER & CEO',
  'Visionary leader and creator of OldGold. Heads Anish Enterprises which encompasses multiple ventures across technology, automotive, and education.',
  'Anish-Kushwaha@zohomail.in',
  NULL,
  NULL,
  NULL,
  0,
  true,
  '[{"icon":"Globe","label":"Portfolio","url":"https://Anish-kushwaha.online"},{"icon":"Github","label":"GitHub","url":"https://github.com/Anish-Kushwaha"},{"icon":"Linkedin","label":"LinkedIn","url":"https://www.linkedin.com/in/anish-kushwaha-43a915383"},{"icon":"Twitter","label":"X (Twitter)","url":"https://x.com/Anish_Kushwaha_"},{"icon":"Facebook","label":"Facebook","url":"https://www.facebook.com/Anishkushwahaji2"},{"icon":"Youtube","label":"YouTube","url":"https://www.youtube.com/@cosmologist_anish"},{"icon":"Send","label":"Telegram","url":"https://t.me/AnishKushwahaji"},{"icon":"Code","label":"LeetCode","url":"https://leetcode.com/Anish-Kushwaha"},{"icon":"Code","label":"Devpost","url":"https://devpost.com/Anish-Kushwaha"},{"icon":"Trophy","label":"HackerRank","url":"https://www.hackerrank.com/profile/Anish_Kushwaha"},{"icon":"Gamepad2","label":"Chess.com","url":"https://www.chess.com/member/Anish-Kushwaha"}]'::jsonb,
  '[{"name":"OldGold","url":"https://oldgold.lovable.app"},{"name":"ApnaAutoHub","url":"https://apnaautohub.lovable.app"},{"name":"FocusRoom","url":"https://Anish-kushwaha.online/FocusRoom"},{"name":"NOESIS","url":"https://Anish-kushwaha.online/Noesis"},{"name":"Vulnerability Scanner","url":"https://Anish-kushwaha.online/Scanner"}]'::jsonb
),
(
  'Bhavya Pandey',
  'Managing Director (MD)',
  'MD',
  'Manages all the Administrative and Management Affairs. Plays the leading role in Managing OldGold.',
  'bhavya020210@gmail.com',
  '83030 34074',
  '83030 34074',
  NULL,
  1,
  false,
  '[]'::jsonb,
  '[]'::jsonb
),
(
  'Shubham Prakash',
  'Chief Executive Officer (CEO)',
  'CEO',
  'Manages Executive staffs, and services. Representative of the Company. Leader of all the Executive Board Members.',
  'shubhamsinghpry431@gmail.com',
  '9798592527',
  '9798592527',
  NULL,
  2,
  false,
  '[]'::jsonb,
  '[]'::jsonb
),
(
  'Priyanshi Bairagi',
  'Assistant Chief Executive Officer (Asst.CEO)',
  'Asst.CEO',
  'Acts as a proxy to the CEO. Assists the CEO in all the affairs. Handles all the affairs of CEO in his absence. Assists CEO in all matters.',
  'dharmendraberagid@gmail.com',
  '9589953610',
  '9589953610',
  NULL,
  3,
  false,
  '[]'::jsonb,
  '[]'::jsonb
);
