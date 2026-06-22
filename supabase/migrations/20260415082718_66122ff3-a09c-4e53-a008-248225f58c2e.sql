
ALTER TABLE public.profiles ADD COLUMN username text;

CREATE UNIQUE INDEX idx_profiles_username ON public.profiles (lower(username));
