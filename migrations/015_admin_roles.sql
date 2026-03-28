-- Admin roles and initial admin assignment

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

UPDATE public.user_profiles
SET role = 'admin',
    updated_at = now()
WHERE email = 'nathaniel.g.cowan@gmail.com';

