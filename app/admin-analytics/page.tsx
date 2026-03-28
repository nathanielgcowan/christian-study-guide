"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminGate from "@/components/AdminGate";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookMarked,
  Clock3,
  Eye,
  Gauge,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";

const opsSignals = [
  {
    title: "Acquisition to first-study conversion",
    detail: "Use real study, note, and mentor activity to see whether onboarding is becoming actual Bible engagement.",
    icon: LineChart,
  },
  {
    title: "Feature adoption by cohort",
    detail: "Compare prayer, mentor, guided paths, notes, and memorization behavior as the account grows.",
    icon: Users,
  },
  {
    title: "Platform health and trust",
    detail: "Watch quality reports, operational load, and content usage in one admin surface.",
    icon: ShieldCheck,
  },
];

type StudyStatsResponse = {
  users: number;
  totalStudies: number;
  weeklyStudies: number;
  weeklyActiveLearners: number;
  guidedPaths: number;
  completedPaths: number;
  mentorSessions: number;
  prayerEntries: number;
  answeredPrayers: number;
  notes: number;
  qualityReports: number;
  activityCount: number;
  topActivity: Array<{ eventType: string; count: number }>;
};

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    users: 0,
    totalStudies: 0,
    weeklyStudies: 0,
    weeklyActiveLearners: 0,
    guidedPaths: 0,
    completedPaths: 0,
    mentorSessions: 0,
    prayerEntries: 0,
    answeredPrayers: 0,
    notes: 0,
    qualityReports: 0,
    activityCount: 0,
  });
  const [topActivity, setTopActivity] = useState<Array<{ eventType: string; count: number }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/admin-analytics");
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = (await response.json()) as StudyStatsResponse;
        setMetrics({
          users: data.users || 0,
          totalStudies: data.totalStudies || 0,
          weeklyStudies: data.weeklyStudies || 0,
          weeklyActiveLearners: data.weeklyActiveLearners || 0,
          guidedPaths: data.guidedPaths || 0,
          completedPaths: data.completedPaths || 0,
          mentorSessions: data.mentorSessions || 0,
          prayerEntries: data.prayerEntries || 0,
          answeredPrayers: data.answeredPrayers || 0,
          notes: data.notes || 0,
          qualityReports: data.qualityReports || 0,
          activityCount: data.activityCount || 0,
        });
        setTopActivity(data.topActivity || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const topMetrics = useMemo(
    () => [
      {
        label: "Weekly active learners",
        value: `${metrics.weeklyActiveLearners}`,
        change: `${metrics.users} total users`,
      },
      {
        label: "Total studies logged",
        value: `${metrics.totalStudies}`,
        change: `${metrics.weeklyStudies} this week`,
      },
      {
        label: "Guided paths",
        value: `${metrics.guidedPaths}`,
        change: `${metrics.guidedPaths} guided paths`,
      },
      {
        label: "Mentor sessions",
        value: `${metrics.mentorSessions}`,
        change: `${metrics.notes} notes saved`,
      },
      {
        label: "Prayer entries",
        value: `${metrics.prayerEntries}`,
        change: `${metrics.answeredPrayers} answered`,
      },
    ],
    [metrics],
  );

  const funnelSteps = useMemo(
    () => [
      {
        stage: "Platform users",
        value: `${metrics.users}`,
        note: "Users with profiles in the app who can move into deeper study behavior.",
      },
      {
        stage: "Studies started",
        value: `${metrics.totalStudies}`,
        note: "Cross-user study sessions logged across the platform.",
      },
      {
        stage: "Guided paths completed",
        value: `${metrics.completedPaths}`,
        note: "A stronger sign that users are moving through structured learning, not just visiting once.",
      },
      {
        stage: "Mentor and prayer follow-through",
        value: `${metrics.mentorSessions + metrics.answeredPrayers}`,
        note: "Combines AI guidance usage with real prayer follow-through as a practical discipleship signal.",
      },
    ],
    [metrics],
  );

  const contentPerformance = useMemo(() => {
    if (topActivity.length === 0) {
      return [
        "No platform-wide activity has been captured yet. As users interact with the app, the strongest flows will surface here.",
        "Once activity is present, this section will highlight what content and workflows are actually getting reused.",
      ];
    }

    return topActivity.map(
      (item) => `${item.eventType.replaceAll("_", " ")}: ${item.count} recent events`,
    );
  }, [topActivity]);

  const opsWatchlist = useMemo(
    () => [
      `Quality reports logged: ${metrics.qualityReports}`,
      `Recent activity events captured: ${metrics.activityCount}`,
      `Completed guided paths: ${metrics.completedPaths}`,
      metrics.weeklyStudies === 0
        ? "No studies logged in the last 7 days"
        : `${metrics.weeklyStudies} studies logged in the last 7 days`,
    ],
    [metrics],
  );

  const recommendationMetrics = useMemo(
    () => [
      "Track which next-step cards users actually open from the dashboard",
      "Compare recommendation acceptance by new believers, returning readers, and leaders",
      "Measure whether whole-Bible progress increases daily return behavior",
      "Watch voice, AI, and collaboration adoption as stronger retention loops",
    ],
    [],
  );

  if (loading) {
    return (
      <AdminGate>
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="text-gray-600">Loading admin analytics...</div>
        </div>
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        <section className="bg-gradient-to-br from-[#0f172a] via-[#14532d] to-[#1e40af] py-20 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                <BarChart3 className="h-4 w-4" />
                Admin analytics portal
              </div>
              <h1 className="text-5xl font-bold md:text-6xl">
                Give admins a real operating view of growth, retention, content performance, and trust.
              </h1>
              <p className="mt-6 text-lg leading-8 text-emerald-50">
                This portal now reads real cross-user analytics through an admin-only backend route,
                so it reflects actual platform studies, guided paths, mentor usage, prayer activity, and quality work.
              </p>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-6xl px-6 py-14">
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {topMetrics.map((metric) => (
              <article key={metric.label} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                <p className="mt-4 text-3xl font-bold text-slate-900">{metric.value}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">{metric.change}</p>
              </article>
            ))}
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-slate-900">
                <Activity className="h-6 w-6 text-[#1e40af]" />
                <h2 className="text-2xl font-semibold">Engagement funnel</h2>
              </div>
              <div className="mt-6 space-y-4">
                {funnelSteps.map((step, index) => (
                  <div key={step.stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.stage}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{step.note}</p>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{step.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <AlertTriangle className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Signals worth watching</h2>
              </div>
              <div className="mt-6 grid gap-4">
                {opsWatchlist.map((item) => (
                  <article
                    key={item}
                    className="rounded-2xl border border-amber-200 bg-white p-5 text-sm leading-6 text-amber-950"
                  >
                    {item}
                  </article>
                ))}
              </div>
            </aside>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <BookMarked className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Content performance</h2>
              </div>
              <div className="mt-6 grid gap-4">
                {contentPerformance.map((item) => (
                  <article
                    key={item}
                    className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm leading-6 text-emerald-950"
                  >
                    {item}
                  </article>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
              <div className="flex items-center gap-3 text-blue-950">
                <Gauge className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Admin operating lenses</h2>
              </div>
              <div className="mt-6 grid gap-4">
                {opsSignals.map(({ title, detail, icon: Icon }) => (
                  <article key={title} className="rounded-2xl border border-blue-200 bg-white p-5">
                    <Icon className="h-5 w-5 text-[#1e40af]" />
                    <h3 className="mt-3 text-lg font-semibold text-blue-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-blue-900">{detail}</p>
                  </article>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
              <Clock3 className="h-6 w-6 text-violet-950" />
              <h2 className="mt-4 text-2xl font-semibold text-violet-950">Retention pulse</h2>
              <p className="mt-4 text-sm leading-7 text-violet-900">
                {metrics.weeklyActiveLearners > 0
                  ? `${metrics.weeklyActiveLearners} learners were active in the last 7 days, with ${metrics.weeklyStudies} studies logged in that same window.`
                  : "No weekly learner activity is showing yet. As usage grows, this section will make retention patterns much clearer."}
              </p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <Eye className="h-6 w-6 text-slate-900" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Visibility layer</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                This now reflects actual counts across users instead of only the current admin account.
              </p>
            </article>
            <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <LineChart className="h-6 w-6 text-emerald-950" />
              <h2 className="mt-4 text-2xl font-semibold text-emerald-950">Best next step</h2>
              <p className="mt-4 text-sm leading-7 text-emerald-900">
                The next upgrade would be true global admin analytics across all users, not just the current admin account’s activity.
              </p>
            </article>
          </section>

          <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Gauge className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">What to watch next</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {recommendationMetrics.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </section>

          <section className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Open admin CMS
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/quality"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Open quality layer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </main>
      </div>
    </AdminGate>
  );
}
