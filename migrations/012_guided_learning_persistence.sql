-- Guided learning persistence: AI study paths and course enrollments

CREATE TABLE IF NOT EXISTS public.user_guided_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  path_type TEXT DEFAULT 'guided-study',
  cadence TEXT DEFAULT 'weekly',
  summary TEXT NOT NULL,
  current_week TEXT,
  current_focus TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_guided_paths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own guided paths" ON public.user_guided_paths;
CREATE POLICY "Users can view their own guided paths"
  ON public.user_guided_paths FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own guided paths" ON public.user_guided_paths;
CREATE POLICY "Users can create their own guided paths"
  ON public.user_guided_paths FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own guided paths" ON public.user_guided_paths;
CREATE POLICY "Users can update their own guided paths"
  ON public.user_guided_paths FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own guided paths" ON public.user_guided_paths;
CREATE POLICY "Users can delete their own guided paths"
  ON public.user_guided_paths FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_guided_paths_user_id
  ON public.user_guided_paths(user_id);

CREATE INDEX IF NOT EXISTS idx_user_guided_paths_created_at
  ON public.user_guided_paths(created_at);

CREATE TABLE IF NOT EXISTS public.user_course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'theology',
  progress_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  current_module TEXT,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_course_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own course enrollments" ON public.user_course_enrollments;
CREATE POLICY "Users can view their own course enrollments"
  ON public.user_course_enrollments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own course enrollments" ON public.user_course_enrollments;
CREATE POLICY "Users can create their own course enrollments"
  ON public.user_course_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own course enrollments" ON public.user_course_enrollments;
CREATE POLICY "Users can update their own course enrollments"
  ON public.user_course_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own course enrollments" ON public.user_course_enrollments;
CREATE POLICY "Users can delete their own course enrollments"
  ON public.user_course_enrollments FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_user_id
  ON public.user_course_enrollments(user_id);

CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_created_at
  ON public.user_course_enrollments(created_at);
