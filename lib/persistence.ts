// Helper functions for interacting with persistence APIs

export async function saveNote(
  reference: string,
  content: string,
  noteType: 'note' | 'highlight' | 'question' = 'note',
  color: string = '#ffff00',
  tags: string[] = []
) {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reference,
      content,
      note_type: noteType,
      color,
      tags,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save note');
  }

  return response.json();
}

export async function updateNote(
  id: string,
  content: string,
  color?: string,
  tags?: string[]
) {
  const response = await fetch('/api/notes', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      content,
      color,
      tags,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update note');
  }

  return response.json();
}

export async function deleteNote(id: string) {
  const response = await fetch(`/api/notes?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete note');
  }

  return response.json();
}

export async function getNotes() {
  const response = await fetch('/api/notes');

  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }

  return response.json();
}

export async function addBookmark(reference: string, category?: string) {
  const response = await fetch('/api/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference, category }),
  });

  if (!response.ok) {
    throw new Error('Failed to add bookmark');
  }

  return response.json();
}

export async function removeBookmark(reference: string) {
  const response = await fetch('/api/bookmarks', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove bookmark');
  }

  return response.json();
}

export async function getBookmarks() {
  const response = await fetch('/api/bookmarks');

  if (!response.ok) {
    throw new Error('Failed to fetch bookmarks');
  }

  return response.json();
}

export async function logStudySession(
  reference: string,
  translation: string = 'web',
  timeSpentMinutes: number = 0
) {
  const response = await fetch('/api/studies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reference,
      translation,
      time_spent_minutes: timeSpentMinutes,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to log study session');
  }

  return response.json();
}

export async function getStudyStats() {
  const response = await fetch('/api/studies');

  if (!response.ok) {
    throw new Error('Failed to fetch study stats');
  }

  return response.json();
}

export async function getNotesForReference(reference: string) {
  const allNotes = (await getNotes()) as Array<{ reference: string }>;
  return allNotes.filter((note) => note.reference === reference);
}

export async function saveStudySession(
  reference: string,
  mode: string,
  summary: string
) {
  const response = await fetch('/api/study-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference, mode, summary }),
  });

  if (!response.ok) {
    throw new Error('Failed to save study session');
  }

  return response.json();
}

export async function getStudySessions() {
  const response = await fetch('/api/study-sessions');

  if (!response.ok) {
    throw new Error('Failed to fetch study sessions');
  }

  return response.json();
}

export async function saveMentorHistory(
  reference: string,
  question: string,
  answer: object
) {
  const response = await fetch('/api/mentor-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference, question, answer }),
  });

  if (!response.ok) {
    throw new Error('Failed to save mentor history');
  }

  return response.json();
}

export async function getMentorHistory() {
  const response = await fetch('/api/mentor-history');

  if (!response.ok) {
    throw new Error('Failed to fetch mentor history');
  }

  return response.json();
}

export async function savePrayerEntry(
  title: string,
  content: string,
  category: string
) {
  const response = await fetch('/api/prayer-journal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, category }),
  });

  if (!response.ok) {
    throw new Error('Failed to save prayer entry');
  }

  return response.json();
}

export async function getPrayerEntries() {
  const response = await fetch('/api/prayer-journal');

  if (!response.ok) {
    throw new Error('Failed to fetch prayer entries');
  }

  return response.json();
}

export async function updatePrayerEntry(id: string, answered: boolean) {
  const response = await fetch('/api/prayer-journal', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, answered }),
  });

  if (!response.ok) {
    throw new Error('Failed to update prayer entry');
  }

  return response.json();
}

export async function getActivityTimeline() {
  const response = await fetch('/api/activity');

  if (!response.ok) {
    throw new Error('Failed to fetch activity timeline');
  }

  return response.json();
}

export async function saveWorkspaceResource(
  title: string,
  resourceType: string,
  summary: string
) {
  const response = await fetch('/api/workspace-resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      resource_type: resourceType,
      summary,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save workspace resource');
  }

  return response.json();
}

export async function getWorkspaceResources() {
  const response = await fetch('/api/workspace-resources');

  if (!response.ok) {
    throw new Error('Failed to fetch workspace resources');
  }

  return response.json();
}

export async function getPublicProfile() {
  const response = await fetch('/api/public-profile');

  if (!response.ok) {
    throw new Error('Failed to fetch public profile');
  }

  return response.json();
}

export async function savePublicProfile(input: {
  display_name: string;
  current_focus: string;
  favorite_passages: string[];
  recent_highlights: string[];
  is_public: boolean;
}) {
  const response = await fetch('/api/public-profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save public profile');
  }

  return response.json();
}

export async function getSearchHistory() {
  const response = await fetch('/api/search-history');

  if (!response.ok) {
    throw new Error('Failed to fetch search history');
  }

  return response.json();
}

export async function saveSearchHistory(
  query: string,
  selectedResult?: string
) {
  const response = await fetch('/api/search-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      selected_result: selectedResult,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save search history');
  }

  return response.json();
}

export async function getWorkspaceCollaborators(workspaceResourceId: string) {
  const response = await fetch(
    `/api/workspace-collaborators?workspace_resource_id=${encodeURIComponent(workspaceResourceId)}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch workspace collaborators');
  }

  return response.json();
}

