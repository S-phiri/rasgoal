DROP POLICY IF EXISTS "Students view linked teacher profiles" ON public.profiles;
DROP POLICY IF EXISTS "Teachers view linked student profiles" ON public.profiles;

CREATE POLICY "Students view linked teacher profiles"
ON public.profiles FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.teacher_student_links
  WHERE student_id = auth.uid()
    AND teacher_id = profiles.user_id
    AND status = 'accepted'
));

CREATE POLICY "Teachers view linked student profiles"
ON public.profiles FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.teacher_student_links
  WHERE teacher_id = auth.uid()
    AND student_id = profiles.user_id
    AND status = 'accepted'
));