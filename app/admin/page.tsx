"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminGate from "@/components/AdminGate";
import {
  BarChart3,
  CheckCircle2,
  FilePenLine,
  LayoutPanelTop,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users2,
  Workflow,
} from "lucide-react";
import {
  getChurchAdminSettings,
  getGuidedPaths,
  getPublishingFlows,
  getWorkflowRuns,
} from "@/lib/persistence";
import { publishingSystems } from "@/lib/product-expansion";

const adminBlocks = [
  {
    title: "Homepage featured studies",
    description: "Curate what appears first without touching code.",
  },
  {
    title: "Devotional publishing",
    description: "Manage featured devotionals and topic journeys centrally.",
  },
  {
    title: "Leader content staging",
    description: "Prepare room prompts, export packs, and church resources.",
  },
];

type AdminAnalytics = {
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

type PublishingFlow = {
  id: string;
  title: string;
  audience: string;
  status: string;
  destination: string;
  summary: string;
};

type GuidedPath = {
  id: string;
  title: string;
  status: string;
  current_week: string | null;
  current_focus: string | null;
  summary: string;
};

type WorkflowRun = {
  id: string;
  workflow_name: string;
  stage: string;
  status: string;
  linked_reference: string | null;
  next_step: string | null;
  summary: string;
};

type ChurchAdminSettings = {
  ministry_name: string | null;
  role_scope: string | null;
  approvals_enabled: boolean | null;
  room_oversight_enabled: boolean | null;
  publishing_queue_enabled: boolean | null;
} | null;

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [publishingFlows, setPublishingFlows] = useState<PublishingFlow[]>([]);
  const [guidedPaths, setGuidedPaths] = useState<GuidedPath[]>([]);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [churchSettings, setChurchSettings] = useState<ChurchAdminSettings>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsResponse, flows, paths, workflows, churchAdmin] = await Promise.all([
          fetch("/api/admin-analytics"),
          getPublishingFlows(),
          getGuidedPaths(),
          getWorkflowRuns(),
          getChurchAdminSettings(),
        ]);

        if (analyticsResponse.ok) {
          setAnalytics((await analyticsResponse.json()) as AdminAnalytics);
        }

        setPublishingFlows(flows as PublishingFlow[]);
        setGuidedPaths(paths as GuidedPath[]);
        setWorkflowRuns(workflows as WorkflowRun[]);
        setChurchSettings((churchAdmin as ChurchAdminSettings) ?? null);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const draftFlowCount = useMemo(
    () => publishingFlows.filter((flow) => flow.status === "draft").length,
    [publishingFlows],
  );

  const activeWorkflowCount = useMemo(
    () => workflowRuns.filter((run) => run.status === "active").length,
    [workflowRuns],
  );

  const activePathCount = useMemo(
    () => guidedPaths.filter((path) => path.status !== "completed").length,
    [guidedPaths],
  );

  const operationalCards = [
    {
      label: "Draft flows",
      value: String(draftFlowCount),
      detail: "Publishing items still in draft",
    },
    {
      label: "Active paths",
      value: String(activePathCount),
      detail: "Guided discipleship tracks in progress",
    },
    {
      label: "Open workflows",
      value: String(activeWorkflowCount),
      detail: "Operational items waiting on next steps",
    },
    {
      label: "Ministry scope",
      value: churchSettings?.role_scope || "Not set",
      detail: churchSettings?.ministry_name || "Church admin settings not saved yet",
    },
  ];

  if (loading) {
    return (
      <AdminGate>
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="flex flex-col items-center gap-4 text-gray-600">
            <Loader2 className="h-10 w-10 animate-spin text-[#14532d]" />
            <p>Loading admin control dashboard...</p>
          </div>
        </div>
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        <section className="bg-gradient-to-br from-[#14532d] to-[#0f172a] py-20 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" />
                Live admin control layer
              </div>
              <h1 className="text-5xl font-bold md:text-6xl">Admin CMS</h1>
              <p className="mt-6 text-lg leading-8 text-emerald-50">
                This surface now combines your publishing, guided-path, workflow, and ministry
                settings into a real control dashboard instead of only a concept page.
              </p>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-6xl px-6 py-14">
          <section className="grid gap-6 md:grid-cols-4">
            {operationalCards.map((card) => (
              <article
                key={card.label}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                <p className="mt-3 text-4xl font-bold text-[#0f172a]">{card.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.detail}</p>
              </article>
            ))}
          </section>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {adminBlocks.map((block, index) => (
              <article
                key={block.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                {index === 0 && <LayoutPanelTop className="h-6 w-6 text-blue-700" />}
                {index === 1 && <Sparkles className="h-6 w-6 text-violet-700" />}
                {index === 2 && <FilePenLine className="h-6 w-6 text-emerald-700" />}
                <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">{block.title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{block.description}</p>
              </article>
            ))}
          </div>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
              <div className="flex items-center gap-3 text-blue-950">
                <BarChart3 className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Admin analytics portal</h2>
              </div>
              {analytics ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <article className="rounded-2xl border border-blue-200 bg-white p-5">
                    <p className="text-sm font-medium text-slate-600">Users</p>
                    <p className="mt-2 text-3xl font-bold text-blue-950">{analytics.users}</p>
                  </article>
                  <article className="rounded-2xl border border-blue-200 bg-white p-5">
                    <p className="text-sm font-medium text-slate-600">Weekly studies</p>
                    <p className="mt-2 text-3xl font-bold text-blue-950">{analytics.weeklyStudies}</p>
                  </article>
                  <article className="rounded-2xl border border-blue-200 bg-white p-5">
                    <p className="text-sm font-medium text-slate-600">Active learners</p>
                    <p className="mt-2 text-3xl font-bold text-blue-950">{analytics.weeklyActiveLearners}</p>
                  </article>
                  <article className="rounded-2xl border border-blue-200 bg-white p-5">
                    <p className="text-sm font-medium text-slate-600">Guided paths</p>
                    <p className="mt-2 text-3xl font-bold text-blue-950">{analytics.guidedPaths}</p>
                  </article>
                  <article className="rounded-2xl border border-blue-200 bg-white p-5">
                    <p className="text-sm font-medium text-slate-600">Answered prayers</p>
                    <p className="mt-2 text-3xl font-bold text-blue-950">{analytics.answeredPrayers}</p>
                  </article>
                  <article className="rounded-2xl border border-blue-200 bg-white p-5">
                    <p className="text-sm font-medium text-slate-600">Activity events</p>
                    <p className="mt-2 text-3xl font-bold text-blue-950">{analytics.activityCount}</p>
                  </article>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-blue-200 bg-white p-5 text-sm text-blue-950">
                  Admin analytics are unavailable. Check admin role access and Supabase admin env vars.
                </div>
              )}
            </div>

            <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <ShieldCheck className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Operational connection</h2>
              </div>
              <div className="mt-6 space-y-4 text-sm leading-7 text-emerald-900">
                <p>
                  • Ministry name: {churchSettings?.ministry_name || "Not configured"}
                </p>
                <p>
                  • Approvals: {churchSettings?.approvals_enabled ? "Enabled" : "Not enabled"}
                </p>
                <p>
                  • Room oversight: {churchSettings?.room_oversight_enabled ? "Enabled" : "Not enabled"}
                </p>
                <p>
                  • Publishing queue: {churchSettings?.publishing_queue_enabled ? "Enabled" : "Not enabled"}
                </p>
              </div>
              <Link
                href="/church-admin"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-950 transition hover:text-emerald-800"
              >
                Open church admin
                <Sparkles className="h-4 w-4" />
              </Link>
            </aside>
          </section>

          <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <FilePenLine className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Publishing systems now mapped out</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {publishingSystems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-emerald-200 bg-white p-5"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-emerald-950">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <Workflow className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Recent workflow operations</h2>
              </div>
              <div className="mt-6 grid gap-4">
                {workflowRuns.slice(0, 5).map((run) => (
                  <article
                    key={run.id}
                    className="rounded-2xl border border-amber-200 bg-white p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      {run.workflow_name} • {run.stage} • {run.status}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {run.linked_reference || "Workflow item"}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{run.summary}</p>
                    <p className="mt-3 text-sm font-medium text-amber-950">
                      {run.next_step || "No next step saved"}
                    </p>
                  </article>
                ))}
                {workflowRuns.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-5 text-sm text-amber-950">
                    No workflow runs have been recorded yet.
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-slate-900">
                <CheckCircle2 className="h-6 w-6 text-[#14532d]" />
                <h2 className="text-2xl font-semibold">Control queues</h2>
              </div>
              <div className="mt-6 space-y-4">
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-600">Publishing queue</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {publishingFlows.length} saved flows
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {draftFlowCount} drafts still need review or publishing.
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-600">Guided paths</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {guidedPaths.length} saved paths
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {guidedPaths.slice(0, 1)[0]?.current_focus || "No current path focus yet."}
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-600">Top activity</p>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {analytics?.topActivity?.length ? (
                      analytics.topActivity.map((item) => (
                        <p key={item.eventType}>
                          {item.eventType}: {item.count}
                        </p>
                      ))
                    ) : (
                      <p>No recent activity summary available.</p>
                    )}
                  </div>
                </article>
              </div>
            </aside>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <Users2 className="h-6 w-6 text-[#1e40af]" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">User management</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Search users, view role distribution, inspect adoption, and support church or team onboarding.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <ShieldAlert className="h-6 w-6 text-amber-700" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Moderation</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Review reported content, room activity, shared-study comments, and trust signals from one place.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <FilePenLine className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Publishing</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Curate church-ready studies, publish devotional campaigns, and stage leader resources for teams.
              </p>
            </article>
          </section>
        </main>
      </div>
    </AdminGate>
  );
}
