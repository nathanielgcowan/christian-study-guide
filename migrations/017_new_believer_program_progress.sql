-- New believer discipleship program progress persistence

CREATE TABLE IF NOT EXISTS public.user_new_believer_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  program_name TEXT DEFAULT 'New Believer Foundations',
  current_week_index INTEGER DEFAULT 0,
  current_week_title TEXT,
  completed_weeks JSONB DEFAULT '[]'::jsonb,
  completed_milestones JSONB DEFAULT '[]'::jsonb,
  reviewed_mentor_topics JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'not-started',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_new_believer_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own new believer progress" ON public.user_new_believer_progress;
CREATE POLICY "Users can view their own new believer progress"
  ON public.user_new_believer_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own new believer progress" ON public.user_new_believer_progress;
CREATE POLICY "Users can create their own new believer progress"
  ON public.user_new_believer_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own new believer progress" ON public.user_new_believer_progress;
CREATE POLICY "Users can update their own new believer progress"
  ON public.user_new_believer_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_new_believer_progress_user_id
  ON public.user_new_believer_progress(user_id);
