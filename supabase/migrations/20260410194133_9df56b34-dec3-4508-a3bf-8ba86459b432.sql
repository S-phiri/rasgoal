
-- Custom tests created by teachers
CREATE TABLE public.custom_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage own tests" ON public.custom_tests FOR ALL USING (auth.uid() = teacher_id) WITH CHECK (auth.uid() = teacher_id);
CREATE TRIGGER update_custom_tests_updated_at BEFORE UPDATE ON public.custom_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Questions within a custom test
CREATE TABLE public.custom_test_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.custom_tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_test_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage own test questions" ON public.custom_test_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.custom_tests ct WHERE ct.id = custom_test_questions.test_id AND ct.teacher_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.custom_tests ct WHERE ct.id = custom_test_questions.test_id AND ct.teacher_id = auth.uid())
);

-- Assignments linking tests to students
CREATE TABLE public.test_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.custom_tests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(test_id, student_id)
);

ALTER TABLE public.test_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage assignments for own tests" ON public.test_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.custom_tests ct WHERE ct.id = test_assignments.test_id AND ct.teacher_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.custom_tests ct WHERE ct.id = test_assignments.test_id AND ct.teacher_id = auth.uid())
);
CREATE POLICY "Students can view own assignments" ON public.test_assignments FOR SELECT USING (auth.uid() = student_id);

-- Now add deferred policy on custom_tests for student access
CREATE POLICY "Students can view assigned tests" ON public.custom_tests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.test_assignments ta WHERE ta.test_id = custom_tests.id AND ta.student_id = auth.uid())
);
CREATE POLICY "Students can view assigned test questions" ON public.custom_test_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.test_assignments ta WHERE ta.test_id = custom_test_questions.test_id AND ta.student_id = auth.uid())
);

-- Submissions
CREATE TABLE public.test_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.test_assignments(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES public.custom_tests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.test_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can view submissions for own tests" ON public.test_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.custom_tests ct WHERE ct.id = test_submissions.test_id AND ct.teacher_id = auth.uid())
);
CREATE POLICY "Students can manage own submissions" ON public.test_submissions FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

-- Individual answers per submission
CREATE TABLE public.test_submission_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.test_submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.custom_test_questions(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.test_submission_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can view answers for own test submissions" ON public.test_submission_answers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.test_submissions ts
    JOIN public.custom_tests ct ON ct.id = ts.test_id
    WHERE ts.id = test_submission_answers.submission_id AND ct.teacher_id = auth.uid()
  )
);
CREATE POLICY "Students can manage own answers" ON public.test_submission_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.test_submissions ts WHERE ts.id = test_submission_answers.submission_id AND ts.student_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.test_submissions ts WHERE ts.id = test_submission_answers.submission_id AND ts.student_id = auth.uid())
);

-- Storage bucket for question images
INSERT INTO storage.buckets (id, name, public) VALUES ('test-images', 'test-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Teachers can upload test images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'test-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can view test images" ON storage.objects FOR SELECT USING (bucket_id = 'test-images');
CREATE POLICY "Teachers can delete own test images" ON storage.objects FOR DELETE USING (bucket_id = 'test-images' AND auth.uid()::text = (storage.foldername(name))[1]);
