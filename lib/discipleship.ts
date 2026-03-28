export interface ActivityItem {
  id: string;
  event_type: string;
  reference: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface StudySessionItem {
  id: string;
  reference: string;
  mode: string;
  summary: string;
  created_at: string;
}

export interface PrayerEntryItem {
  id: string;
  title: string;
  category: string;
  answered: boolean;
}

export interface JourneyItem {
  id: string;
  title: string;
  status: string;
  current_step?: string | null;
}

export interface WorkflowRunItem {
  id: string;
  workflow_name: string;
  linked_reference?: string | null;
  status: string;
  stage?: string | null;
  summary: string;
  next_step?: string | null;
  output?: Record<string, unknown> | null;
  created_at: string;
}

export interface PersonalizationPreferencesItem {
  favorite_themes?: string[];
  active_struggles?: string[];
  growth_goals?: string[];
  preferred_tone?: string;
}

export interface NewBelieverProgressItem {
  status?: string;
  current_week_index?: number;
  current_week_title?: string | null;
  completed_weeks?: string[];
}

export interface RecommendationItem {
  id: string;
  title: string;
  detail: string;
  href: string;
  reason: string;
  theme: "study" | "prayer" | "community" | "growth";
}

export interface ContinuityMoment {
  id: string;
  title: string;
  detail: string;
  href: string;
  createdAt: string;
  category: "study" | "prayer" | "journey" | "workflow" | "activity";
}

const struggleJourneys: Record<string, { title: string; reference: string; href: string }> = {
  anxiety: {
    title: "Move from anxiety to peace",
    reference: "Philippians 4",
    href: "/journeys",
  },
  fear: {
    title: "Fight fear with trust",
    reference: "Psalm 27",
    href: "/journeys",
  },
  grief: {
    title: "Walk with God through grief",
    reference: "Psalm 34",
    href: "/journeys",
  },
  forgiveness: {
    title: "Practice forgiveness",
    reference: "Ephesians 4",
    href: "/journeys",
  },
  direction: {
    title: "Seek wisdom for direction",
    reference: "Proverbs 3:5-6",
    href: "/journeys",
  },
};

function titleCaseEvent(eventType: string) {
  return eventType
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildContinuityMoments(input: {
  activity: ActivityItem[];
  sessions: StudySessionItem[];
  prayers: PrayerEntryItem[];
  journeys: JourneyItem[];
  workflows: WorkflowRunItem[];
}) {
  const moments: ContinuityMoment[] = [];

  input.sessions.slice(0, 3).forEach((session) => {
    moments.push({
      id: `session-${session.id}`,
      title: `Resume ${session.reference}`,
      detail: session.summary,
      href: `/passage/${encodeURIComponent(session.reference.toLowerCase().replace(/\s+/g, "-"))}`,
      createdAt: session.created_at,
      category: "study",
    });
  });

  input.prayers
    .filter((entry) => !entry.answered)
    .slice(0, 2)
    .forEach((entry) => {
      moments.push({
        id: `prayer-${entry.id}`,
        title: `Revisit prayer: ${entry.title}`,
        detail: `Keep praying through ${entry.category.toLowerCase()} and record any update.`,
        href: "/prayer",
        createdAt: new Date().toISOString(),
        category: "prayer",
      });
    });

  input.journeys
    .filter((journey) => journey.status !== "completed")
    .slice(0, 2)
    .forEach((journey) => {
      moments.push({
        id: `journey-${journey.id}`,
        title: journey.title,
        detail: journey.current_step || "Continue your discipleship journey.",
        href: "/journeys",
        createdAt: new Date().toISOString(),
        category: "journey",
      });
    });

  input.workflows.slice(0, 2).forEach((workflow) => {
    moments.push({
      id: `workflow-${workflow.id}`,
      title: workflow.summary,
      detail: workflow.next_step || `Stage: ${workflow.stage || "planned"}`,
      href: "/orchestration",
      createdAt: workflow.created_at,
      category: "workflow",
    });
  });

  input.activity.slice(0, 4).forEach((item) => {
    moments.push({
      id: `activity-${item.id}`,
      title: titleCaseEvent(item.event_type),
      detail:
        typeof item.reference === "string" && item.reference.length > 0
          ? item.reference
          : "Recent discipleship activity recorded",
      href: "/study",
      createdAt: item.created_at,
      category: "activity",
    });
  });

  return moments
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 8);
}

export function buildRecommendations(input: {
  preferences: PersonalizationPreferencesItem | null;
  prayers: PrayerEntryItem[];
  sessions: StudySessionItem[];
  journeys: JourneyItem[];
  progress: NewBelieverProgressItem | null;
  activity: ActivityItem[];
}) {
  const recommendations: RecommendationItem[] = [];
  const latestSession = input.sessions[0];
  const topStruggle = input.preferences?.active_struggles?.[0]?.toLowerCase();
  const topGoal = input.preferences?.growth_goals?.[0];
  const unfinishedPrayer = input.prayers.find((entry) => !entry.answered);
  const activeJourney = input.journeys.find((journey) => journey.status !== "completed");

  if (latestSession) {
    recommendations.push({
      id: "resume-latest-session",
      title: `Continue ${latestSession.reference}`,
      detail: `Pick up your last saved study and move it into prayer, notes, or memorization.`,
      href: "/study",
      reason: "You already invested in this passage, so it is the clearest next step.",
      theme: "study",
    });
  }

  if (unfinishedPrayer) {
    recommendations.push({
      id: "revisit-prayer",
      title: `Follow up on ${unfinishedPrayer.title}`,
      detail: "Turn this prayer request into an answered-prayer update or a short testimony note.",
      href: "/prayer",
      reason: "The app should help you notice faithfulness, not only collect requests.",
      theme: "prayer",
    });
  }

  if (topStruggle && struggleJourneys[topStruggle]) {
    const struggleJourney = struggleJourneys[topStruggle];
    recommendations.push({
      id: `journey-${topStruggle}`,
      title: struggleJourney.title,
      detail: `Start a guided path rooted in ${struggleJourney.reference} with prayer and follow-up built in.`,
      href: struggleJourney.href,
      reason: `Your current struggle points toward a guided discipleship journey.`,
      theme: "growth",
    });
  }

  if (input.progress && input.progress.status !== "completed") {
    const weekNumber = (input.progress.current_week_index || 0) + 1;
    recommendations.push({
      id: "new-believer-next-week",
      title: `Continue new believer week ${weekNumber}`,
      detail:
        input.progress.current_week_title ||
        "Resume the next week of reading, prayer, and simple obedience.",
      href: "/new-believers",
      reason: "A guided foundation track is one of the strongest ways to build consistency.",
      theme: "growth",
    });
  }

  if (activeJourney) {
    recommendations.push({
      id: "active-journey",
      title: `Stay with ${activeJourney.title}`,
      detail: activeJourney.current_step || "Keep the current journey moving before starting another one.",
      href: "/journeys",
      reason: "Momentum compounds when the next step is obvious.",
      theme: "growth",
    });
  }

  if (topGoal) {
    recommendations.push({
      id: "growth-goal",
      title: `Build around your goal: ${topGoal}`,
      detail: "Use one focused reading, one prayer prompt, and one small action step today.",
      href: "/today",
      reason: "Your stated growth goals should shape what the app puts in front of you.",
      theme: "study",
    });
  }

  const communitySignals = input.activity.filter((item) =>
    ["team_invite_created", "shared_study_comment_created", "journey_saved"].includes(item.event_type),
  );

  recommendations.push({
    id: "group-discipleship",
    title: "Take one next step in community",
    detail:
      communitySignals.length > 0
        ? "You already have shared activity. Use it to schedule a prayer follow-up or group study."
        : "Join a room, small group, or prayer rhythm so growth is not only private.",
    href: "/community",
    reason: "Healthy discipleship usually becomes more sustainable in community.",
    theme: "community",
  });

  return recommendations.slice(0, 5);
}
