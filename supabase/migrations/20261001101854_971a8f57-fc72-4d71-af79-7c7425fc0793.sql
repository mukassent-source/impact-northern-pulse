ALTER TABLE public.content_entries DROP CONSTRAINT content_entries_kind_check;
ALTER TABLE public.content_entries ADD CONSTRAINT content_entries_kind_check CHECK (kind = ANY (ARRAY['profile','project','article','event','gallery','testimonial','partner','impact','achievement','quote']));

INSERT INTO public.content_entries (kind,title,category,image_url,published,created_at) VALUES
('quote','Young people are not only beneficiaries of development — they are partners in building the future.','Samuel Ato Afful · Youth Empowerment','/__l5e/assets-v1/54389250-a3fd-4cad-a1b9-d1f5fc41ed29/IMG_6554.jpg',true, now() - interval '0 minutes'),
('quote','Empowering young people. Strengthening media. Transforming communities.','Samuel Ato Afful · Purpose','/__l5e/assets-v1/a2d3bf06-6e9b-45ed-b90c-8420137fc49a/IMG_6527.jpg',true, now() - interval '1 minutes'),
('quote','Driving strategic media development and youth empowerment for sustainable impact across Northern Ghana.','Samuel Ato Afful · Media Development','/__l5e/assets-v1/b86b28ed-2a8e-4abc-a6b4-675f6d71153a/IMG_6548.jpg',true, now() - interval '2 minutes'),
('quote','Put people and communities at the center of development.','Samuel Ato Afful · Leadership','/__l5e/assets-v1/3364c6db-87fb-4c0c-8495-1a687d41c436/IMG_6533.jpg',true, now() - interval '3 minutes');