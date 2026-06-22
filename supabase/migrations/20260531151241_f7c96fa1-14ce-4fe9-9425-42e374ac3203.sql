-- Add mobile_number to profiles for phone-based sign-ups
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS mobile_number TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_mobile_number_unique
  ON public.profiles (mobile_number)
  WHERE mobile_number IS NOT NULL;

-- Update new-user trigger to also capture phone number from auth.users
-- (Supabase stores the verified phone on auth.users.phone after OTP verification)
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, username, mobile_number)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'username',
    NULLIF(NEW.phone, '')
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student'), (NEW.id, 'teacher');

  UPDATE public.affiliates
    SET user_id = NEW.id, status = 'active', updated_at = now()
    WHERE user_id IS NULL AND NEW.email IS NOT NULL AND lower(email) = lower(NEW.email);

  RETURN NEW;
END;
$function$;