export async function saveWorkspaceCollaborator(
  workspaceResourceId: string,
  collaboratorName: string,
  collaboratorRole: string
) {
  const response = await fetch('/api/workspace-collaborators', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workspace_resource_id: workspaceResourceId,
      collaborator_name: collaboratorName,
      collaborator_role: collaboratorRole,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save workspace collaborator');
  }

  return response.json();
}

export async function getCommandCenterPreferences() {
  const response = await fetch('/api/command-center-preferences');

  if (!response.ok) {
    throw new Error('Failed to fetch command center preferences');
  }

  return response.json();
}

export async function saveCommandCenterPreferences(input: {
  visible_widgets: Record<string, boolean>;
  focus_goal: string;
  recommendation_weights: Record<string, number>;
}) {
  const response = await fetch('/api/command-center-preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save command center preferences');
  }

  return response.json();
}

export async function getCollaborationSettings() {
  const response = await fetch('/api/collaboration-settings');

  if (!response.ok) {
    throw new Error('Failed to fetch collaboration settings');
  }

  return response.json();
}

export async function saveCollaborationSettings(input: {
  preferred_room_type: string;
  moderation_mode: string;
  live_presence_enabled: boolean;
  shared_library_enabled: boolean;
  church_team_mode: boolean;
}) {
  const response = await fetch('/api/collaboration-settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save collaboration settings');
  }

  return response.json();
}

export async function getPersonalizationPreferences() {
  const response = await fetch('/api/personalization-preferences');

  if (!response.ok) {
    throw new Error('Failed to fetch personalization preferences');
  }

  return response.json();
}

export async function savePersonalizationPreferences(input: {
  favorite_themes: string[];
  active_struggles: string[];
  growth_goals: string[];
  preferred_tone: string;
  recommendation_profile: Record<string, unknown>;
}) {
  const response = await fetch('/api/personalization-preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save personalization preferences');
  }

  return response.json();
}

export async function getWorkflowRuns() {
  const response = await fetch('/api/workflow-runs');

  if (!response.ok) {
    throw new Error('Failed to fetch workflow runs');
  }

  return response.json();
}

export async function saveWorkflowRun(input: {
  workflow_name: string;
  linked_reference?: string;
  stage?: string;
  status?: string;
  summary: string;
  next_step?: string;
  output?: Record<string, unknown>;
}) {
  const response = await fetch('/api/workflow-runs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save workflow run');
  }

  return response.json();
}

export async function updateWorkflowRun(input: {
  id: string;
  stage?: string;
  status?: string;
  next_step?: string;
  output?: Record<string, unknown>;
}) {
  const response = await fetch('/api/workflow-runs', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update workflow run');
  }

  return response.json();
}

export async function getGuidedPaths() {
  const response = await fetch('/api/guided-paths');

  if (!response.ok) {
    throw new Error('Failed to fetch guided paths');
  }

  return response.json();
}

export async function saveGuidedPath(input: {
  title: string;
  path_type?: string;
  cadence?: string;
  summary: string;
  current_week?: string;
  current_focus?: string;
  status?: string;
}) {
  const response = await fetch('/api/guided-paths', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save guided path');
  }

  return response.json();
}

export async function updateGuidedPath(input: {
  id: string;
  current_week?: string;
  current_focus?: string;
  status?: string;
}) {
  const response = await fetch('/api/guided-paths', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update guided path');
  }

  return response.json();
}

