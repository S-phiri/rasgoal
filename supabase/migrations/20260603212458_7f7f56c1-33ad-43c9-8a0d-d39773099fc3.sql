
-- 1) Privilege escalation: remove self-insert on user_roles. Signup trigger (SECURITY DEFINER) still inserts roles.
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;

-- 2) Avatars: allow users to delete their own files
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3) Test images: restrict upload to the user's own folder (was: any authenticated)
DROP POLICY IF EXISTS "Teachers can upload test images" ON storage.objects;
CREATE POLICY "Teachers can upload test images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'test-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Also let teachers update / delete files they uploaded (parity with avatars)
CREATE POLICY "Teachers can update own test images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'test-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
