-- Allow secondary admins to manage seller roles (insert/delete)
CREATE POLICY "Admins can manage seller roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  AND role = 'seller'::app_role
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  AND role = 'seller'::app_role
);