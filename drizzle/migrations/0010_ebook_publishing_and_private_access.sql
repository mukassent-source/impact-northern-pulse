CREATE TABLE public.books (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 180),
 description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 5000),
 price_amount integer NOT NULL DEFAULT 0 CHECK (price_amount >= 0),
 currency text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD','EUR','GBP')),
 cover_path text NOT NULL DEFAULT '',
 first_chapter_path text NOT NULL DEFAULT '',
 full_book_path text NOT NULL DEFAULT '',
 published boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT published_book_files CHECK (NOT published OR (first_chapter_path <> '' AND full_book_path <> '' AND first_chapter_path <> full_book_path AND price_amount > 0))
);
GRANT SELECT ON public.books TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published books are visible" ON public.books FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins manage books" ON public.books FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TABLE public.book_purchases (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 book_id uuid NOT NULL REFERENCES public.books(id),
 user_id uuid NOT NULL,
 transaction_id text NOT NULL,
 environment text NOT NULL DEFAULT 'live' CHECK (environment IN ('live','sandbox')),
 status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed','refunded')),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (transaction_id, environment)
);
GRANT SELECT ON public.book_purchases TO authenticated;
GRANT ALL ON public.book_purchases TO service_role;
ALTER TABLE public.book_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Readers see own purchases" ON public.book_purchases FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read purchases" ON public.book_purchases FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins manage private book files" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'book-files' AND private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (bucket_id = 'book-files' AND private.has_role(auth.uid(), 'admin'::public.app_role));