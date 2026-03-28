 "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, BookOpenText, Layers3, ScrollText, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getVerseByVerseProgress,
  saveVerseByVerseProgress,
  updateVerseByVerseProgress,
} from "@/lib/persistence";

const VERSE_PROGRESS_KEY = "christian-study-guide:verse-by-verse-progress";
const REFERENCE = "James 1:2-4";

const verseSections = [
  {
    verse: "James 1:2",
    emphasis: "Joy in trials",
    explanation:
      "James reframes suffering through discipleship, calling believers to evaluate hardship by what God produces through it.",
    application: "Where do you need to let God define the purpose of your current difficulty?",
  },
  {
    verse: "James 1:3",
    emphasis: "Testing produces steadfastness",
    explanation:
      "The passage does not glorify pain itself. It highlights what testing can form in a believer who remains rooted in Christ.",
    application: "What evidence of endurance has God already begun building in you?",
  },
  {
    verse: "James 1:4",
    emphasis: "Maturity and completeness",
    explanation:
      "The goal is spiritual wholeness, not just survival. James wants readers to see perseverance as part of becoming mature in faith.",
    application: "How might patience be shaping an area where you want immediate change?",
  },
];

export default function VerseByVersePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [progress, setProgress] = useState<{
    id?: string;
    completedVerses: string[];
    lastFocusVerse: string;
    completionStatus: string;
  }>({
    completedVerses: [],
    lastFocusVerse: "",
    completionStatus: "in-progress",
  });
  const [supabase] = useState(() => createClient());

  const completionCount = progress.completedVerses.length;
  const allComplete = useMemo(
    () => completionCount === verseSections.length,
    [completionCount],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getVerseByVerseProgress(REFERENCE);
          if (data) {
            setProgress({
              id: data.id,
              completedVerses: data.completed_verses ?? [],
              lastFocusVerse: data.last_focus_verse ?? "",
              completionStatus: data.completion_status ?? "in-progress",
            });
          }
        } else {
          const raw = localStorage.getItem(VERSE_PROGRESS_KEY);
          if (raw) setProgress(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const persistLocal = (next: typeof progress) => {
    setProgress(next);
    localStorage.setItem(VERSE_PROGRESS_KEY, JSON.stringify(next));
  };

  const handleCompleteVerse = async (verse: string) => {
    const completedVerses = progress.completedVerses.includes(verse)
      ? progress.completedVerses
      : [...progress.completedVerses, verse];
    const completionStatus = completedVerses.length === verseSections.length ? "completed" : "in-progress";
    const next = {
      ...progress,
      completedVerses,
      lastFocusVerse: verse,
      completionStatus,
    };

    try {
      if (user) {
        const saved = progress.id
          ? await updateVerseByVerseProgress({
              id: progress.id,
              completed_verses: completedVerses,
              last_focus_verse: verse,
              completion_status: completionStatus,
            })
          : await saveVerseByVerseProgress({
              reference: REFERENCE,
              completed_verses: completedVerses,
              last_focus_verse: verse,
              completion_status: completionStatus,
            });

        setProgress({
          id: saved.id,
          completedVerses: saved.completed_verses ?? [],
          lastFocusVerse: saved.last_focus_verse ?? "",
          completionStatus: saved.completion_status ?? "in-progress",
        });
      } else {
        persistLocal(next);
      }
      setSaveFeedback("Verse progress saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading verse progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <ScrollText className="h-4 w-4" />
              Verse-by-verse mode
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Slow down the study flow and walk through Scripture one verse at a time.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              This mode breaks a passage into smaller sections so explanation, context,
              and application stay anchored to the text instead of drifting into vague summary.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-10 grid gap-6 md:grid-cols-3">
          {[
            { label: "Reference", value: REFERENCE },
            { label: "Completed verses", value: `${completionCount}/${verseSections.length}` },
            { label: "Status", value: allComplete ? "Completed" : progress.completionStatus },
          ].map((item) => (
            <article key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <BookOpenText className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Sample passage flow</h2>
            </div>
            <div className="mt-6 space-y-4">
              {verseSections.map((section) => (
                <article key={section.verse} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    {section.verse}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{section.emphasis}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{section.explanation}</p>
                  <div className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Application:</span> {section.application}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCompleteVerse(section.verse)}
                    className="mt-4 rounded-xl bg-[#1e40af] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1e3a8a]"
                  >
                    {progress.completedVerses.includes(section.verse) ? "Reviewed" : "Mark reviewed"}
                  </button>
                </article>
              ))}
            </div>
            {saveFeedback ? <p className="mt-6 text-sm font-semibold text-emerald-700">{saveFeedback}</p> : null}
          </article>

          <aside className="space-y-6">
            <article className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
              <div className="flex items-center gap-3 text-violet-950">
                <Layers3 className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Best use cases</h2>
              </div>
              <div className="mt-6 grid gap-4">
                {[
                  "New believers learning how to read a passage carefully",
                  "Teachers preparing a more text-anchored lesson",
                  "Mentor conversations that need tighter passage grounding",
                  "Memory work tied to the exact logic of the verses",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-violet-200 bg-white p-5 text-sm text-violet-950">
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <Sparkles className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Connect it back</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-emerald-900">
                The strongest version of this feature lives inside the passage page so users can switch
                between overview, context, language, and verse-by-verse study without leaving the reading flow.
              </p>
              <Link
                href="/study-workspace"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-950 transition hover:text-emerald-800"
              >
                Open study workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}
