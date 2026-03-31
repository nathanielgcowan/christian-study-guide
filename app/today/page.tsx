"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  BellRing,
  BookOpenText,
  BrainCircuit,
  CheckCircle2,
  Flame,
  HeartHandshake,
  Sparkles,
  Target,
  TimerReset,
  WandSparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getGuidedPaths,
  getPrayerEntries,
  getWorkflowRuns,
} from "../../lib/persistence";

import {
  dailyEngineMoments,
  guidedPaths,
  retentionSystems,
} from "../../lib/product-expansion";

type TodayMoment = {
  title: string;
  detail: string;
  href: string;
};

type SavedGuidedPath = {
  id: string;
  title: string;
  summary: string;
  currentWeek: string;
  currentFocus: string;
  status: string;
};

type WorkflowRun = {
  id: string;
  workflow_name: string;
  linked_reference: string | null;
  stage: string;
  status: string;
  summary: string;
  next_step: string | null;
};

type PrayerEntry = {
  id: string;
  title: string;
  category: string;
  answered: boolean;
};

type ReadingPlan = {
  id: string;
  name: string;
  entries: Array<{ reference: string }>;
  userProgress?: {
    current_day: number;
    completed: boolean;
  } | null;
};

const dailyJourney = [
  "Open one passage instead of deciding where to start.",
  "Read a short explanation that stays anchored to context.",
  "Respond with one reflection and one prayer.",
  "Review one memory verse before leaving the app.",
  "Finish one challenge so growth feels concrete.",
];

const fallbackPersistenceMoments = [
  "Completed steps saved across devices",
  "Missed-day recovery instead of streak shame",
  "Daily flow reopened exactly where the user left off",
  "Reminder timing tied to unfinished steps",
];

