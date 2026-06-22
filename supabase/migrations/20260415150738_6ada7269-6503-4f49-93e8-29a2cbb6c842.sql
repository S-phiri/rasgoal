
-- Assignment messages table for teacher-student chat per assignment
CREATE TABLE public.assignment_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.test_assignments(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.assignment_messages ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is participant of an assignment (teacher or student)
CREATE OR REPLACE FUNCTION public.is_assignment_participant(_assignment_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.test_assignments ta
    INNER JOIN public.custom_tests ct ON ct.id = ta.test_id
    WHERE ta.id = _assignment_id
      AND (_user_id = ta.student_id OR _user_id = ct.teacher_id)
  )
$$;

-- Students and teachers can view messages for their assignments
CREATE POLICY "Participants can view assignment messages"
ON public.assignment_messages FOR SELECT TO authenticated
USING (is_assignment_participant(assignment_id, auth.uid()));

-- Participants can send messages
CREATE POLICY "Participants can send assignment messages"
ON public.assignment_messages FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND is_assignment_participant(assignment_id, auth.uid())
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.assignment_messages;
