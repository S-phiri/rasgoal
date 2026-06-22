INSERT INTO public.user_roles (user_id, role)
SELECT id, 'affiliate_admin'::app_role
FROM auth.users
WHERE lower(email) = lower('nonkululekonomsachirwa@gmail.com')
ON CONFLICT DO NOTHING;