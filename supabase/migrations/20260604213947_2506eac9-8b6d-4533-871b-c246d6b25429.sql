CREATE POLICY "Service role can insert OTPs" ON public.phone_otps FOR INSERT TO public WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update OTPs" ON public.phone_otps FOR UPDATE TO public USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can select OTPs" ON public.phone_otps FOR SELECT TO public USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete OTPs" ON public.phone_otps FOR DELETE TO public USING (auth.role() = 'service_role');