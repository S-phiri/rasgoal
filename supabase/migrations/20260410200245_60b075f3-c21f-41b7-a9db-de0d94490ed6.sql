-- Allow teachers to delete submissions for their tests
CREATE POLICY "Teachers can delete submissions for own tests"
ON public.test_submissions
FOR DELETE
USING (public.is_test_owner(test_id, auth.uid()));

-- Allow teachers to delete answers for their test submissions
CREATE POLICY "Teachers can delete answers for own test submissions"
ON public.test_submission_answers
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.test_submissions ts
    WHERE ts.id = test_submission_answers.submission_id
    AND public.is_test_owner(ts.test_id, auth.uid())
  )
);

-- Allow teachers to update assignments for own tests
CREATE POLICY "Teachers can update assignments for own tests"
ON public.test_assignments
FOR UPDATE
USING (public.is_test_owner(test_id, auth.uid()))
WITH CHECK (public.is_test_owner(test_id, auth.uid()));