
-- Enums
CREATE TYPE public.live_class_type AS ENUM ('one_to_one', 'group');
CREATE TYPE public.live_class_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled');
CREATE TYPE public.live_resource_type AS ENUM ('link', 'file', 'note', 'homework');

-- Main classes table
CREATE TABLE public.live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  subject TEXT,
  grade TEXT,
  topic TEXT,
  description TEXT,
  scheduled_date DATE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  class_type public.live_class_type NOT NULL DEFAULT 'group',
  room_name TEXT NOT NULL UNIQUE DEFAULT ('rasgoal-' || replace(gen_random_uuid()::text, '-', '')),
  recording_url TEXT,
  status public.live_class_status NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Assignments
CREATE TABLE public.live_class_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  joined_at TIMESTAMPTZ,
  attended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (class_id, student_id)
);

-- Resources
CREATE TABLE public.live_class_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type public.live_resource_type NOT NULL DEFAULT 'link',
  url TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_live_classes_teacher ON public.live_classes(teacher_id);
CREATE INDEX idx_live_classes_start ON public.live_classes(start_time);
CREATE INDEX idx_live_class_assignments_student ON public.live_class_assignments(student_id);
CREATE INDEX idx_live_class_assignments_class ON public.live_class_assignments(class_id);
CREATE INDEX idx_live_class_resources_class ON public.live_class_resources(class_id);

-- Updated at trigger
CREATE TRIGGER update_live_classes_updated_at
  BEFORE UPDATE ON public.live_classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper functions to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.is_live_class_owner(_class_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.live_classes WHERE id = _class_id AND teacher_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.is_assigned_to_live_class(_class_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.live_class_assignments WHERE class_id = _class_id AND student_id = _user_id)
$$;

-- Enable RLS
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_class_resources ENABLE ROW LEVEL SECURITY;

-- live_classes policies
CREATE POLICY "Teachers manage own classes" ON public.live_classes
  FOR ALL USING (auth.uid() = teacher_id) WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Assigned students can view classes" ON public.live_classes
  FOR SELECT USING (public.is_assigned_to_live_class(id, auth.uid()));

-- live_class_assignments policies
CREATE POLICY "Teachers manage own class assignments" ON public.live_class_assignments
  FOR ALL USING (public.is_live_class_owner(class_id, auth.uid()))
  WITH CHECK (
    public.is_live_class_owner(class_id, auth.uid())
    AND public.are_teacher_student_linked(auth.uid(), student_id)
  );

CREATE POLICY "Students view own assignments" ON public.live_class_assignments
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students update own join status" ON public.live_class_assignments
  FOR UPDATE USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- live_class_resources policies
CREATE POLICY "Teachers manage own class resources" ON public.live_class_resources
  FOR ALL USING (public.is_live_class_owner(class_id, auth.uid()))
  WITH CHECK (public.is_live_class_owner(class_id, auth.uid()));

CREATE POLICY "Assigned students view resources" ON public.live_class_resources
  FOR SELECT USING (public.is_assigned_to_live_class(class_id, auth.uid()));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('class-resources', 'class-resources', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Teachers upload to own class folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'class-resources'
    AND public.is_live_class_owner((storage.foldername(name))[1]::uuid, auth.uid())
  );

CREATE POLICY "Teachers manage own class files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'class-resources'
    AND public.is_live_class_owner((storage.foldername(name))[1]::uuid, auth.uid())
  );

CREATE POLICY "Assigned students read class files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'class-resources'
    AND public.is_assigned_to_live_class((storage.foldername(name))[1]::uuid, auth.uid())
  );

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_class_assignments;
