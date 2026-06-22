
CREATE OR REPLACE FUNCTION public.admin_list_subscriptions()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  full_name text,
  email text,
  mobile_number text,
  plan_name text,
  status text,
  amount numeric,
  currency text,
  started_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.user_id,
         p.full_name,
         u.email::text,
         COALESCE(p.mobile_number, s.phone_number) AS mobile_number,
         s.plan_name, s.status, s.amount, s.currency,
         s.started_at, s.expires_at, s.created_at
  FROM public.subscriptions s
  LEFT JOIN public.profiles p ON p.user_id = s.user_id
  LEFT JOIN auth.users u ON u.id = s.user_id
  WHERE public.is_affiliate_admin(auth.uid())
  ORDER BY s.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_subscriptions() TO authenticated;