export default function TodayPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedPaths, setSavedPaths] = useState<SavedGuidedPath[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowRun[]>([]);
  const [prayers, setPrayers] = useState<PrayerEntry[]>([]);
  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>([]);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const [pathsData, workflowData, prayerData, readingPlansResponse] =
            await Promise.all([
              getGuidedPaths(),
              getWorkflowRuns(),
              getPrayerEntries(),
              fetch("/api/reading-plans").then((response) =>
                response.ok ? response.json() : [],
              ),
            ]);

          setSavedPaths(
            (
              pathsData as Array<{
                id: string;
                title: string;
                summary: string;
                current_week: string | null;
                current_focus: string | null;
                status: string;
              }>
            ).map((item) => ({
              id: item.id,
              title: item.title,
              summary: item.summary,
              currentWeek: item.current_week || "",
              currentFocus: item.current_focus || "",
              status: item.status,
            })),
          );

          setWorkflows(
            workflowData as Array<{
              id: string;
              workflow_name: string;
              linked_reference: string | null;
              stage: string;
              status: string;
              summary: string;
              next_step: string | null;
            }>,
          );

          setPrayers(
            (
              prayerData as Array<{
                id: string;
                title: string;
                category: string;
                answered: boolean;
              }>
            ).map((item) => ({
              id: item.id,
              title: item.title,
              category: item.category,
              answered: item.answered,
            })),
          );

          setReadingPlans(readingPlansResponse as ReadingPlan[]);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const activePath = useMemo(
    () => savedPaths.find((path) => path.status !== "completed") || null,
    [savedPaths],
  );

  const activeReadingPlan = useMemo(
    () =>
      readingPlans.find(
        (plan) => plan.userProgress && !plan.userProgress.completed,
      ) || null,
    [readingPlans],
  );

  const duePrayer = useMemo(
    () => prayers.find((entry) => !entry.answered) || null,
    [prayers],
  );

  const activeWorkflow = useMemo(
    () =>
      workflows.find(
        (run) =>
          run.status === "active" &&
          (run.workflow_name === "guided-path" ||
            run.workflow_name === "publishing-flow"),
      ) || null,
    [workflows],
  );

  const personalizedTodayMoments = useMemo<TodayMoment[]>(() => {
    const readingReference =
      activeReadingPlan?.entries?.[
        Math.max((activeReadingPlan.userProgress?.current_day || 1) - 1, 0)
      ]?.reference ||
      activePath?.currentFocus ||
      "James 1:2-4";
    const readingSlug = readingReference.toLowerCase().replace(/\s+/g, "-");

    return [
      {
        title: "Read",
        detail: activeReadingPlan
          ? `Continue ${activeReadingPlan.name} with ${readingReference}.`
          : `Start with ${readingReference} and notice one thing God is shaping in you.`,
        href: `/passage/${readingSlug}`,
      },
      {
        title: "Reflect",
        detail: activePath
          ? `Respond to the current path focus: ${activePath.currentFocus || activePath.title}.`
          : "Write one honest response to what stood out in the reading.",
        href: "/study",
      },
      {
        title: "Pray",
        detail: duePrayer
          ? `Revisit "${duePrayer.title}" and tie today's prayer to ${duePrayer.category.toLowerCase()}.`
          : "Use a structured prayer prompt anchored to what you just read.",
        href: "/prayer",
      },
      {
        title: "Review",
        detail: activeWorkflow
          ? `Close one loop: ${activeWorkflow.next_step || activeWorkflow.summary}.`
          : "Practice one memory verse and close the day with one visible win.",
        href: "/memorize",
      },
    ];
  }, [activePath, activeReadingPlan, activeWorkflow, duePrayer]);

  const personalizedJourney = useMemo(() => {
    const items = [...dailyJourney];

    if (activePath) {
      items[0] = `Open ${activePath.title} and continue ${activePath.currentWeek || "your next checkpoint"}.`;
    }

    if (activeReadingPlan) {
      const nextReference =
        activeReadingPlan.entries?.[
          Math.max((activeReadingPlan.userProgress?.current_day || 1) - 1, 0)
        ]?.reference || "today's assigned reading";
      items[1] = `Read ${nextReference} with a short context note from your active plan.`;
    }

    if (duePrayer) {
      items[3] = `Revisit "${duePrayer.title}" and finish with one memory review before you leave.`;
    }

    return items;
  }, [activePath, activeReadingPlan, duePrayer]);

  const persistenceMoments = useMemo(() => {
    if (!user) return fallbackPersistenceMoments;

    return [
      activePath
        ? `Current path saved: ${activePath.title} • ${activePath.currentWeek || "Next checkpoint"}`
        : "No active path yet, so Today can recommend a starter lane",
      activeReadingPlan
        ? `Reading plan synced: ${activeReadingPlan.name}`
        : "Reading plan slot available for a new personalized plan",
      duePrayer
        ? `Open prayer request waiting: ${duePrayer.title}`
        : "Prayer layer is clear, so Today can invite a fresh gratitude prompt",
      activeWorkflow
        ? `Workflow next step remembered: ${activeWorkflow.next_step || activeWorkflow.stage}`
        : "No unfinished workflow run blocking the next session",
    ];
  }, [activePath, activeReadingPlan, activeWorkflow, duePrayer, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading today&apos;s flow...</div>
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
              Structured daily journey
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Know exactly what to do with Scripture today.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              {user
                ? "Today now reacts to your saved paths, active plans, prayer needs, and open workflows."
                : "One reading, one reflection, one prayer, one memory review, and one challenge that moves the habit loop forward without making the app feel noisy."}
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {personalizedTodayMoments.map((moment) => {
            const iconMap = {
              Read: BookOpenText,
              Reflect: BrainCircuit,
              Pray: HeartHandshake,
              Review: Target,
            };
            const Icon =
              iconMap[moment.title as keyof typeof iconMap] || BookOpenText;

            return (
              <Link
                key={moment.title}
                href={moment.href}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Icon className="h-6 w-6 text-[#1e40af]" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">
                  {moment.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {moment.detail}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Flame className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Daily flow that actually helps
              </h2>
            </div>
            <div className="mt-6 grid gap-4">
              {personalizedJourney.map((step) => (
                <article
                  key={step}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
                >
                  {step}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <BellRing className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Today&apos;s live signals
              </h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-7 text-emerald-900">
              <p>
                • Active path:{" "}
                {activePath
                  ? `${activePath.title} • ${activePath.currentWeek || "Next checkpoint"}`
                  : "None yet"}
              </p>
              <p>
                • Reading plan:{" "}
                {activeReadingPlan ? activeReadingPlan.name : "No active plan"}
              </p>
              <p>
                • Prayer follow-up:{" "}
                {duePrayer ? duePrayer.title : "No open prayer reminder"}
              </p>
              <p>
                • Workflow step:{" "}
                {activeWorkflow
                  ? activeWorkflow.next_step || activeWorkflow.summary
                  : "No unfinished workflow"}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
            >
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <WandSparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Personalized today engine
              </h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {dailyEngineMoments.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-violet-200 bg-white p-5"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-violet-950">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-950">
              <BookOpenText className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Path recommendations</h2>
            </div>
            <div className="mt-6 space-y-3">
              {(savedPaths.length > 0
                ? savedPaths.slice(0, 4)
                : guidedPaths.slice(0, 4)
              ).map((path) => (
                <article
                  key={path.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {path.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {"summary" in path ? path.summary : path.detail}
                  </p>
                </article>
              ))}
            </div>
            <Link
              href="/paths"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Explore guided paths
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <CheckCircle2 className="h-6 w-6 text-emerald-700" />
            <h2 className="text-2xl font-semibold">A better habit loop</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            Most people do not need more Bible features before breakfast. They
            need a clear starting point, a guided next step, and a small sense
            of completion. This page is the product version of that idea, and it
            now adapts when account data exists.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <TimerReset className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Persistent today flow</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {persistenceMoments.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-amber-200 bg-white p-5 text-sm font-medium text-amber-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="flex items-center gap-3 text-emerald-950">
            <BellRing className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">
              Retention and recovery loops
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {retentionSystems.map((system) => (
              <article
                key={system.title}
                className="rounded-2xl border border-emerald-200 bg-white p-5"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
                  {system.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-emerald-950">
                  {system.detail}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
