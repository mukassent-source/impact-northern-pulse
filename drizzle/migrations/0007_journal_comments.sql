CREATE TABLE public.journal_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES public.content_entries(id) ON DELETE CASCADE,
  name text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX journal_comments_entry_idx ON public.journal_comments(entry_id, created_at);
GRANT SELECT, INSERT ON public.journal_comments TO anon;
GRANT SELECT, INSERT, DELETE ON public.journal_comments TO authenticated;
GRANT ALL ON public.journal_comments TO service_role;
ALTER TABLE public.journal_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads comments on published posts" ON public.journal_comments FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.content_entries c WHERE c.id = entry_id AND c.published AND c.kind = 'article'));
CREATE POLICY "Visitors comment on published posts" ON public.journal_comments FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(btrim(name)) BETWEEN 1 AND 80 AND char_length(btrim(body)) BETWEEN 1 AND 2000
    AND EXISTS (SELECT 1 FROM public.content_entries c WHERE c.id = entry_id AND c.published AND c.kind = 'article'));
CREATE POLICY "Admins delete comments" ON public.journal_comments FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));