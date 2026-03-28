-- Fun layer persistence: surprise study history, seasonal challenges, memory battles

CREATE TABLE IF NOT EXISTS public.user_surprise_study_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reference TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT DEFAULT 'daily-surprise-study',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_surprise_study_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own surprise study history" ON public.user_surprise_study_history;
CREATE POLICY "Users can view their own surprise study history"
  ON public.user_surprise_study_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own surprise study history" ON public.user_surprise_study_history;
CREATE POLICY "Users can create their own surprise study history"
  ON public.user_surprise_study_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own surprise study history" ON public.user_surprise_study_history;
CREATE POLICY "Users can delete their own surprise study history"
  ON public.user_surprise_study_history FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_surprise_study_history_user_id
  ON public.user_surprise_study_history(user_id);

CREATE INDEX IF NOT EXISTS idx_user_surprise_study_history_created_at
  ON public.user_surprise_study_history(created_at);

CREATE TABLE IF NOT EXISTS public.user_seasonal_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  challenge_title TEXT NOT NULL,
  challenge_season TEXT DEFAULT 'always-on',
  status TEXT DEFAULT 'active',
  progress_note TEXT,
  reward_claimed BOOLEAN DEFAULT false,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_title)
);

ALTER TABLE public.user_seasonal_challenge_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own seasonal challenge progress" ON public.user_seasonal_challenge_progress;
CREATE POLICY "Users can view their own seasonal challenge progress"
  ON public.user_seasonal_challenge_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own seasonal challenge progress" ON public.user_seasonal_challenge_progress;
CREATE POLICY "Users can create their own seasonal challenge progress"
  ON public.user_seasonal_challenge_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own seasonal challenge progress" ON public.user_seasonal_challenge_progress;
CREATE POLICY "Users can update their own seasonal challenge progress"
  ON public.user_seasonal_challenge_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_seasonal_challenge_progress_user_id
  ON public.user_seasonal_challenge_progress(user_id);

CREATE TABLE IF NOT EXISTS public.user_memory_battle_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  current_score INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  rounds_played INTEGER DEFAULT 0,
  rounds_won INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_memory_battle_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own memory battle stats" ON public.user_memory_battle_stats;
CREATE POLICY "Users can view their own memory battle stats"
  ON public.user_memory_battle_stats FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own memory battle stats" ON public.user_memory_battle_stats;
CREATE POLICY "Users can create their own memory battle stats"
  ON public.user_memory_battle_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own memory battle stats" ON public.user_memory_battle_stats;
CREATE POLICY "Users can update their own memory battle stats"
  ON public.user_memory_battle_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_memory_battle_stats_user_id
  ON public.user_memory_battle_stats(user_id);
