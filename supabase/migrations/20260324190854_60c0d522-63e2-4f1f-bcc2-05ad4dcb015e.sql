CREATE OR REPLACE FUNCTION public.get_student_emails_for_teacher(_teacher_id uuid)
RETURNS TABLE(student_id uuid, email text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tsl.student_id, u.email::text
  FROM public.teacher_student_links tsl
  INNER JOIN auth.users u ON u.id = tsl.student_id
  WHERE tsl.teacher_id = _teacher_id
    AND (tsl.status = 'pending' OR tsl.status = 'accepted')
$$;