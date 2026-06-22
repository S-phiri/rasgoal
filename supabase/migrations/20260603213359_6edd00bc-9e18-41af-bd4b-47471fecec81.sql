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
    COALESCE(NULLIF(NEW.phone, ''), NULLIF(NEW.raw_user_meta_data ->> 'mobile_number', ''))
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student'), (NEW.id, 'teacher');

  UPDATE public.affiliates
    SET user_id = NEW.id, status = 'active', updated_at = now()
    WHERE user_id IS NULL AND NEW.email IS NOT NULL AND lower(email) = lower(NEW.email);

  RETURN NEW;
END;
$function$;