"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  BellRing,
  BrainCircuit,
  BookOpen,
  BookOpenText,
  CheckCircle2,
  Clock3,
  Flame,
  Gift,
  HeartHandshake,
  NotebookPen,
  Sparkle,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getActivityTimeline,
  getDashboardStates,
  getJourneys,
  getPersonalizationPreferences,
  getPrayerEntries,
  getStudySessions,
  getWorkflowRuns,
  saveDashboardState,
} from "@/lib/persistence";
import {
  buildContinuityMoments,
  buildRecommendations,
  type ActivityItem,
  type JourneyItem,
  type PersonalizationPreferencesItem,
  type PrayerEntryItem,
  type StudySessionItem,
  type WorkflowRunItem,
} from "@/lib/discipleship";

const DASHBOARD_STATES_KEY = "christian-study-guide:dashboard-states";

const todayStudy = {
  topic: "Faith during trials",
  reading: "James 1:2-4",
  explanation:
    "James teaches believers to see trials through the lens of spiritual formation, because testing produces endurance.",
  reflection: "What trial are you facing that needs a new perspective today?",
  prayer: "Ask God for perseverance, wisdom, and joy in the middle of pressure.",
  quiz: "What does James say trials produce?",
};

const dashboardCards = [
  {
    title: "Active guided path",
    detail: "Understand the Gospel • Week 2 • Why Jesus Died",
    href: "/paths",
    icon: Target,
  },
  {
    title: "Mentor follow-up",
    detail: "Your anxiety mentor thread is ready for a 3-day check-in.",
    href: "/mentor-chat",
    icon: BrainCircuit,
  },
  {
    title: "Memorization review",
    detail: "2 verses are due for review today with fill-in-the-blank practice.",
    href: "/memorize",
    icon: CheckCircle2,
  },
  {
    title: "Prayer reminder",
    detail: "Update your family guidance prayer request and mark answered prayers.",
    href: "/prayer",
    icon: BellRing,
  },
];

const streakMetrics = [
  { label: "Study streak", value: "14 days" },
  { label: "Courses active", value: "3" },
  { label: "Verses memorized", value: "12" },
  { label: "Prayers tracked", value: "28" },
];

const dailyQuests = [
  "Read one passage",
  "Answer one reflection question",
  "Review one memory verse",
  "Log one prayer",
];

const weeklyChallenges = [
  "Finish 3 studies this week",
  "Memorize 2 verses",
  "Complete 5 prayer entries",
];

const todayFlow = [
  "One passage to read",
  "One prayer prompt to respond to",
  "One memory verse to review",
  "One challenge to complete before the day ends",
];

const spiritualMilestones = [
  "7 days of daily prayer with Scripture",
  "3 completed guided-path weeks in a row",
  "5 memory verses reviewed on schedule",
  "2 answered prayers recorded this month",
];

const surpriseStudy = {
  title: "Wisdom when you need direction",
  reference: "Proverbs 3:5-6",
  detail: "A one-tap study with a quick explanation, reflection prompt, and prayer for guidance.",
};

interface SavedDashboardState {
  id: string;
  title: string;
  topic: string;
  reading: string;
  summary: string;
  focusMode: string;
  reminderState: string;
}

