
-- Remove student direct SELECT on custom_test_questions to prevent correct_answer leak
DROP POLICY IF EXISTS "Students can view assigned test questions" ON public.custom_test_questions;

-- Function: return assigned test questions WITHOUT correct_answer
CREATE OR REPLACE FUNCTION public.get_assigned_test_questions(_test_id uuid)
RETURNS TABLE (
  id uuid,
  test_id uuid,
  question_text text,
  options jsonb,
  image_url text,
  display_order integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT q.id, q.test_id, q.question_text, q.options, q.image_url, q.display_order
  FROM public.custom_test_questions q
  WHERE q.test_id = _test_id
    AND public.is_assigned_to_test(_test_id, auth.uid())
  ORDER BY q.display_order;
$$;

GRANT EXECUTE ON FUNCTION public.get_assigned_test_questions(uuid) TO authenticated;

-- Function: grade and submit a custom test server-side
CREATE OR REPLACE FUNCTION public.submit_custom_test(
  _assignment_id uuid,
  _answers jsonb
)
RETURNS TABLE (score integer, total integer, percentage integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _test_id uuid;
  _assignment_student uuid;
  _existing integer;
  _score integer := 0;
  _total integer := 0;
  _pct integer := 0;
  _submission_id uuid;
  _rec record;
  _qid uuid;
  _selected integer;
  _correct integer;
  _is_correct boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT test_id, student_id INTO _test_id, _assignment_student
  FROM public.test_assignments WHERE id = _assignment_id;

  IF _test_id IS NULL THEN RAISE EXCEPTION 'Assignment not found'; END IF;
  IF _assignment_student <> _uid THEN RAISE EXCEPTION 'Not your assignment'; END IF;

  SELECT count(*) INTO _existing FROM public.test_submissions
    WHERE assignment_id = _assignment_id AND student_id = _uid;
  IF _existing > 0 THEN RAISE EXCEPTION 'Already submitted'; END IF;

  -- Build a temp list of (qid, selected, correct)
  CREATE TEMP TABLE _ans_tmp (
    question_id uuid,
    selected_answer integer,
    correct_answer integer,
    is_correct boolean
  ) ON COMMIT DROP;

  FOR _rec IN SELECT * FROM jsonb_array_elements(_answers) AS a
  LOOP
    _qid := (_rec.value->>'questionId')::uuid;
    _selected := COALESCE((_rec.value->>'selectedAnswer')::integer, -1);
    SELECT correct_answer INTO _correct FROM public.custom_test_questions
      WHERE id = _qid AND test_id = _test_id;
    IF _correct IS NULL THEN CONTINUE; END IF;
    _is_correct := (_selected = _correct);
    INSERT INTO _ans_tmp VALUES (_qid, _selected, _correct, _is_correct);
  END LOOP;

  SELECT count(*), count(*) FILTER (WHERE is_correct) INTO _total, _score FROM _ans_tmp;
  _pct := CASE WHEN _total > 0 THEN ROUND((_score::numeric / _total) * 100)::int ELSE 0 END;

  INSERT INTO public.test_submissions (assignment_id, test_id, student_id, score, total_questions, percentage)
  VALUES (_assignment_id, _test_id, _uid, _score, _total, _pct)
  RETURNING id INTO _submission_id;

  INSERT INTO public.test_submission_answers (submission_id, question_id, selected_answer, is_correct)
  SELECT _submission_id, question_id, selected_answer, is_correct FROM _ans_tmp;

  UPDATE public.test_assignments SET status = 'completed' WHERE id = _assignment_id;

  RETURN QUERY SELECT _score, _total, _pct;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_custom_test(uuid, jsonb) TO authenticated;
