"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  BrainCircuit,
  FileText,
  Gauge,
  MessagesSquare,
  NotebookPen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAIStudioOutputs, saveAIStudioOutput } from "../../lib/persistence";

const AI_STUDIO_OUTPUTS_KEY = "christian-study-guide:ai-studio-outputs";

const generators = [
  "Passage explanation anchored to context and cross references",
  "Personal devotionals, prayers, and journaling prompts",
  "Sermon outlines, youth lessons, and small-group guides",
  "Bible quizzes, memory prompts, and discussion questions",
];

const guardrails = [
  "Anchor every output to the passage first, then related verses and historical context.",
  "Show where AI is summarizing versus where Scripture is being quoted or linked.",
  "Keep doctrinal claims transparent, especially where traditions differ.",
  "Let users save, compare, and refine outputs rather than treating one draft as final.",
];

const liveGenerationLayers = [
  "Per-passage generation with retry and refinement controls",
  "Visible prompt lineage so users know how an output was built",
  "Usage limits, queue states, and status feedback for production readiness",
  "Saved output history with version comparison and export actions",
];

const passageGenerationMoments = [
  {
    title: "Passage explanation",
    detail:
      "Explain the text through immediate context, related verses, and historical background before application.",
  },
  {
    title: "Devotional pack",
    detail:
      "Generate reflection questions, journaling prompts, prayer, and one action step from the same passage.",
  },
  {
    title: "Teaching draft",
    detail:
      "Create a sermon outline, small-group guide, or family devotion while keeping the passage central.",
  },
];

interface SavedAIStudioOutput {
  id: string;
  title: string;
  generationType: string;
  sourceReference: string;
  summary: string;
  promptTemplate: string;
  status: string;
}

export default function AIStudioPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [outputs, setOutputs] = useState<SavedAIStudioOutput[]>([]);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getAIStudioOutputs();
          setOutputs(
            (
              data as Array<{
                id: string;
                title: string;
                generation_type: string;
                source_reference: string | null;
                summary: string;
                prompt_template: string | null;
                status: string;
              }>
            ).map((item) => ({
              id: item.id,
              title: item.title,
              generationType: item.generation_type,
              sourceReference: item.source_reference || "",
              summary: item.summary,
              promptTemplate: item.prompt_template || "",
              status: item.status,
            })),
          );
        } else {
          const raw = localStorage.getItem(AI_STUDIO_OUTPUTS_KEY);
          if (raw) setOutputs(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveOutput = async () => {
    const payload = {
      title: "Anchored study guide draft",
      generation_type: "study-guide",
      source_reference: "James 1:2-4",
      summary:
        "A study guide draft that combines context, reflection, and prayer from James 1:2-4.",
      prompt_template:
        "Explain passage -> context -> cross references -> reflection -> prayer",
      status: "draft",
    };

    try {
      if (user) {
        const saved = await saveAIStudioOutput(payload);
        setOutputs((current) => [
          {
            id: saved.id,
            title: saved.title,
            generationType: saved.generation_type,
            sourceReference: saved.source_reference || "",
            summary: saved.summary,
            promptTemplate: saved.prompt_template || "",
            status: saved.status,
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            title: payload.title,
            generationType: payload.generation_type,
            sourceReference: payload.source_reference,
            summary: payload.summary,
            promptTemplate: payload.prompt_template,
            status: payload.status,
          },
          ...outputs,
        ];
        setOutputs(next);
        localStorage.setItem(AI_STUDIO_OUTPUTS_KEY, JSON.stringify(next));
      }

      setSaveFeedback("AI studio output saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading AI studio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <BrainCircuit className="h-4 w-4" />
              Real AI generation layer
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Move from sample outputs to a serious Scripture-anchored AI
              studio.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              This is the generation layer for explanations, devotionals,
              quizzes, sermons, mentor responses, and study packs grounded in
              the passage.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <Sparkles className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Generation surfaces</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {generators.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-800"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <ShieldCheck className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Prompt guardrails</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {guardrails.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm leading-6 text-emerald-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <Link
            href="/study-workspace"
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <FileText className="h-6 w-6 text-[#1e40af]" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Study outputs
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Generate explanation, cross references, application, and notes
              from the same passage context.
            </p>
          </Link>
          <Link
            href="/mentor-chat"
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <MessagesSquare className="h-6 w-6 text-violet-700" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Mentor replies
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Keep mentor conversations passage-aware, personalized, and
              grounded in Scripture.
            </p>
          </Link>
          <Link
            href="/sermon"
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <NotebookPen className="h-6 w-6 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Leader drafts
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Build sermon starters, group guides, and lesson packs with clearer
              editorial flow.
            </p>
          </Link>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Gauge className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">
              Real AI backend direction
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {liveGenerationLayers.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-6 text-blue-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <BrainCircuit className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Real passage generation
              </h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {passageGenerationMoments.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-blue-200 bg-white p-5"
                >
                  <h3 className="text-base font-semibold text-blue-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-blue-900">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Gauge className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Product direction</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-amber-950">
              The strongest version of AI studio is not a one-off generator. It
              is a passage-aware engine that can create a study guide, a
              devotional, a quiz, a prayer, and a teaching draft from one
              anchored source of truth.
            </p>
            <Link
              href="/today"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
            >
              Open today&apos;s journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-blue-950">
                Next implementation layer
              </h2>
              <p className="mt-3 text-sm leading-6 text-blue-900">
                Wire these surfaces to a real OpenAI backend with saved prompt
                templates, token tracking, and feature gating for free versus
                premium usage.
              </p>
            </div>
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              View premium layer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Saved AI outputs
            </h2>
            <button
              type="button"
              onClick={handleSaveOutput}
              className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Save sample output
            </button>
          </div>
          {saveFeedback ? (
            <p className="mt-3 text-sm font-semibold text-emerald-700">
              {saveFeedback}
            </p>
          ) : null}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {outputs.length > 0 ? (
              outputs.map((output) => (
                <article
                  key={output.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    {output.generationType} • {output.status}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {output.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {output.summary}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {output.sourceReference || "No reference"} •{" "}
                    {output.promptTemplate || "No prompt template"}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                Save AI output drafts here so generated study assets follow the
                user across devices.
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Model routing for fast drafts vs premium deep study generation",
            "Prompt templates, retries, rate limits, and usage visibility",
            "Saved outputs with versioning, refinement, and export history",
          ].map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <BrainCircuit className="h-6 w-6 text-[#1e40af]" />
              <p className="mt-4 text-sm leading-6 text-slate-600">{item}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