export async function deleteGuidedPath(id: string) {
  const response = await fetch(`/api/guided-paths?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete guided path');
  }

  return response.json();
}

export async function getCourseEnrollments() {
  const response = await fetch('/api/course-enrollments');

  if (!response.ok) {
    throw new Error('Failed to fetch course enrollments');
  }

  return response.json();
}

export async function saveCourseEnrollment(input: {
  title: string;
  category?: string;
  progress_percentage?: number;
  status?: string;
  current_module?: string;
  summary: string;
}) {
  const response = await fetch('/api/course-enrollments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save course enrollment');
  }

  return response.json();
}

export async function updateCourseEnrollment(input: {
  id: string;
  progress_percentage?: number;
  status?: string;
  current_module?: string;
}) {
  const response = await fetch('/api/course-enrollments', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update course enrollment');
  }

  return response.json();
}

export async function deleteCourseEnrollment(id: string) {
  const response = await fetch(`/api/course-enrollments?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete course enrollment');
  }

  return response.json();
}

export async function getNewBelieverProgress() {
  const response = await fetch('/api/new-believer-progress');

  if (!response.ok) {
    throw new Error('Failed to fetch new believer progress');
  }

  return response.json();
}

export async function saveNewBelieverProgress(input: {
  program_name?: string;
  current_week_index?: number;
  current_week_title?: string;
  completed_weeks?: string[];
  completed_milestones?: string[];
  reviewed_mentor_topics?: string[];
  week_checklists?: Record<string, string[]>;
  daily_readings_completed?: Record<string, string[]>;
  status?: string;
  started_at?: string | null;
  completed_at?: string | null;
}) {
  const response = await fetch('/api/new-believer-progress', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save new believer progress');
  }

  return response.json();
}

export async function getJourneys() {
  const response = await fetch('/api/journeys');

  if (!response.ok) {
    throw new Error('Failed to fetch journeys');
  }

  return response.json();
}

export async function saveJourney(input: {
  title: string;
  duration_label: string;
  status?: string;
  summary: string;
  current_step?: string;
}) {
  const response = await fetch('/api/journeys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save journey');
  }

  return response.json();
}

export async function updateJourney(input: {
  id: string;
  status?: string;
  current_step?: string;
}) {
  const response = await fetch('/api/journeys', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update journey');
  }

  return response.json();
}

export async function getChurchAdminSettings() {
  const response = await fetch('/api/church-admin-settings');

  if (!response.ok) {
    throw new Error('Failed to fetch church admin settings');
  }

  return response.json();
}

export async function saveChurchAdminSettings(input: {
  ministry_name: string;
  role_scope: string;
  approvals_enabled: boolean;
  room_oversight_enabled: boolean;
  publishing_queue_enabled: boolean;
}) {
  const response = await fetch('/api/church-admin-settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save church admin settings');
  }

  return response.json();
}

export async function getRoomSyncStates() {
  const response = await fetch('/api/room-sync');

  if (!response.ok) {
    throw new Error('Failed to fetch room sync states');
  }

  return response.json();
}

export async function saveRoomSyncState(input: {
  room_name: string;
  room_type?: string;
  sync_stage?: string;
  participant_count?: number;
  presence_mode?: string;
  shared_notes_enabled?: boolean;
  prayer_feed_enabled?: boolean;
}) {
  const response = await fetch('/api/room-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save room sync state');
  }

  return response.json();
}

export async function updateRoomSyncState(input: {
  id: string;
  sync_stage?: string;
  participant_count?: number;
}) {
  const response = await fetch('/api/room-sync', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update room sync state');
  }

  return response.json();
}

export async function getSavedDevotionals() {
  const response = await fetch('/api/saved-devotionals');

  if (!response.ok) {
    throw new Error('Failed to fetch saved devotionals');
  }

  return response.json();
}

export async function saveSavedDevotional(input: {
  title: string;
  reference: string;
  devotional_type?: string;
  summary: string;
}) {
  const response = await fetch('/api/saved-devotionals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save devotional');
  }

  return response.json();
}

export async function getSharedStudyComments() {
  const response = await fetch('/api/shared-study-comments');

  if (!response.ok) {
    throw new Error('Failed to fetch shared study comments');
  }

  return response.json();
}

export async function saveSharedStudyComment(input: {
  study_title: string;
  author_name: string;
  content: string;
}) {
  const response = await fetch('/api/shared-study-comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save shared study comment');
  }

  return response.json();
}

