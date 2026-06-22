
-- Drop circular policies
DROP POLICY IF EXISTS "Students can view assigned tests" ON public.custom_tests;
DROP POLICY IF EXISTS "Students can view assigned test questions" ON public.custom_test_questions;
DROP POLICY IF EXISTS "Teachers can manage assignments for own tests" ON public.test_assignments;
DROP POLICY IF EXISTS "Teachers can view submissions for own tests" ON public.test_submissions;
DROP POLICY IF EXISTS "Teachers can view answers for own test submissions" ON public.test_submission_answers;
DROP POLICY IF EXISTS "Teachers can manage own test questions" ON public.custom_test_questions;

-- Security definer function to check test ownership without RLS
CREATE OR REPLACE FUNCTION public.is_test_owner(_test_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.custom_tests
    WHERE id = _test_id AND teacher_id = _user_id
  )
$$;

-- Security definer function to check if student is assigned to a test
CREATE OR REPLACE FUNCTION public.is_assigned_to_test(_test_id uuid, _student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.test_assignments
    WHERE test_id = _test_id AND student_id = _student_id
  )
$$;

-- Re-create policies using safe functions
CREATE POLICY "Students can view assigned tests" ON public.custom_tests
FOR SELECT USING (public.is_assigned_to_test(id, auth.uid()));

CREATE POLICY "Teachers can manage own test questions" ON public.custom_test_questions
FOR ALL USING (public.is_test_owner(test_id, auth.uid()))
WITH CHECK (public.is_test_owner(test_id, auth.uid()));

CREATE POLICY "Students can view assigned test questions" ON public.custom_test_questions
FOR SELECT USING (public.is_assigned_to_test(test_id, auth.uid()));

CREATE POLICY "Teachers can manage assignments for own tests" ON public.test_assignments
FOR ALL USING (public.is_test_owner(test_id, auth.uid()))
WITH CHECK (public.is_test_owner(test_id, auth.uid()));

CREATE POLICY "Teachers can view submissions for own tests" ON public.test_submissions
FOR SELECT USING (public.is_test_owner(test_id, auth.uid()));

CREATE POLICY "Teachers can view answers for own test submissions" ON public.test_submission_answers
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.test_submissions ts
    WHERE ts.id = test_submission_answers.submission_id
    AND public.is_test_owner(ts.test_id, auth.uid())
  )
);
