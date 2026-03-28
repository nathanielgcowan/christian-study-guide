-- Prayer journal persistence and workspace resources

CREATE TABLE IF NOT EXISTS public.user_prayer_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  answered BOOLEAN DEFAULT false,
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_prayer_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own prayer entries" ON public.user_prayer_entries;
CREATE POLICY "Users can view their own prayer entries"
  ON public.user_prayer_entries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create prayer entries" ON public.user_prayer_entries;
CREATE POLICY "Users can create prayer entries"
  ON public.user_prayer_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own prayer entries" ON public.user_prayer_entries;
CREATE POLICY "Users can update their own prayer entries"
  ON public.user_prayer_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_prayer_entries_user_id
  ON public.user_prayer_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_user_prayer_entries_created_at
  ON public.user_prayer_entries(created_at);

CREATE TABLE IF NOT EXISTS public.user_workspace_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  resource_type TEXT DEFAULT 'study-board',
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_workspace_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own workspace resources" ON public.user_workspace_resources;
CREATE POLICY "Users can view their own workspace resources"
  ON public.user_workspace_resources FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create workspace resources" ON public.user_workspace_resources;
CREATE POLICY "Users can create workspace resources"
  ON public.user_workspace_resources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update workspace resources" ON public.user_workspace_resources;
CREATE POLICY "Users can update workspace resources"
  ON public.user_workspace_resources FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_workspace_resources_user_id
  ON public.user_workspace_resources(user_id);

CREATE INDEX IF NOT EXISTS idx_user_workspace_resources_created_at
  ON public.user_workspace_resources(created_at);

DROP POLICY IF EXISTS "Users can create their own activity" ON public.user_activity;
CREATE POLICY "Users can create their own activity"
  ON public.user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);
