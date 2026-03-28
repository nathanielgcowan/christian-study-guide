"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  CheckCheck,
  ClipboardCheck,
  FileOutput,
  Globe2,
  Send,
  Share2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getPublishingFlows,
  getWorkflowRuns,
  savePublishingFlow,
  saveWorkflowRun,
  updatePublishingFlow,
  updateWorkflowRun,
} from "@/lib/persistence";

const PUBLISHING_FLOWS_KEY = "christian-study-guide:publishing-flows";

const publishingStages = [
  {
    title: "Draft",
    description:
      "Assemble the study from passage content, leader notes, mentor guidance, and export blocks.",
  },
  {
    title: "Review",
    description:
      "Check theology mode, readability, audience fit, and discussion flow before sharing.",
  },
  {
    title: "Publish",
    description:
      "Send the study to a public page, a team workspace, or a specific room with a clean share link.",
  },
];

interface PublishingFlow {
  id: string;
  title: string;
  audience: string;
  contentType: string;
  status: string;
  destination: string;
  summary: string;
  shareScope: string;
}

interface WorkflowRun {
  id: string;
  workflowName: string;
  linkedReference: string;
  stage: string;
  status: string;
  summary: string;
  nextStep: string;
  output: Record<string, unknown> | null;
}

export default function PublishingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [flows, setFlows] = useState<PublishingFlow[]>([]);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [draft, setDraft] = useState({
    title: "Romans 5 peace with God study",
    audience: "small-group",
    contentType: "study",
    status: "draft",
    destination: "shared-studies",
    summary: "",
    shareScope: "team",
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
          const [data, workflowData] = await Promise.all([
            getPublishingFlows(),
            getWorkflowRuns(),
          ]);
          setFlows(
            (data as Array<{
              id: string;
              title: string;
              audience: string;
              content_type: string;
              status: string;
              destination: string;
              summary: string;
              share_scope: string;
            }>).map((item) => ({
              id: item.id,
              title: item.title,
              audience: item.audience,
              contentType: item.content_type,
              status: item.status,
              destination: item.destination,
              summary: item.summary,
              shareScope: item.share_scope,
            })),
          );
          setWorkflowRuns(
            (workflowData as Array<{
              id: string;
              workflow_name: string;
              linked_reference: string | null;
              stage: string;
              status: string;
              summary: string;
              next_step: string | null;
              output: Record<string, unknown> | null;
            }>)
              .filter((item) => item.workflow_name === "publishing-flow")
              .map((item) => ({
                id: item.id,
                workflowName: item.workflow_name,
                linkedReference: item.linked_reference || "",
                stage: item.stage,
                status: item.status,
                summary: item.summary,
                nextStep: item.next_step || "",
                output: item.output,
              })),
          );
        } else {
          const raw = localStorage.getItem(PUBLISHING_FLOWS_KEY);
          if (raw) {
            setFlows(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const findLinkedWorkflow = (flow: { id: string; title: string }) =>
    workflowRuns.find((run) => {
      const outputFlowId =
        run.output && typeof run.output.flow_id === "string" ? run.output.flow_id : null;

      return outputFlowId === flow.id || run.linkedReference === flow.title;
    });

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.summary.trim()) return;

    try {
      if (user) {
        const saved = await savePublishingFlow({
          title: draft.title,
          audience: draft.audience,
          content_type: draft.contentType,
          status: draft.status,
          destination: draft.destination,
          summary: draft.summary,
          share_scope: draft.shareScope,
        });

        setFlows((current) => [
          {
            id: saved.id,
            title: saved.title,
            audience: saved.audience,
            contentType: saved.content_type,
            status: saved.status,
            destination: saved.destination,
            summary: saved.summary,
            shareScope: saved.share_scope,
          },
          ...current,
        ]);

        const workflow = await saveWorkflowRun({
          workflow_name: "publishing-flow",
          linked_reference: saved.title,
          stage: saved.status,
          status: saved.status === "published" ? "completed" : "active",
          summary: `${saved.title} is now tracked in the publishing pipeline for ${saved.audience}.`,
          next_step:
            saved.status === "draft"
              ? "Move this draft into review when theology and audience fit are ready."
              : "Share or publish the content in the selected destination.",
          output: {
            flow_id: saved.id,
            destination: saved.destination,
            share_scope: saved.share_scope,
            content_type: saved.content_type,
          },
        });

        setWorkflowRuns((current) => [
          {
            id: workflow.id,
            workflowName: workflow.workflow_name,
            linkedReference: workflow.linked_reference || "",
            stage: workflow.stage,
            status: workflow.status,
            summary: workflow.summary,
            nextStep: workflow.next_step || "",
            output: workflow.output,
          },
          ...current,
        ]);
      } else {
        const next = [{ id: `${Date.now()}`, ...draft }, ...flows];
        setFlows(next);
        localStorage.setItem(PUBLISHING_FLOWS_KEY, JSON.stringify(next));
      }

      setDraft((current) => ({ ...current, summary: "" }));
      setSaveFeedback("Publishing flow saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  const handleAdvance = async (flow: PublishingFlow) => {
    const nextStatus =
      flow.status === "draft" ? "review" : flow.status === "review" ? "published" : "published";
    const nextStage = nextStatus;
    const linkedWorkflow = findLinkedWorkflow(flow);

    if (user) {
      await updatePublishingFlow({
        id: flow.id,
        status: nextStatus,
        destination: flow.destination,
        share_scope: flow.shareScope,
      });

       if (linkedWorkflow) {
        const updatedWorkflow = await updateWorkflowRun({
          id: linkedWorkflow.id,
          stage: nextStage,
          status: nextStatus === "published" ? "completed" : "active",
          next_step:
            nextStatus === "review"
              ? "Complete theological review and final share checks."
              : "This flow is published. Monitor adoption and update follow-up resources.",
          output: {
            ...(linkedWorkflow.output || {}),
            flow_id: flow.id,
            destination: flow.destination,
            share_scope: flow.shareScope,
          },
        });

        setWorkflowRuns((current) =>
          current.map((item) =>
            item.id === linkedWorkflow.id
              ? {
                  ...item,
                  stage: updatedWorkflow.stage,
                  status: updatedWorkflow.status,
                  nextStep: updatedWorkflow.next_step || "",
                  output: updatedWorkflow.output,
                }
              : item,
          ),
        );
      } else {
        const createdWorkflow = await saveWorkflowRun({
          workflow_name: "publishing-flow",
          linked_reference: flow.title,
          stage: nextStage,
          status: nextStatus === "published" ? "completed" : "active",
          summary: `${flow.title} is moving through the publishing pipeline.`,
          next_step:
            nextStatus === "review"
              ? "Complete theological review and final share checks."
              : "This flow is published. Monitor adoption and update follow-up resources.",
          output: {
            flow_id: flow.id,
            destination: flow.destination,
            share_scope: flow.shareScope,
            content_type: flow.contentType,
          },
        });

        setWorkflowRuns((current) => [
          {
            id: createdWorkflow.id,
            workflowName: createdWorkflow.workflow_name,
            linkedReference: createdWorkflow.linked_reference || "",
            stage: createdWorkflow.stage,
            status: createdWorkflow.status,
            summary: createdWorkflow.summary,
            nextStep: createdWorkflow.next_step || "",
            output: createdWorkflow.output,
          },
          ...current,
        ]);
      }
    }

    const nextFlows = flows.map((item) =>
      item.id === flow.id ? { ...item, status: nextStatus } : item,
    );
    setFlows(nextFlows);

    if (!user) {
      localStorage.setItem(PUBLISHING_FLOWS_KEY, JSON.stringify(nextFlows));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading publishing flows...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#7c2d12] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Share2 className="h-4 w-4" />
              Leader publishing flow
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Move from study draft to ministry-ready publication.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              This publishing layer turns passage prep into a real workflow with
              draft, review, publish, and share states for leaders and teams.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-3">
          {publishingStages.map((stage, index) => (
            <article
              key={stage.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              {index === 0 && <ClipboardCheck className="h-6 w-6 text-[#1e40af]" />}
              {index === 1 && <CheckCheck className="h-6 w-6 text-[#7c2d12]" />}
              {index === 2 && <Send className="h-6 w-6 text-[#14532d]" />}
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {stage.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{stage.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <FileOutput className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Publishing outputs</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Public passage study pages",
                "Internal team lesson drafts",
                "Family devotion take-home guides",
                "Leader packets tied to export templates",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Globe2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Where this connects</h2>
            </div>
            <p className="mt-4 leading-7 text-amber-900">
              The publishing flow sits between leader prep, shared studies, and
              export generation so the content can travel without being rebuilt.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shared-studies"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Open shared studies
              </Link>
              <Link
                href="/exports"
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
              >
                Open exports
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">Create a publishing flow</h2>
            {saveFeedback ? (
              <p className="text-sm font-medium text-emerald-700">{saveFeedback}</p>
            ) : null}
          </div>
          <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Title"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <select
              value={draft.audience}
              onChange={(event) =>
                setDraft((current) => ({ ...current, audience: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="small-group">Small group</option>
              <option value="youth">Youth</option>
              <option value="church">Church</option>
              <option value="family">Family</option>
            </select>
            <select
              value={draft.contentType}
              onChange={(event) =>
                setDraft((current) => ({ ...current, contentType: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="study">Study</option>
              <option value="leader-guide">Leader guide</option>
              <option value="family-devotion">Family devotion</option>
              <option value="lesson">Lesson</option>
            </select>
            <select
              value={draft.destination}
              onChange={(event) =>
                setDraft((current) => ({ ...current, destination: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="shared-studies">Shared studies</option>
              <option value="workspace">Workspace</option>
              <option value="rooms">Rooms</option>
            </select>
            <select
              value={draft.shareScope}
              onChange={(event) =>
                setDraft((current) => ({ ...current, shareScope: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="team">Team</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            <textarea
              value={draft.summary}
              onChange={(event) =>
                setDraft((current) => ({ ...current, summary: event.target.value }))
              }
              rows={4}
              placeholder="Summary"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af] md:col-span-2"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[#7c2d12] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9a3412] md:col-span-2"
            >
              Save publishing flow
            </button>
          </form>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Saved flows</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {flows.length > 0 ? (
              flows.map((flow) => (
                <article
                  key={flow.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#7c2d12]">
                    {flow.status} • {flow.audience} • {flow.destination}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {flow.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{flow.summary}</p>
                  {flow.status !== "published" ? (
                    <button
                      type="button"
                      onClick={() => handleAdvance(flow)}
                      className="mt-4 rounded-xl border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
                    >
                      Advance to {flow.status === "draft" ? "review" : "published"}
                    </button>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Save a publishing flow to track draft, review, and publish states.
              </p>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <ClipboardCheck className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Publishing operations trail</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-900">
            Signed-in publishing work now writes to workflow history so leaders can track
            draft, review, and publish movement with a clearer next step.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {workflowRuns.length > 0 ? (
              workflowRuns.map((run) => (
                <article
                  key={run.id}
                  className="rounded-2xl border border-blue-200 bg-white p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {run.stage} • {run.status}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {run.linkedReference || "Publishing workflow"}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{run.summary}</p>
                  <p className="mt-3 text-sm font-medium text-blue-950">
                    Next: {run.nextStep || "No next step saved yet."}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-blue-300 bg-white p-5 text-sm text-blue-950">
                Save a publishing flow while signed in to start building an operational trail.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