export async function getSubscriptionSettings() {
  const response = await fetch('/api/subscription-settings');

  if (!response.ok) {
    throw new Error('Failed to fetch subscription settings');
  }

  return response.json();
}

export async function saveSubscriptionSettings(input: {
  selected_plan: string;
  billing_interval: string;
  team_size: number;
  trial_active: boolean;
}) {
  const response = await fetch('/api/subscription-settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save subscription settings');
  }

  return response.json();
}

export async function getQualityReports() {
  const response = await fetch('/api/quality-reports');

  if (!response.ok) {
    throw new Error('Failed to fetch quality reports');
  }

  return response.json();
}

export async function saveQualityReport(input: {
  report_type: string;
  status?: string;
  summary: string;
}) {
  const response = await fetch('/api/quality-reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save quality report');
  }

  return response.json();
}

export async function getPassageDashboards() {
  const response = await fetch('/api/passage-dashboards');

  if (!response.ok) {
    throw new Error('Failed to fetch passage dashboards');
  }

  return response.json();
}

export async function savePassageDashboard(input: {
  reference: string;
  title: string;
  study_mode?: string;
  summary: string;
  mentor_thread_summary?: string;
  prayer_focus?: string;
  next_action?: string;
}) {
  const response = await fetch('/api/passage-dashboards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save passage dashboard');
  }

  return response.json();
}

export async function getPublishingFlows() {
  const response = await fetch('/api/publishing-flows');

  if (!response.ok) {
    throw new Error('Failed to fetch publishing flows');
  }

  return response.json();
}

export async function savePublishingFlow(input: {
  title: string;
  audience?: string;
  content_type?: string;
  status?: string;
  destination?: string;
  summary: string;
  share_scope?: string;
}) {
  const response = await fetch('/api/publishing-flows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save publishing flow');
  }

  return response.json();
}

export async function updatePublishingFlow(input: {
  id: string;
  status?: string;
  destination?: string;
  share_scope?: string;
}) {
  const response = await fetch('/api/publishing-flows', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update publishing flow');
  }

  return response.json();
}

export async function getTeamAccessSettings() {
  const response = await fetch('/api/team-access-settings');

  if (!response.ok) {
    throw new Error('Failed to fetch team access settings');
  }

  return response.json();
}

export async function saveTeamAccessSettings(input: {
  team_name: string;
  default_role: string;
  invite_mode: string;
  approval_required: boolean;
  seat_limit: number;
}) {
  const response = await fetch('/api/team-access-settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save team access settings');
  }

  return response.json();
}

export async function getTeamInvites() {
  const response = await fetch('/api/team-invites');

  if (!response.ok) {
    throw new Error('Failed to fetch team invites');
  }

  return response.json();
}

export async function saveTeamInvite(input: {
  team_name: string;
  invite_email: string;
  role?: string;
  status?: string;
}) {
  const response = await fetch('/api/team-invites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save team invite');
  }

  return response.json();
}

export async function getMentorChatThreads() {
  const response = await fetch('/api/mentor-chat-threads');

  if (!response.ok) {
    throw new Error('Failed to fetch mentor chat threads');
  }

  return response.json();
}

export async function saveMentorChatThread(input: {
  reference: string;
  title: string;
  goal?: string;
  status?: string;
  latest_summary?: string;
  next_step?: string;
}) {
  const response = await fetch('/api/mentor-chat-threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save mentor chat thread');
  }

  return response.json();
}

export async function updateMentorChatThread(input: {
  id: string;
  latest_summary?: string;
  next_step?: string;
  status?: string;
}) {
  const response = await fetch('/api/mentor-chat-threads', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update mentor chat thread');
  }

  return response.json();
}

