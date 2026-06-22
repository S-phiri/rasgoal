
CREATE OR REPLACE FUNCTION public.is_assigned_to_live_class(_class_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT auth.uid() = _user_id
    AND EXISTS (
      SELECT 1 FROM public.live_class_assignments
      WHERE class_id = _class_id AND student_id = _user_id
    )
$function$;
