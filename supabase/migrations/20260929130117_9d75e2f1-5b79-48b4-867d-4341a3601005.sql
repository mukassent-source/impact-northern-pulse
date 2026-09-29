CREATE OR REPLACE FUNCTION private.grant_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION private.grant_first_admin() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS on_auth_user_first_admin ON auth.users;
CREATE TRIGGER on_auth_user_first_admin AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION private.grant_first_admin();