export async function getMentorChatMessages(threadId: string) {
  const response = await fetch(
    `/api/mentor-chat-messages?thread_id=${encodeURIComponent(threadId)}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch mentor chat messages');
  }

  return response.json();
}

export async function saveMentorChatMessage(input: {
  thread_id: string;
  speaker: string;
  message: string;
  stage?: string;
}) {
  const response = await fetch('/api/mentor-chat-messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save mentor chat message');
  }

  return response.json();
}

export async function getTheologyTopics() {
  const response = await fetch('/api/theology-topics');

  if (!response.ok) {
    throw new Error('Failed to fetch theology topics');
  }

  return response.json();
}

export async function saveTheologyTopic(input: {
  title: string;
  focus: string;
  key_verse?: string;
  tradition_view?: string;
  status?: string;
}) {
  const response = await fetch('/api/theology-topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save theology topic');
  }

  return response.json();
}

export async function getBibleQuestions() {
  const response = await fetch('/api/bible-questions');

  if (!response.ok) {
    throw new Error('Failed to fetch bible questions');
  }

  return response.json();
}

export async function saveBibleQuestion(input: {
  question: string;
  answer_summary: string;
  selected_topic?: string;
  key_verses?: string[];
}) {
  const response = await fetch('/api/bible-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save bible question');
  }

  return response.json();
}

export async function getCustomReadingPlans() {
  const response = await fetch('/api/custom-reading-plans');

  if (!response.ok) {
    throw new Error('Failed to fetch custom reading plans');
  }

  return response.json();
}

export async function saveCustomReadingPlan(input: {
  prompt: string;
  title: string;
  duration_days?: number;
  focus?: string;
  summary: string;
  entries?: Array<{ day: number; reference: string; note: string }>;
}) {
  const response = await fetch('/api/custom-reading-plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save custom reading plan');
  }

  return response.json();
}

export async function getMemorizationProgress() {
  const response = await fetch('/api/memorization-progress');

  if (!response.ok) {
    throw new Error('Failed to fetch memorization progress');
  }

  return response.json();
}

export async function saveMemorizationProgress(input: {
  reference: string;
  prompt: string;
  review_count?: number;
  mastery_level?: string;
  last_result?: string;
  next_review_at?: string;
}) {
  const response = await fetch('/api/memorization-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save memorization progress');
  }

  return response.json();
}

export async function updateMemorizationProgress(input: {
  id: string;
  review_count?: number;
  mastery_level?: string;
  last_result?: string;
  next_review_at?: string;
}) {
  const response = await fetch('/api/memorization-progress', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update memorization progress');
  }

  return response.json();
}

export async function getBibleMapStates() {
  const response = await fetch('/api/bible-map-states');

  if (!response.ok) {
    throw new Error('Failed to fetch bible map states');
  }

  return response.json();
}

export async function saveBibleMapState(input: {
  map_title: string;
  selected_place: string;
  layer_mode?: string;
  timeline_note?: string;
}) {
  const response = await fetch('/api/bible-map-states', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save bible map state');
  }

  return response.json();
}

export async function getDashboardStates() {
  const response = await fetch('/api/dashboard-states');

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard states');
  }

  return response.json();
}

export async function saveDashboardState(input: {
  title: string;
  topic: string;
  reading: string;
  summary: string;
  focus_mode?: string;
  reminder_state?: string;
}) {
  const response = await fetch('/api/dashboard-states', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save dashboard state');
  }

  return response.json();
}

export async function getAIStudioOutputs() {
  const response = await fetch('/api/ai-studio-outputs');

  if (!response.ok) {
    throw new Error('Failed to fetch AI studio outputs');
  }

  return response.json();
}

export async function saveAIStudioOutput(input: {
  title: string;
  generation_type: string;
  source_reference?: string;
  summary: string;
  prompt_template?: string;
  status?: string;
}) {
  const response = await fetch('/api/ai-studio-outputs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save AI studio output');
  }

  return response.json();
}

export async function getTranslationCompareStates() {
  const response = await fetch('/api/translation-compare-states');

  if (!response.ok) {
    throw new Error('Failed to fetch translation compare states');
  }

  return response.json();
}

export async function saveTranslationCompareState(input: {
  reference: string;
  primary_translation?: string;
  secondary_translation?: string;
  tertiary_translation?: string;
  notes?: string;
}) {
  const response = await fetch('/api/translation-compare-states', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save translation compare state');
  }

  return response.json();
}

export async function getCommentarySaves() {
  const response = await fetch('/api/commentary-saves');

  if (!response.ok) {
    throw new Error('Failed to fetch commentary saves');
  }

  return response.json();
}

export async function saveCommentarySave(input: {
  source_title: string;
  reference: string;
  summary: string;
  use_case?: string;
}) {
  const response = await fetch('/api/commentary-saves', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save commentary save');
  }

  return response.json();
}

export async function getSurpriseStudies() {
  const response = await fetch('/api/surprise-studies');

  if (!response.ok) {
    throw new Error('Failed to fetch surprise studies');
  }

  return response.json();
}

export async function saveSurpriseStudy(input: {
  title: string;
  reference: string;
  prompt: string;
  category?: string;
}) {
  const response = await fetch('/api/surprise-studies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save surprise study');
  }

  return response.json();
}

export async function getSeasonalChallenges() {
  const response = await fetch('/api/seasonal-challenges');

  if (!response.ok) {
    throw new Error('Failed to fetch seasonal challenges');
  }

  return response.json();
}

export async function saveSeasonalChallenge(input: {
  challenge_title: string;
  challenge_season?: string;
  status?: string;
  progress_note?: string;
  reward_claimed?: boolean;
  last_completed_at?: string;
}) {
  const response = await fetch('/api/seasonal-challenges', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save seasonal challenge');
  }

  return response.json();
}

export async function updateSeasonalChallenge(input: {
  challenge_title: string;
  status?: string;
  progress_note?: string;
  reward_claimed?: boolean;
  last_completed_at?: string;
}) {
  const response = await fetch('/api/seasonal-challenges', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update seasonal challenge');
  }

  return response.json();
}

export async function getMemoryBattleStats() {
  const response = await fetch('/api/memory-battle-stats');

  if (!response.ok) {
    throw new Error('Failed to fetch memory battle stats');
  }

  return response.json();
}

export async function saveMemoryBattleStats(input: {
  current_score?: number;
  best_score?: number;
  rounds_played?: number;
  rounds_won?: number;
}) {
  const response = await fetch('/api/memory-battle-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save memory battle stats');
  }

  return response.json();
}

export async function updateMemoryBattleStats(input: {
  current_score?: number;
  best_score?: number;
  rounds_played?: number;
  rounds_won?: number;
}) {
  const response = await fetch('/api/memory-battle-stats', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update memory battle stats');
  }

  return response.json();
}

export async function getGamificationProgress() {
  const response = await fetch('/api/gamification-progress');

  if (!response.ok) {
    throw new Error('Failed to fetch gamification progress');
  }

  return response.json();
}

export async function saveGamificationProgress(input: {
  xp_points?: number;
  current_level?: number;
  unlocked_badges?: string[];
  completed_daily_quests?: string[];
  active_weekly_challenges?: string[];
  mastery_rank?: string;
  streak_freezes?: number;
}) {
  const response = await fetch('/api/gamification-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save gamification progress');
  }

  return response.json();
}

export async function updateGamificationProgress(input: {
  xp_points?: number;
  current_level?: number;
  unlocked_badges?: string[];
  completed_daily_quests?: string[];
  active_weekly_challenges?: string[];
  mastery_rank?: string;
  streak_freezes?: number;
}) {
  const response = await fetch('/api/gamification-progress', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update gamification progress');
  }

  return response.json();
}

export async function getCertificates() {
  const response = await fetch('/api/certificates');

  if (!response.ok) {
    throw new Error('Failed to fetch certificates');
  }

  return response.json();
}

export async function saveCertificate(input: {
  title: string;
  reward: string;
  status?: string;
  share_card_state?: string;
}) {
  const response = await fetch('/api/certificates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save certificate');
  }

  return response.json();
}

export async function updateCertificate(input: {
  id: string;
  status?: string;
  share_card_state?: string;
}) {
  const response = await fetch('/api/certificates', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update certificate');
  }

  return response.json();
}

export async function getVerseByVerseProgress(reference?: string) {
  const query = reference
    ? `?reference=${encodeURIComponent(reference)}`
    : '';
  const response = await fetch(`/api/verse-by-verse-progress${query}`);

  if (!response.ok) {
    throw new Error('Failed to fetch verse-by-verse progress');
  }

  return response.json();
}

export async function saveVerseByVerseProgress(input: {
  reference: string;
  completed_verses?: string[];
  last_focus_verse?: string;
  completion_status?: string;
}) {
  const response = await fetch('/api/verse-by-verse-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to save verse-by-verse progress');
  }

  return response.json();
}

export async function updateVerseByVerseProgress(input: {
  id: string;
  completed_verses?: string[];
  last_focus_verse?: string;
  completion_status?: string;
}) {
  const response = await fetch('/api/verse-by-verse-progress', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update verse-by-verse progress');
  }

  return response.json();
}
