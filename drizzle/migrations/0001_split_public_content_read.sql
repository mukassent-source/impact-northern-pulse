DROP POLICY IF EXISTS "Public reads published content" ON public.content_entries;
CREATE POLICY "Anyone reads published content" ON public.content_entries FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins read all content" ON public.content_entries FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));