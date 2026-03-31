"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, BookMarked, LibraryBig, Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getCommentarySaves, saveCommentarySave } from "../../lib/persistence";

const COMMENTARY_SAVES_KEY = "christian-study-guide:commentary-saves";

const commentarySources = [
  {
    title: "Matthew Henry",
    summary:
      "Accessible devotional-style commentary that helps readers connect meaning and application.",
  },
  {
    title: "John Gill",
    summary:
      "Detailed verse-by-verse observations with stronger theological and historical emphasis.",
  },
  {
    title: "Jamieson-Fausset-Brown",
    summary:
      "Compact classic commentary useful for quick context and comparative insights.",
  },
];

interface SavedCommentary {
  id: string;
  sourceTitle: string;
  reference: string;
  summary: string;
  useCase: string;
}

export default function CommentariesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSources, setSavedSources] = useState<SavedCommentary[]>([]);
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
          const data = await getCommentarySaves();
          setSavedSources(
            (
              data as Array<{
                id: string;
                source_title: string;
                reference: string;
                summary: string;
                use_case: string | null;
              }>
            ).map((item) => ({
              id: item.id,
              sourceTitle: item.source_title,
              reference: item.reference,
              summary: item.summary,
              useCase: item.use_case || "",
            })),
          );
        } else {
          const raw = localStorage.getItem(COMMENTARY_SAVES_KEY);
          if (raw) setSavedSources(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveCommentary = async (
    source: (typeof commentarySources)[number],
  ) => {
    const payload = {
      source_title: source.title,
      reference: "John 3:16",
      summary: source.summary,
      use_case:
        "Helpful for comparing a trusted commentary summary with the AI explanation.",
    };

    try {
      if (user) {
        const saved = await saveCommentarySave(payload);
        setSavedSources((current) => [
          {
            id: saved.id,
            sourceTitle: saved.source_title,
            reference: saved.reference,
            summary: saved.summary,
            useCase: saved.use_case || "",
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            sourceTitle: payload.source_title,
            reference: payload.reference,
            summary: payload.summary,
            useCase: payload.use_case,
          },
          ...savedSources,
        ];
        setSavedSources(next);
        localStorage.setItem(COMMENTARY_SAVES_KEY, JSON.stringify(next));
      }

      setSaveFeedback(`${source.title} saved`);
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading commentary layer...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#7c2d12] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <LibraryBig className="h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">
            Commentary Layer
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-orange-50">
            Add trusted Christian commentary summaries alongside AI explanations
            so study feels more grounded and useful.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-3">
          {commentarySources.map((source) => (
            <article
              key={source.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Quote className="h-6 w-6 text-[#1e40af]" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                {source.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {source.summary}
              </p>
              <button
                type="button"
                onClick={() => handleSaveCommentary(source)}
                className="mt-5 rounded-2xl bg-[#1e40af] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save source
              </button>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <BookMarked className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                How this fits the passage flow
              </h2>
            </div>
            <div className="mt-6 grid gap-4">
              {[
                "Bible text first",
                "AI explanation second",
                "Commentary compare third",
                "Reflection, prayer, and notes after interpretation",
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

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <h2 className="text-2xl font-semibold text-emerald-950">
              Why it matters
            </h2>
            <p className="mt-4 text-sm leading-6 text-emerald-900">
              Commentary integration helps the app feel less like a generic AI
              chatbot and more like a real Bible study tool with grounded
              interpretive support.
            </p>
            <Link
              href="/passage/john-3-16"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Open a sample passage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Saved commentary sources
            </h2>
            {saveFeedback ? (
              <p className="text-sm font-semibold text-emerald-700">
                {saveFeedback}
              </p>
            ) : null}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {savedSources.length > 0 ? (
              savedSources.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.sourceTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.reference}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.summary}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {item.useCase}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                Save commentary sources here so trusted interpretation layers
                follow the user.
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <LibraryBig className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">
              Commentary depth worth adding
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Show why a commentary insight matters for this specific passage",
              "Pair commentary summaries with translation differences and cross references",
              "Help users move from interpretation to reflection and prayer in order",
              "Make trusted sources feel integrated, not bolted onto the side of the app",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
