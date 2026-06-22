
DROP POLICY IF EXISTS "Teachers view linked student profiles" ON public.profiles;

CREATE POLICY "Teachers view linked student profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.teacher_student_links
    WHERE teacher_student_links.teacher_id = auth.uid()
      AND teacher_student_links.student_id = profiles.user_id
      AND teacher_student_links.status IN ('accepted', 'pending')
  )
);
