ALTER TABLE public.content_entries DROP CONSTRAINT content_entries_body_check;
ALTER TABLE public.content_entries ADD CONSTRAINT content_entries_body_check CHECK (char_length(body) <= 50000);