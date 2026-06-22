CREATE OR REPLACE FUNCTION public.find_teacher_by_email(_email text)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT u.id FROM auth.users u
  INNER JOIN public.user_roles r ON r.user_id = u.id
  WHERE lower(u.email) = lower(trim(_email)) AND r.role = 'teacher'
  LIMIT 1
$function$;