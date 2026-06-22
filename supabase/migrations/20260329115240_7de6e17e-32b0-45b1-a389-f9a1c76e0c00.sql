
CREATE TABLE public.quiz_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text NOT NULL,
  exam_number integer NOT NULL DEFAULT 1,
  current_index integer NOT NULL DEFAULT 0,
  score integer NOT NULL DEFAULT 0,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  question_order jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject, exam_number)
);

ALTER TABLE public.quiz_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.quiz_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.quiz_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.quiz_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.quiz_progress
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
