-- Public profile persistence, smart search history, and workspace collaboration

CREATE TABLE IF NOT EXISTS public.user_public_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  display_name TEXT,
  current_focus TEXT,
  favorite_passages JSONB DEFAULT '[]'::jsonb,
  recent_highlights JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_public_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own public profile settings" ON public.user_public_profiles;
CREATE POLICY "Users can view their own public profile settings"
  ON public.user_public_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own public profile settings" ON public.user_public_profiles;
CREATE POLICY "Users can create their own public profile settings"
  ON public.user_public_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own public profile settings" ON public.user_public_profiles;
CREATE POLICY "Users can update their own public profile settings"
  ON public.user_public_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_public_profiles_user_id
  ON public.user_public_profiles(user_id);

CREATE TABLE IF NOT EXISTS public.user_search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  selected_result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_search_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own search history" ON public.user_search_history;
CREATE POLICY "Users can view their own search history"
  ON public.user_search_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create search history" ON public.user_search_history;
CREATE POLICY "Users can create search history"
  ON public.user_search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_search_history_user_id
  ON public.user_search_history(user_id);

CREATE INDEX IF NOT EXISTS idx_user_search_history_created_at
  ON public.user_search_history(created_at);

CREATE TABLE IF NOT EXISTS public.workspace_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_resource_id UUID NOT NULL REFERENCES public.user_workspace_resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  collaborator_name TEXT NOT NULL,
  collaborator_role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.workspace_collaborators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own workspace collaborators" ON public.workspace_collaborators;
CREATE POLICY "Users can view their own workspace collaborators"
  ON public.workspace_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_workspace_resources
      WHERE user_workspace_resources.id = workspace_collaborators.workspace_resource_id
        AND user_workspace_resources.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create workspace collaborators" ON public.workspace_collaborators;
CREATE POLICY "Users can create workspace collaborators"
  ON public.workspace_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_workspace_resources
      WHERE user_workspace_resources.id = workspace_collaborators.workspace_resource_id
        AND user_workspace_resources.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_workspace_collaborators_resource_id
  ON public.workspace_collaborators(workspace_resource_id);
