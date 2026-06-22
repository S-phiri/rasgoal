
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'teacher');

-- User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Find teacher by email (security definer to access auth.users)
CREATE OR REPLACE FUNCTION public.find_teacher_by_email(_email text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id FROM auth.users u
  INNER JOIN public.user_roles r ON r.user_id = u.id
  WHERE u.email = _email AND r.role = 'teacher'
  LIMIT 1
$$;

-- Teacher-student links
CREATE TABLE public.teacher_student_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  student_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, student_id)
);

ALTER TABLE public.teacher_student_links ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_teacher_student_links_updated_at
  BEFORE UPDATE ON public.teacher_student_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "View own links" ON public.teacher_student_links
  FOR SELECT TO authenticated USING (auth.uid() = teacher_id OR auth.uid() = student_id);

CREATE POLICY "Students can create links" ON public.teacher_student_links
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update link status" ON public.teacher_student_links
  FOR UPDATE TO authenticated USING (auth.uid() = teacher_id);

CREATE POLICY "Students can delete own links" ON public.teacher_student_links
  FOR DELETE TO authenticated USING (auth.uid() = student_id);

-- Question attempts tracking
CREATE TABLE public.question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text NOT NULL,
  question_id text NOT NULL,
  first_attempt_correct boolean NOT NULL,
  final_correct boolean NOT NULL,
  attempts integer NOT NULL DEFAULT 1,
  exam_number integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own attempts" ON public.question_attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own attempts" ON public.question_attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Teachers view linked student attempts" ON public.question_attempts
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.teacher_student_links
      WHERE teacher_id = auth.uid()
      AND student_id = question_attempts.user_id
      AND status = 'accepted')
  );

-- Teacher can view linked student profiles
CREATE POLICY "Teachers view linked student profiles" ON public.profiles
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.teacher_student_links
      WHERE teacher_id = auth.uid()
      AND student_id = profiles.user_id
      AND status = 'accepted')
  );

-- Students can view linked teacher profiles
CREATE POLICY "Students view linked teacher profiles" ON public.profiles
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.teacher_student_links
      WHERE student_id = auth.uid()
      AND teacher_id = profiles.user_id
      AND status = 'accepted')
  );

-- Teacher can view linked student quiz history
CREATE POLICY "Teachers view linked student quiz history" ON public.quiz_history
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.teacher_student_links
      WHERE teacher_id = auth.uid()
      AND student_id = quiz_history.user_id
      AND status = 'accepted')
  );

-- Teacher can view linked student streaks
CREATE POLICY "Teachers view linked student streaks" ON public.user_streaks
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.teacher_student_links
      WHERE teacher_id = auth.uid()
      AND student_id = user_streaks.user_id
      AND status = 'accepted')
  );

-- Teacher can view linked student rewards
CREATE POLICY "Teachers view linked student rewards" ON public.user_rewards
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.teacher_student_links
      WHERE teacher_id = auth.uid()
      AND student_id = user_rewards.user_id
      AND status = 'accepted')
  );
