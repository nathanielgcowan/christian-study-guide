// Database Types

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  subscription_tier: "free" | "premium" | "church";
  role?: "user" | "admin" | "super_admin";
  tradition?: "overview" | "protestant" | "baptist" | "reformed" | "non-denominational" | "catholic";
  created_at: string;
  updated_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  best_streak: number;
  last_read_date: string | null;
  total_studies: number;
  created_at: string;
  updated_at: string;
}

export interface UserStudy {
  id: string;
  user_id: string;
  reference: string;
  translation: "web" | "kjv" | "asv";
  read_at: string;
  time_spent_minutes: number;
  completed: boolean;
  created_at: string;
}

export interface UserNote {
  id: string;
  user_id: string;
  reference: string;
  content: string;
  note_type: "note" | "highlight" | "question";
  color: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface UserBookmark {
  id: string;
  user_id: string;
  reference: string;
  category: string | null;
  created_at: string;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string | null;
  plan_type: "general" | "theology" | "topical" | "customized";
  duration_days: number | null;
  entries: ReadingPlanEntry[];
  created_at: string;
}

export interface ReadingPlanEntry {
  day: number;
  reference: string;
  notes: string;
}

export interface UserReadingPlan {
  id: string;
  user_id: string;
  plan_id: string;
  started_at: string;
  current_day: number;
  completed: boolean;
  completed_at: string | null;
}

export interface UserJournal {
  id: string;
  user_id: string;
  reference: string;
  entry_type: "journal" | "prayer" | "devotional" | "reflection";
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  reference: string;
  question: string;
  answer: string | null;
  type: "tutor" | "companion" | "guide";
  tokens_used: number | null;
  created_at: string;
  updated_at: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  avatar_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  members_count?: number;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "member" | "moderator" | "admin";
  joined_at: string;
}

export interface PrayerRequest {
  id: string;
  user_id: string;
  title: string;
  content: string;
  answered: boolean;
  answered_at: string | null;
  replies_count: number;
  likes_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  creator?: UserProfile;
}

export interface UserActivity {
  id: string;
  user_id: string;
  event_type: string;
  reference: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface UserPrayerEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  answered: boolean;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWorkspaceResource {
  id: string;
  user_id: string;
  title: string;
  resource_type: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface UserPublicProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  current_focus: string | null;
  favorite_passages: string[];
  recent_highlights: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSearchHistoryItem {
  id: string;
  user_id: string;
  query: string;
  selected_result: string | null;
  created_at: string;
}

export interface WorkspaceCollaborator {
  id: string;
  workspace_resource_id: string;
  user_id: string;
  collaborator_name: string;
  collaborator_role: string;
  created_at: string;
}

export interface UserCommandCenterPreferences {
  id: string;
  user_id: string;
  visible_widgets: Record<string, boolean>;
  focus_goal: "consistency" | "depth" | "leadership" | "discipleship";
  recommendation_weights: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface UserCollaborationSettings {
  id: string;
  user_id: string;
  preferred_room_type: string;
  moderation_mode: string;
  live_presence_enabled: boolean;
  shared_library_enabled: boolean;
  church_team_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPersonalizationPreferences {
  id: string;
  user_id: string;
  favorite_themes: string[];
  active_struggles: string[];
  growth_goals: string[];
  preferred_tone: string;
  recommendation_profile: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserWorkflowRun {
  id: string;
  user_id: string;
  workflow_name: string;
  linked_reference: string | null;
  stage: string;
  status: string;
  summary: string;
  next_step: string | null;
  output: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserJourney {
  id: string;
  user_id: string;
  title: string;
  duration_label: string;
  status: string;
  summary: string;
  current_step: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserGamificationProgress {
  id: string;
  user_id: string;
  xp_points: number;
  current_level: number;
  unlocked_badges: string[];
  completed_daily_quests: string[];
  active_weekly_challenges: string[];
  mastery_rank: string;
  streak_freezes: number;
  created_at: string;
  updated_at: string;
}

export interface UserCertificate {
  id: string;
  user_id: string;
  title: string;
  reward: string;
  status: string;
  share_card_state: string;
  issued_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserVerseByVerseProgress {
  id: string;
  user_id: string;
  reference: string;
  completed_verses: string[];
  last_focus_verse: string | null;
  completion_status: string;
  created_at: string;
  updated_at: string;
}

export interface UserSurpriseStudyHistory {
  id: string;
  user_id: string;
  title: string;
  reference: string;
  prompt: string;
  category: string;
  created_at: string;
}

export interface UserSeasonalChallengeProgress {
  id: string;
  user_id: string;
  challenge_title: string;
  challenge_season: string;
  status: string;
  progress_note: string | null;
  reward_claimed: boolean;
  last_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserMemoryBattleStats {
  id: string;
  user_id: string;
  current_score: number;
  best_score: number;
  rounds_played: number;
  rounds_won: number;
  created_at: string;
  updated_at: string;
}

export interface UserChurchAdminSettings {
  id: string;
  user_id: string;
  ministry_name: string;
  role_scope: string;
  approvals_enabled: boolean;
  room_oversight_enabled: boolean;
  publishing_queue_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoomSyncState {
  id: string;
  user_id: string;
  room_name: string;
  room_type: string;
  sync_stage: string;
  participant_count: number;
  presence_mode: string;
  shared_notes_enabled: boolean;
  prayer_feed_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSavedDevotional {
  id: string;
  user_id: string;
  title: string;
  reference: string;
  devotional_type: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface UserSharedStudyComment {
  id: string;
  user_id: string;
  study_title: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface UserSubscriptionSettings {
  id: string;
  user_id: string;
  selected_plan: string;
  billing_interval: string;
  team_size: number;
  trial_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserQualityReport {
  id: string;
  user_id: string;
  report_type: string;
  status: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface UserPassageDashboard {
  id: string;
  user_id: string;
  reference: string;
  title: string;
  study_mode: string;
  summary: string;
  mentor_thread_summary: string | null;
  prayer_focus: string | null;
  next_action: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPublishingFlow {
  id: string;
  user_id: string;
  title: string;
  audience: string;
  content_type: string;
  status: string;
  destination: string;
  summary: string;
  share_scope: string;
  created_at: string;
  updated_at: string;
}

export interface UserTeamAccessSettings {
  id: string;
  user_id: string;
  team_name: string;
  default_role: string;
  invite_mode: string;
  approval_required: boolean;
  seat_limit: number;
  created_at: string;
  updated_at: string;
}

export interface UserTeamInvite {
  id: string;
  user_id: string;
  team_name: string;
  invite_email: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserMentorChatThread {
  id: string;
  user_id: string;
  reference: string;
  title: string;
  goal: string | null;
  status: string;
  latest_summary: string | null;
  next_step: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserMentorChatMessage {
  id: string;
  thread_id: string;
  user_id: string;
  speaker: string;
  message: string;
  stage: string;
  created_at: string;
}

export interface UserTheologyTopic {
  id: string;
  user_id: string;
  title: string;
  focus: string;
  key_verse: string | null;
  tradition_view: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserBibleQuestion {
  id: string;
  user_id: string;
  question: string;
  answer_summary: string;
  selected_topic: string | null;
  key_verses: string[];
  created_at: string;
}

export interface UserCustomReadingPlan {
  id: string;
  user_id: string;
  prompt: string;
  title: string;
  duration_days: number;
  focus: string | null;
  summary: string;
  entries: Array<{ day: number; reference: string; note: string }>;
  created_at: string;
  updated_at: string;
}

export interface UserMemorizationProgress {
  id: string;
  user_id: string;
  reference: string;
  prompt: string;
  review_count: number;
  mastery_level: string;
  last_result: string;
  next_review_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserBibleMapState {
  id: string;
  user_id: string;
  map_title: string;
  selected_place: string;
  layer_mode: string;
  timeline_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserGuidedPath {
  id: string;
  user_id: string;
  title: string;
  path_type: string;
  cadence: string;
  summary: string;
  current_week: string | null;
  current_focus: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserCourseEnrollment {
  id: string;
  user_id: string;
  title: string;
  category: string;
  progress_percentage: number;
  status: string;
  current_module: string | null;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface UserDashboardState {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  reading: string;
  summary: string;
  focus_mode: string;
  reminder_state: string;
  created_at: string;
  updated_at: string;
}

export interface UserAIStudioOutput {
  id: string;
  user_id: string;
  title: string;
  generation_type: string;
  source_reference: string | null;
  summary: string;
  prompt_template: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserTranslationCompareState {
  id: string;
  user_id: string;
  reference: string;
  primary_translation: string;
  secondary_translation: string;
  tertiary_translation: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCommentarySave {
  id: string;
  user_id: string;
  source_title: string;
  reference: string;
  summary: string;
  use_case: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserNewBelieverProgress {
  id: string;
  user_id: string;
  program_name: string;
  current_week_index: number;
  current_week_title: string | null;
  completed_weeks: string[];
  completed_milestones: string[];
  reviewed_mentor_topics: string[];
  week_checklists: Record<string, string[]>;
  daily_readings_completed: Record<string, string[]>;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
