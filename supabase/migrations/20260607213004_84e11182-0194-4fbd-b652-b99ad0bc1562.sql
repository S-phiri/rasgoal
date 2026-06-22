-- Allow students to read questions for tests assigned to them
CREATE POLICY "Students can view assigned test questions"
ON public.custom_test_questions
FOR SELECT
TO authenticated
USING (public.is_assigned_to_test(test_id, auth.uid()));

-- Remove live_class_assignments from realtime publication (not used for realtime; prevents broadcast leakage)
ALTER PUBLICATION supabase_realtime DROP TABLE public.live_class_assignments;