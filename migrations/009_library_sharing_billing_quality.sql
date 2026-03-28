-- Persistence for devotional library, shared studies, subscriptions, and quality

CREATE TABLE IF NOT EXISTS public.user_saved_devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reference TEXT NOT NULL,
  devotional_type TEXT DEFAULT 'devotional',
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_saved_devotionals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own saved devotionals" ON public.user_saved_devotionals;
CREATE POLICY "Users can view their own saved devotionals"
  ON public.user_saved_devotionals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own saved devotionals" ON public.user_saved_devotionals;
CREATE POLICY "Users can create their own saved devotionals"
  ON public.user_saved_devotionals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_saved_devotionals_user_id
  ON public.user_saved_devotionals(user_id);

CREATE TABLE IF NOT EXISTS public.user_shared_study_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  study_title TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_shared_study_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own shared study comments" ON public.user_shared_study_comments;
CREATE POLICY "Users can view their own shared study comments"
  ON public.user_shared_study_comments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own shared study comments" ON public.user_shared_study_comments;
CREATE POLICY "Users can create their own shared study comments"
  ON public.user_shared_study_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_shared_study_comments_user_id
  ON public.user_shared_study_comments(user_id);

CREATE TABLE IF NOT EXISTS public.user_subscription_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  selected_plan TEXT DEFAULT 'free',
  billing_interval TEXT DEFAULT 'monthly',
  team_size INTEGER DEFAULT 1,
  trial_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_subscription_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subscription settings" ON public.user_subscription_settings;
CREATE POLICY "Users can view their own subscription settings"
  ON public.user_subscription_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own subscription settings" ON public.user_subscription_settings;
CREATE POLICY "Users can create their own subscription settings"
  ON public.user_subscription_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own subscription settings" ON public.user_subscription_settings;
CREATE POLICY "Users can update their own subscription settings"
  ON public.user_subscription_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscription_settings_user_id
  ON public.user_subscription_settings(user_id);

CREATE TABLE IF NOT EXISTS public.user_quality_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  status TEXT DEFAULT 'planned',
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_quality_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own quality reports" ON public.user_quality_reports;
CREATE POLICY "Users can view their own quality reports"
  ON public.user_quality_reports FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own quality reports" ON public.user_quality_reports;
CREATE POLICY "Users can create their own quality reports"
  ON public.user_quality_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_quality_reports_user_id
  ON public.user_quality_reports(user_id);
