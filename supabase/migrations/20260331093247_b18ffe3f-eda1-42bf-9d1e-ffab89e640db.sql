CREATE OR REPLACE FUNCTION public.get_teacher_emails_for_student(_student_id uuid)
 RETURNS TABLE(teacher_id uuid, email text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT tsl.teacher_id, u.email::text
  FROM public.teacher_student_links tsl
  INNER JOIN auth.users u ON u.id = tsl.teacher_id
  WHERE tsl.student_id = _student_id
    AND tsl.status = 'pending'
$function$;