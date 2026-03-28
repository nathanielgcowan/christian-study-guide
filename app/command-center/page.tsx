"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Compass,
  Eye,
  Layers3,
  Settings2,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getCommandCenterPreferences,
  saveCommandCenterPreferences,
} from "@/lib/persistence";

interface StudyStatsResponse {
  streak?: {
    current_streak: number;
    best_streak: number;
    total_studies: number;
  };
}

interface GenericCountItem {
  id: string;
}

interface ActivityItem {
  id: string;
  event_type: string;
  reference: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const demoMetrics = {
  totalStudies: 18,
  savedSessions: 7,
  mentorMoments: 12,
  prayerEntries: 9,
  workspaceResources: 4,
  searchHistory: 6,
  activity: [] as ActivityItem[],
};

const COMMAND_CENTER_PREFS_KEY = "christian-study-guide:command-center-prefs";

interface CommandCenterPreferences {
  visibleWidgets: {
    metrics: boolean;
    recommendations: boolean;
    systemHealth: boolean;
    orchestration: boolean;
    activity: boolean;
  };
  focusGoal: "consistency" | "depth" | "leadership" | "discipleship";
  recommendationWeights: {
    studies: number;
    prayer: number;
    workspace: number;
    mentor: number;
  };
}

const defaultPreferences: CommandCenterPreferences = {
  visibleWidgets: {
    metrics: true,
    recommendations: true,
    systemHealth: true,
    orchestration: true,
    activity: true,
  },
  focusGoal: "consistency",
  recommendationWeights: {
    studies: 1,
    prayer: 1,
    workspace: 1,
    mentor: 1,
  },
};

export default function CommandCenterPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(demoMetrics);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          try {
            const prefs = await getCommandCenterPreferences();
            if (prefs) {
              setPreferences({
                ...defaultPreferences,
                visibleWidgets: {
                  ...defaultPreferences.visibleWidgets,
                  ...(prefs.visible_widgets || {}),
                },
                focusGoal: prefs.focus_goal || defaultPreferences.focusGoal,
                recommendationWeights: {
                  ...defaultPreferences.recommendationWeights,
                  ...(prefs.recommendation_weights || {}),
                },
              });
            }
          } catch {}
        } else {
          try {
            const raw = localStorage.getItem(COMMAND_CENTER_PREFS_KEY);
            if (raw) {
              setPreferences({
                ...defaultPreferences,
                ...JSON.parse(raw),
              });
            }
          } catch {}
        }

        setPreferencesLoaded(true);

        if (!session) {
          return;
        }

        const [
          studiesRes,
          sessionsRes,
          mentorRes,
          prayerRes,
          workspaceRes,
          searchRes,
          activityRes,
        ] = await Promise.all([
          fetch("/api/studies"),
          fetch("/api/study-sessions"),
          fetch("/api/mentor-history"),
          fetch("/api/prayer-journal"),
          fetch("/api/workspace-resources"),
          fetch("/api/search-history"),
          fetch("/api/activity"),
        ]);

        const studiesData = studiesRes.ok
          ? ((await studiesRes.json()) as StudyStatsResponse)
          : {};
        const sessionsData = sessionsRes.ok
          ? ((await sessionsRes.json()) as GenericCountItem[])
          : [];
        const mentorData = mentorRes.ok
          ? ((await mentorRes.json()) as GenericCountItem[])
          : [];
        const prayerData = prayerRes.ok
          ? ((await prayerRes.json()) as GenericCountItem[])
          : [];
        const workspaceData = workspaceRes.ok
          ? ((await workspaceRes.json()) as GenericCountItem[])
          : [];
        const searchData = searchRes.ok
          ? ((await searchRes.json()) as GenericCountItem[])
          : [];
        const activityData = activityRes.ok
          ? ((await activityRes.json()) as ActivityItem[])
          : [];

        setMetrics({
          totalStudies: studiesData.streak?.total_studies || 0,
          savedSessions: sessionsData.length,
          mentorMoments: mentorData.length,
          prayerEntries: prayerData.length,
          workspaceResources: workspaceData.length,
          searchHistory: searchData.length,
          activity: activityData,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  useEffect(() => {
    if (!preferencesLoaded) return;

    if (user) {
      const persist = async () => {
        try {
          await saveCommandCenterPreferences({
            visible_widgets: preferences.visibleWidgets,
            focus_goal: preferences.focusGoal,
            recommendation_weights: preferences.recommendationWeights,
          });
        } catch {}
      };

      persist();
      return;
    }

    try {
      localStorage.setItem(
        COMMAND_CENTER_PREFS_KEY,
        JSON.stringify(preferences)
      );
    } catch {}
  }, [preferences, preferencesLoaded, user]);

  const recommendations = useMemo(() => {
    const items: Array<{
      title: string;
      description: string;
      href: string;
      weight: number;
    }> = [];

    if (metrics.totalStudies < 5) {
      items.push({
        title: "Build a stronger study rhythm",
        description:
          "Start one structured plan and save your first serious study session.",
        href: "/reading-plans",
        weight: preferences.recommendationWeights.studies,
      });
    }

    if (metrics.prayerEntries < 3) {
      items.push({
        title: "Strengthen the prayer layer",
        description:
          "Add prayer entries so your discipleship system tracks answered requests too.",
        href: "/prayer",
        weight: preferences.recommendationWeights.prayer,
      });
    }

    if (metrics.workspaceResources < 2) {
      items.push({
        title: "Open the leader workflow",
        description:
          "Create a workspace resource so sermon prep and small-group planning can compound.",
        href: "/workspace",
        weight: preferences.recommendationWeights.workspace,
      });
    }

    if (metrics.mentorMoments < 3) {
      items.push({
        title: "Use the mentor more intentionally",
        description:
          "Ask a focused discipleship question and save the result into your study trail.",
        href: "/passage/james-1-2-4",
        weight: preferences.recommendationWeights.mentor,
      });
    }

    if (preferences.focusGoal === "depth") {
      items.push({
        title: "Prioritize verse-by-verse depth",
        description:
          "Open a passage and use commentary compare plus breakdown mode for slower interpretation.",
        href: "/passage/romans-8",
        weight: 3,
      });
    }

    if (preferences.focusGoal === "leadership") {
      items.push({
        title: "Expand the team layer",
        description:
          "Use workspace collaborators and saved study resources to make this a real leader system.",
        href: "/workspace",
        weight: 4,
      });
    }

    if (preferences.focusGoal === "discipleship") {
      items.push({
        title: "Push follow-through harder",
        description:
          "Use prayer entries, mentor follow-up, and saved sessions to turn insight into habit.",
        href: "/study",
        weight: 3,
      });
    }

    return items.sort((left, right) => right.weight - left.weight).slice(0, 4);
  }, [metrics, preferences]);

  const systemHealth = useMemo(
    () => [
      {
        label: "Study engine",
        score: Math.min(100, metrics.totalStudies * 8),
      },
      {
        label: "Prayer engine",
        score: Math.min(100, metrics.prayerEntries * 18),
      },
      {
        label: "Leader engine",
        score: Math.min(100, metrics.workspaceResources * 25),
      },
      {
        label: "Discovery engine",
        score: Math.min(100, metrics.searchHistory * 16),
      },
    ],
    [metrics]
  );

  const strategicFocus = useMemo(() => {
    switch (preferences.focusGoal) {
      case "depth":
        return "Interpret passages more slowly, compare viewpoints, and prioritize richer exegesis.";
      case "leadership":
        return "Treat the product like a ministry operating layer with reusable resources and collaboration.";
      case "discipleship":
        return "Push everything toward prayer, obedience, follow-up, and everyday formation.";
      default:
        return "Build sustainable study rhythms that people can actually keep week after week.";
    }
  }, [preferences.focusGoal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading command center...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Radar className="h-4 w-4" />
              Advanced command center
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              One place to see the whole spiritual system.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              A high-signal dashboard for recommendations, operating metrics,
              study intelligence, and the product layers you have already built.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <Settings2 className="h-6 w-6 text-slate-700" />
              <h2 className="text-2xl font-semibold">Control panel</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Tune what the command center emphasizes and which widgets stay visible.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-700">Strategic focus</p>
                <select
                  value={preferences.focusGoal}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      focusGoal: event.target.value as CommandCenterPreferences["focusGoal"],
                    }))
                  }
                  className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1e40af]"
                >
                  <option value="consistency">Consistency</option>
                  <option value="depth">Depth</option>
                  <option value="leadership">Leadership</option>
                  <option value="discipleship">Discipleship</option>
                </select>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {strategicFocus}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Visible widgets</p>
                <div className="mt-3 grid gap-3">
                  {(
                    Object.keys(preferences.visibleWidgets) as Array<
                      keyof CommandCenterPreferences["visibleWidgets"]
                    >
                  ).map((key) => (
                    <label
                      key={key}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <input
                        type="checkbox"
                        checked={preferences.visibleWidgets[key]}
                        onChange={(event) =>
                          setPreferences((current) => ({
                            ...current,
                            visibleWidgets: {
                              ...current.visibleWidgets,
                              [key]: event.target.checked,
                            },
                          }))
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Eye className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Recommendation weights</h2>
            </div>
            <div className="mt-6 space-y-5">
              {(
                Object.keys(preferences.recommendationWeights) as Array<
                  keyof CommandCenterPreferences["recommendationWeights"]
                >
              ).map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium capitalize text-violet-900">
                      {key}
                    </p>
                    <p className="text-sm font-semibold text-violet-950">
                      {preferences.recommendationWeights[key]}x
                    </p>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={preferences.recommendationWeights[key]}
                    onChange={(event) =>
                      setPreferences((current) => ({
                        ...current,
                        recommendationWeights: {
                          ...current.recommendationWeights,
                          [key]: Number(event.target.value),
                        },
                      }))
                    }
                    className="mt-2 w-full"
                  />
                </div>
              ))}
            </div>
          </aside>
        </section>

        {preferences.visibleWidgets.metrics && (
        <section className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {[
            ["Studies", metrics.totalStudies],
            ["Sessions", metrics.savedSessions],
            ["Mentor", metrics.mentorMoments],
            ["Prayer", metrics.prayerEntries],
            ["Workspace", metrics.workspaceResources],
            ["Searches", metrics.searchHistory],
          ].map(([label, value]) => (
            <article
              key={label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-600">{label}</p>
              <p className="mt-3 text-4xl font-bold text-[#0f172a]">{value}</p>
            </article>
          ))}
        </section>
        )}

        {(preferences.visibleWidgets.recommendations ||
          preferences.visibleWidgets.systemHealth) && (
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {preferences.visibleWidgets.recommendations && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <BrainCircuit className="h-6 w-6 text-violet-700" />
              <h2 className="text-2xl font-semibold">Recommendation engine</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {recommendations.length > 0 ? (
                recommendations.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="rounded-3xl border border-violet-200 bg-violet-50 p-6 transition hover:bg-violet-100"
                  >
                    <h3 className="text-xl font-semibold text-violet-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-violet-900">
                      {item.description}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                  <p className="text-sm leading-6 text-emerald-950">
                    Your current system already has meaningful depth. The next
                    gain is refinement, not just feature count.
                  </p>
                </div>
              )}
            </div>
          </div>
          )}

          {preferences.visibleWidgets.systemHealth && (
          <aside className="rounded-3xl border border-[#d4af37]/20 bg-[#fffaf0] p-8">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-semibold">System health</h2>
            </div>
            <div className="mt-6 space-y-5">
              {systemHealth.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-700">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-[#1e40af]">
                      {item.score}%
                    </p>
                  </div>
                  <div className="mt-2 h-3 w-full rounded-full bg-slate-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-[#1e40af] to-emerald-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </aside>
          )}
        </section>
        )}

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Collaboration system",
              description:
                "Rooms, shared prep, invites, and moderation for ministry teams.",
              href: "/collaboration",
            },
            {
              title: "Personalization system",
              description:
                "Tie recommendations to goals, habits, tradition, and discipleship history.",
              href: "/personalization",
            },
            {
              title: "AI workflow system",
              description:
                "Coordinate study, mentor, prayer, notifications, and follow-up loops.",
              href: "/orchestration",
            },
            {
              title: "Bible intelligence system",
              description:
                "Deepen cross-reference mapping, theme clustering, and mobile study behavior.",
              href: "/intelligence",
            },
            {
              title: "Passage dashboard system",
              description:
                "Keep the full study workspace around one passage instead of scattering outputs.",
              href: "/passage-dashboard",
            },
            {
              title: "Publishing system",
              description:
                "Move leader resources from draft to review, publish, and clean sharing.",
              href: "/publishing",
            },
            {
              title: "Mentor chat system",
              description:
                "Upgrade from isolated answers to a real, passage-aware discipleship thread.",
              href: "/mentor-chat",
            },
            {
              title: "Trust operations",
              description:
                "Moderation, audit trails, testing, and observability for the whole platform.",
              href: "/trust",
            },
            {
              title: "Admin analytics",
              description:
                "Retention, funnel health, content performance, and operational visibility for admins.",
              href: "/admin-analytics",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-[#1e40af]">
                Advanced layer
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af]">
                Open system
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Discipleship journeys",
              description:
                "Launch multi-day spiritual tracks with follow-up and mentor checkpoints.",
              href: "/journeys",
            },
            {
              title: "Church admin",
              description:
                "Open the ministry-level operating layer for approvals, oversight, and teams.",
              href: "/church-admin",
            },
            {
              title: "Advanced plan generation",
              description:
                "Build reading plans around topic, life season, and ministry use case.",
              href: "/plan-builder",
            },
            {
              title: "Follow-up automation",
              description:
                "Coordinate reminders from journeys, workflows, mentor sessions, and plans.",
              href: "/notifications",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-[#14532d]">
                Premium layer
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#14532d]">
                Open layer
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </section>

        {preferences.visibleWidgets.orchestration && (
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <Link
            href="/study"
            className="rounded-3xl border border-blue-200 bg-blue-50 p-8 transition hover:bg-blue-100"
          >
            <Compass className="h-6 w-6 text-blue-800" />
            <h2 className="mt-4 text-2xl font-semibold text-blue-950">
              Study intelligence
            </h2>
            <p className="mt-3 text-sm leading-6 text-blue-900">
              Timeline, sessions, mentor history, reminders, and follow-up all in
              one operational surface.
            </p>
          </Link>
          <Link
            href="/workspace"
            className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 transition hover:bg-emerald-100"
          >
            <Layers3 className="h-6 w-6 text-emerald-800" />
            <h2 className="mt-4 text-2xl font-semibold text-emerald-950">
              Leader orchestration
            </h2>
            <p className="mt-3 text-sm leading-6 text-emerald-900">
              Resources, collaborators, team planning, and ministry prep now sit
              in one connected layer.
            </p>
          </Link>
          <Link
            href="/search"
            className="rounded-3xl border border-violet-200 bg-violet-50 p-8 transition hover:bg-violet-100"
          >
            <Target className="h-6 w-6 text-violet-800" />
            <h2 className="mt-4 text-2xl font-semibold text-violet-950">
              Discovery engine
            </h2>
            <p className="mt-3 text-sm leading-6 text-violet-900">
              Search history, topical intent, and life-situation discovery make
              the front door smarter.
            </p>
          </Link>
        </section>
        )}

        {preferences.visibleWidgets.activity && (
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Activity className="h-6 w-6 text-amber-700" />
            <h2 className="text-2xl font-semibold">Recent system activity</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {(metrics.activity.length > 0 ? metrics.activity : demoMetrics.activity).length >
            0 ? (
              (metrics.activity.length > 0 ? metrics.activity : demoMetrics.activity)
                .slice(0, 8)
                .map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {item.event_type.replace(/_/g, " ")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {item.reference || "System event"}
                    </p>
                  </article>
                ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Activity will appear here as you study, pray, search, and save.
              </p>
            )}
          </div>
        </section>
        )}

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <Sparkles className="h-6 w-6 text-amber-700" />
              <h2 className="text-2xl font-semibold">Advanced path</h2>
            </div>
            <Link
              href={user ? "/account" : "/auth/signup"}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
            >
              Open account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            This command center turns the site from a set of pages into a
            coordinated spiritual operating system. It makes the product feel
            significantly more mature without sacrificing clarity.
          </p>
        </section>
      </main>
    </div>
  );
}
