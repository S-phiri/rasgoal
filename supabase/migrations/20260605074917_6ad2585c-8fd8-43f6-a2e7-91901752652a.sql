
CREATE OR REPLACE FUNCTION public.delete_user_account(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete student-side data first (tables without FKs to auth.users with CASCADE)
  DELETE FROM public.chat_read_receipts WHERE user_id = _user_id;
  DELETE FROM public.direct_messages WHERE sender_id = _user_id OR receiver_id = _user_id;
  DELETE FROM public.question_attempts WHERE user_id = _user_id;
  DELETE FROM public.quiz_progress WHERE user_id = _user_id;
  DELETE FROM public.user_rewards WHERE user_id = _user_id;
  DELETE FROM public.user_streaks WHERE user_id = _user_id;

  -- Teacher-student link cleanup (as student or teacher)
  DELETE FROM public.teacher_student_links WHERE student_id = _user_id OR teacher_id = _user_id;

  -- Live class assignments
  DELETE FROM public.live_class_assignments WHERE student_id = _user_id;

  -- Test submissions and answers (as student)
  DELETE FROM public.test_submission_answers
  WHERE submission_id IN (
    SELECT id FROM public.test_submissions WHERE student_id = _user_id
  );
  DELETE FROM public.test_submissions WHERE student_id = _user_id;

  -- Test assignments (as student)
  DELETE FROM public.test_assignments WHERE student_id = _user_id;

  -- Teacher-owned custom tests: first delete answers/submissions for those tests,
  -- then assignments, then questions, then the tests themselves.
  DELETE FROM public.test_submission_answers
  WHERE submission_id IN (
    SELECT ts.id FROM public.test_submissions ts
    INNER JOIN public.test_assignments ta ON ta.id = ts.assignment_id
    INNER JOIN public.custom_tests ct ON ct.id = ta.test_id
    WHERE ct.teacher_id = _user_id
  );
  DELETE FROM public.test_submissions
  WHERE assignment_id IN (
    SELECT id FROM public.test_assignments
    WHERE test_id IN (SELECT id FROM public.custom_tests WHERE teacher_id = _user_id)
  );
  DELETE FROM public.test_assignments
  WHERE test_id IN (SELECT id FROM public.custom_tests WHERE teacher_id = _user_id);
  DELETE FROM public.custom_test_questions
  WHERE test_id IN (SELECT id FROM public.custom_tests WHERE teacher_id = _user_id);
  DELETE FROM public.custom_tests WHERE teacher_id = _user_id;

  -- Live classes owned by teacher
  DELETE FROM public.live_classes WHERE teacher_id = _user_id;

  -- Affiliate data
  DELETE FROM public.affiliate_commissions
  WHERE referral_id IN (
    SELECT id FROM public.affiliate_referrals WHERE referred_user_id = _user_id
  );
  DELETE FROM public.affiliate_payouts
  WHERE affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = _user_id);
  DELETE FROM public.affiliate_referrals WHERE referred_user_id = _user_id;
  DELETE FROM public.affiliate_referrals
  WHERE affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = _user_id);
  DELETE FROM public.affiliates WHERE user_id = _user_id;

  -- Email-related tables
  DELETE FROM public.email_unsubscribe_tokens WHERE user_id = _user_id;
  DELETE FROM public.suppressed_emails WHERE email = (SELECT email FROM auth.users WHERE id = _user_id);
  DELETE FROM public.phone_otps WHERE user_id = _user_id;

  -- The auth user deletion will CASCADE to:
  -- profiles, subscriptions, quiz_history, user_roles, payments
  -- (these have FK to auth.users with ON DELETE CASCADE)
END;
$$;
