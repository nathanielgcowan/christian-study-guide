"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Activity,
  ArrowRight,
  BellRing,
  BrainCircuit,
  CheckCircle2,
  RefreshCcw,
  Route,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getWorkflowRuns, saveWorkflowRun, updateWorkflowRun } from "@/lib/persistence";

const WORKFLOW_RUNS_KEY = "christian-study-guide:workflow-runs";

const workflows = [
  {
    title: "Study -> Reflect -> Pray -> Save",
    description:
      "Open a passage, generate reflection, create a prayer response, and save the outcome as one coherent session.",
  },
  {
    title: "Mentor -> Action step -> Follow-up",
    description:
      "Let mentor guidance generate a next step, reminder, and check-in instead of stopping at a single response.",
  },
  {
    title: "Leader prep -> Export -> Group room",
    description:
      "Convert sermon and study-builder output into printable resources and a live collaborative room.",
  },
];

const loopMetrics = [
  "Retention by week and month",
  "Streak recovery and drop-off patterns",
  "Prayer follow-through and answered updates",
  "Reading-plan completion funnels",
];

interface WorkflowRun {
  id: string;
  workflowName: string;
  linkedReference: string;
  stage: string;
  status: string;
  summary: string;
  nextStep: string;
}

export default function OrchestrationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [draft, setDraft] = useState({
    workflowName: "Study -> Reflect -> Pray -> Save",
    linkedReference: "James 1:2-4",
    stage: "planned",
    status: "active",
    summary: "",
    nextStep: "",
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
          const data = await getWorkflowRuns();
          setWorkflowRuns(
            (data as Array<{
              id: string;
              workflow_name: string;
              linked_reference: string | null;
              stage: string;
              status: string;
              summary: string;
              next_step: string | null;
            }>).map((item) => ({
              id: item.id,
              workflowName: item.workflow_name,
              linkedReference: item.linked_reference || "",
              stage: item.stage,
              status: item.status,
              summary: item.summary,
              nextStep: item.next_step || "",
            })),
          );
        } else {
          const raw = localStorage.getItem(WORKFLOW_RUNS_KEY);
          if (raw) {
            setWorkflowRuns(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.summary.trim()) return;

    if (user) {
      const saved = await saveWorkflowRun({
        workflow_name: draft.workflowName,
        linked_reference: draft.linkedReference,
        stage: draft.stage,
        status: draft.status,
        summary: draft.summary,
        next_step: draft.nextStep,
        output: {
          source: "orchestration-page",
        },
      });

      setWorkflowRuns((current) => [
        {
          id: saved.id,
          workflowName: saved.workflow_name,
          linkedReference: saved.linked_reference || "",
          stage: saved.stage,
          status: saved.status,
          summary: saved.summary,
          nextStep: saved.next_step || "",
        },
        ...current,
      ]);
    } else {
      const nextRuns = [
        {
          id: `${Date.now()}`,
          workflowName: draft.workflowName,
          linkedReference: draft.linkedReference,
          stage: draft.stage,
          status: draft.status,
          summary: draft.summary,
          nextStep: draft.nextStep,
        },
        ...workflowRuns,
      ];
      setWorkflowRuns(nextRuns);
      localStorage.setItem(WORKFLOW_RUNS_KEY, JSON.stringify(nextRuns));
    }

    setDraft((current) => ({
      ...current,
      summary: "",
      nextStep: "",
    }));
    setSavedMessage("Workflow run saved.");
    window.setTimeout(() => setSavedMessage(""), 2400);
  };

  const handleComplete = async (id: string) => {
    if (user) {
      await updateWorkflowRun({
        id,
        stage: "completed",
        status: "completed",
      });
    }

    const nextRuns = workflowRuns.map((run) =>
      run.id === id
        ? { ...run, stage: "completed", status: "completed" }
        : run,
    );
    setWorkflowRuns(nextRuns);

    if (!user) {
      localStorage.setItem(WORKFLOW_RUNS_KEY, JSON.stringify(nextRuns));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading workflows...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] via-[#0f172a] to-[#1e3a8a] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Route className="h-4 w-4" />
              AI orchestration
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Turn isolated tools into guided discipleship workflows.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              This layer coordinates passage study, mentor help, prayer, planning,
              reminders, and follow-up so the product behaves like a system.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Route className="h-6 w-6 text-[#14532d]" />
            <h2 className="text-2xl font-semibold">Save workflow runs</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep orchestration records for passage workflows, leader-prep chains,
            and follow-through loops.
          </p>
          <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
            <select
              value={draft.workflowName}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  workflowName: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              {workflows.map((workflow) => (
                <option key={workflow.title} value={workflow.title}>
                  {workflow.title}
                </option>
              ))}
            </select>
            <input
              value={draft.linkedReference}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  linkedReference: event.target.value,
                }))
              }
              placeholder="Linked reference"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <textarea
              value={draft.summary}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  summary: event.target.value,
                }))
              }
              placeholder="Workflow summary"
              rows={3}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af] md:col-span-2"
            />
            <input
              value={draft.nextStep}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  nextStep: event.target.value,
                }))
              }
              placeholder="Next step"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <select
              value={draft.stage}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  stage: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="md:col-span-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Save workflow run
              </button>
              {savedMessage ? (
                <p className="text-sm font-medium text-emerald-700">{savedMessage}</p>
              ) : null}
            </div>
          </form>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {workflows.map((workflow) => (
            <article
              key={workflow.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <BrainCircuit className="h-6 w-6 text-[#14532d]" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {workflow.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{workflow.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Activity className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Growth loops</h2>
            </div>
            <p className="mt-4 leading-7 text-blue-900">
              Once workflows exist, analytics become more meaningful. The app can
              tell whether insight is leading to action, prayer, completion, and return usage.
            </p>
            <div className="mt-6 space-y-4">
              {loopMetrics.map((metric) => (
                <article
                  key={metric}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
                >
                  {metric}
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <RefreshCcw className="h-6 w-6 text-emerald-950" />
              <h2 className="mt-4 text-2xl font-semibold text-emerald-950">
                Follow-through engine
              </h2>
              <p className="mt-4 leading-7 text-emerald-900">
                Reminders, saved sessions, timeline events, and prayer updates all
                become part of the same follow-through engine instead of separate pages.
              </p>
            </article>

            <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <BellRing className="h-6 w-6 text-amber-950" />
              <h2 className="mt-4 text-2xl font-semibold text-amber-950">
                Connected next steps
              </h2>
              <p className="mt-4 leading-7 text-amber-900">
                Notifications make more sense when they come from a workflow:
                unfinished plan, mentor follow-up, room prep, or a prayer update.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/notifications"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
                >
                  Open notifications
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/study"
                  className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
                >
                  Open study hub
                  <CheckCircle2 className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <CheckCircle2 className="h-6 w-6 text-emerald-700" />
            <h2 className="text-2xl font-semibold">Saved workflow runs</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {workflowRuns.length > 0 ? (
              workflowRuns.map((run) => (
                <article
                  key={run.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{run.workflowName}</p>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                      {run.stage}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{run.summary}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {run.linkedReference || "No linked reference"}
                  </p>
                  {run.nextStep ? (
                    <p className="mt-2 text-sm text-slate-600">Next: {run.nextStep}</p>
                  ) : null}
                  {run.status !== "completed" ? (
                    <button
                      type="button"
                      onClick={() => handleComplete(run.id)}
                      className="mt-4 rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                    >
                      Mark completed
                    </button>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Save a workflow run above to start building an orchestration trail.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
