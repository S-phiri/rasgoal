CREATE POLICY "Teachers can delete links" ON public.teacher_student_links
  FOR DELETE TO authenticated USING (auth.uid() = teacher_id);