interface DashboardDataState {
  activity: ActivityItem[];
  journeys: JourneyItem[];
  preferences: PersonalizationPreferencesItem | null;
  prayers: PrayerEntryItem[];
  sessions: StudySessionItem[];
  workflows: WorkflowRunItem[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedStates, setSavedStates] = useState<SavedDashboardState[]>([]);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardDataState>({
    activity: [],
    journeys: [],
    preferences: null,
    prayers: [],
    sessions: [],
    workflows: [],
  });
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const [data, activity, journeys, preferences, prayers, sessions, workflows] =
            await Promise.all([
              getDashboardStates(),
              getActivityTimeline(),
              getJourneys(),
              getPersonalizationPreferences(),
              getPrayerEntries(),
              getStudySessions(),
              getWorkflowRuns(),
            ]);
          setSavedStates(
            (data as Array<{
              id: string;
              title: string;
              topic: string;
              reading: string;
              summary: string;
              focus_mode: string;
              reminder_state: string;
            }>).map((item) => ({
              id: item.id,
              title: item.title,
              topic: item.topic,
              reading: item.reading,
              summary: item.summary,
              focusMode: item.focus_mode,
              reminderState: item.reminder_state,
            })),
          );
          setDashboardData({
            activity: activity as ActivityItem[],
            journeys: journeys as JourneyItem[],
            preferences: (preferences as PersonalizationPreferencesItem | null) ?? null,
            prayers: prayers as PrayerEntryItem[],
            sessions: sessions as StudySessionItem[],
            workflows: workflows as WorkflowRunItem[],
          });
        } else {
          const raw = localStorage.getItem(DASHBOARD_STATES_KEY);
          if (raw) setSavedStates(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const recommendedNextSteps = buildRecommendations({
    preferences: dashboardData.preferences,
    prayers: dashboardData.prayers,
    sessions: dashboardData.sessions,
    journeys: dashboardData.journeys,
    progress: null,
    activity: dashboardData.activity,
  });

  const continuityMoments = buildContinuityMoments({
    activity: dashboardData.activity,
    sessions: dashboardData.sessions,
    prayers: dashboardData.prayers,
    journeys: dashboardData.journeys,
    workflows: dashboardData.workflows,
  });

  const handleSaveState = async () => {
    const payload = {
      title: "Today’s discipleship dashboard",
      topic: todayStudy.topic,
      reading: todayStudy.reading,
      summary: todayStudy.explanation,
      focus_mode: "daily-discipleship",
      reminder_state: "active",
    };

    try {
      if (user) {
        const saved = await saveDashboardState(payload);
        setSavedStates((current) => [
          {
            id: saved.id,
            title: saved.title,
            topic: saved.topic,
            reading: saved.reading,
            summary: saved.summary,
            focusMode: saved.focus_mode,
            reminderState: saved.reminder_state,
          },
          ...current,
        ]);
      } else {
        const next = [{ id: `${Date.now()}`, ...payload, focusMode: payload.focus_mode, reminderState: payload.reminder_state }, ...savedStates];
        setSavedStates(next);
        localStorage.setItem(DASHBOARD_STATES_KEY, JSON.stringify(next));
      }

      setSaveFeedback("Dashboard snapshot saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Daily discipleship dashboard
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              One place for today&apos;s study, growth habits, and next steps.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              This is the practical home screen: what to read, what to review, what to pray,
              and where your guided journey is headed next.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <BookOpen className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Today&apos;s study</h2>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                  {todayStudy.topic}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                  {todayStudy.reading}
                </h3>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-900">AI explanation</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{todayStudy.explanation}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-900">Reflection</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{todayStudy.reflection}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-900">Prayer prompt</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{todayStudy.prayer}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-900">Quiz check</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{todayStudy.quiz}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveState}
              className="mt-6 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Save dashboard snapshot
            </button>
            {saveFeedback ? (
              <p className="mt-3 text-sm font-semibold text-emerald-700">{saveFeedback}</p>
            ) : null}
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <Flame className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Growth snapshot</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {streakMetrics.map((metric) => (
                  <article
                    key={metric.label}
                    className="rounded-2xl border border-amber-200 bg-white p-5"
                  >
                    <p className="text-sm font-medium text-amber-900">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold text-amber-950">{metric.value}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <NotebookPen className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Quick launches</h2>
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  { label: "Open today’s passage", href: "/passage/james-1-2-4" },
                  { label: "Resume guided path", href: "/paths" },
                  { label: "Check notifications", href: "/notifications" },
                  { label: "Open prayer journal", href: "/prayer" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center justify-between rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Icon className="h-6 w-6 text-[#1e40af]" />
                <h2 className="mt-4 text-xl font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.detail}</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-blue-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-950">
              <BrainCircuit className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Personalized next steps</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {recommendedNextSteps.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {item.theme}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
                  <p className="mt-3 text-sm font-medium text-[#1e40af]">{item.reason}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Clock3 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Continue where you left off</h2>
            </div>
            <div className="mt-6 grid gap-3">
              {continuityMoments.length > 0 ? (
                continuityMoments.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="rounded-2xl border border-emerald-200 bg-white p-4 transition hover:bg-emerald-100"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-emerald-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-emerald-300 bg-white p-4 text-sm text-emerald-950">
                  Save a study, prayer, or journey update and the dashboard will bring it back here.
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <Clock3 className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">A stronger daily home experience</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {todayFlow.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-amber-200 bg-white p-5 text-sm font-medium text-amber-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-950">
              <BookOpenText className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Structured daily journey</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {todayFlow.map((item, index) => {
                const icons = [BookOpenText, NotebookPen, HeartHandshake, Target];
                const Icon = icons[index] || BookOpenText;
                return (
                  <article
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <Icon className="h-5 w-5 text-[#1e40af]" />
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{item}</p>
                  </article>
                );
              })}
            </div>
            <Link
              href="/today"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Open today&apos;s flow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Flame className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Streaks with meaning</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {spiritualMilestones.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-medium text-emerald-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-amber-950">
              <Gift className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Daily surprise study</h2>
            </div>
            <Link
              href="/fun"
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
            >
              Open fun layer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              {surpriseStudy.reference}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{surpriseStudy.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{surpriseStudy.detail}</p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Saved dashboard snapshots</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {savedStates.length > 0 ? (
              savedStates.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.topic} • {item.reading}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                Save a dashboard snapshot to keep today&apos;s study state across devices.
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Trophy className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Daily quests</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {dailyQuests.map((quest, index) => (
                <article
                  key={quest}
                  className="rounded-2xl border border-amber-200 bg-white p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Quest {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-medium text-amber-950">{quest}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Flame className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Weekly challenge</h2>
            </div>
            <div className="mt-6 grid gap-3">
              {weeklyChallenges.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-4 text-sm font-medium text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
            <Link
              href="/gamification"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
            >
              Open gamification hub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Sparkle className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Personalization in the dashboard</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Today’s study should reflect active goals and current struggles.",
                "Mentor prompts should adapt to tone, maturity, and recent history.",
                "Prayer reminders should respond to real prayer and journey patterns.",
                "Memorization review should adjust to performance and cadence.",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-violet-200 bg-white p-5 text-sm font-medium text-violet-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Target className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Professional dashboard direction</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-blue-900">
              The dashboard becomes the app’s real home when it blends reminders,
              personalization, saved state, and actionable next steps instead of just showing stats.
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}
