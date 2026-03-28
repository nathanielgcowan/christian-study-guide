-- Saved study sessions for cross-device persistence
CREATE TABLE IF NOT EXISTS public.user_study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  mode TEXT DEFAULT 'overview',
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study sessions"
  ON public.user_study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create study sessions"
  ON public.user_study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions"
  ON public.user_study_sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_study_sessions_user_id
  ON public.user_study_sessions(user_id);

CREATE INDEX idx_user_study_sessions_created_at
  ON public.user_study_sessions(created_at);
