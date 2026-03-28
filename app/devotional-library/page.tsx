"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, BookHeart, Heart, NotebookPen, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSavedDevotionals, saveSavedDevotional } from "@/lib/persistence";

const DEVOTIONAL_LIBRARY_KEY = "christian-study-guide:saved-devotionals";

const starterDevotionals = [
  {
    title: "Peace in pressured seasons",
    reference: "Philippians 4:6-8",
    type: "Devotional + prayer",
    summary:
      "A saved devotional flow with reflection prompts, a short prayer, and one action step for anxiety.",
  },
  {
    title: "Steady hope when life feels unclear",
    reference: "Romans 8:28",
    type: "Reflection set",
    summary:
      "A guided set of journal prompts and mentor-linked encouragement for waiting seasons.",
  },
  {
    title: "Shepherded through the week",
    reference: "Psalm 23",
    type: "Prayer + journaling",
    summary:
      "A simple devotional saved for family use with gratitude prompts and a weekly next step.",
  },
];

interface SavedDevotional {
  id: string;
  title: string;
  reference: string;
  devotionalType: string;
  summary: string;
}

export default function DevotionalLibraryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [devotionals, setDevotionals] = useState<SavedDevotional[]>([]);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getSavedDevotionals();
          setDevotionals(
            (data as Array<{
              id: string;
              title: string;
              reference: string;
              devotional_type: string;
              summary: string;
            }>).map((item) => ({
              id: item.id,
              title: item.title,
              reference: item.reference,
              devotionalType: item.devotional_type,
              summary: item.summary,
            }))
          );
        } else {
          const raw = localStorage.getItem(DEVOTIONAL_LIBRARY_KEY);
          if (raw) {
            setDevotionals(JSON.parse(raw));
          } else {
            setDevotionals(
              starterDevotionals.map((item, index) => ({
                id: `starter-${index}`,
                title: item.title,
                reference: item.reference,
                devotionalType: item.type,
                summary: item.summary,
              }))
            );
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveDevotional = async (item: (typeof starterDevotionals)[number]) => {
    try {
      if (user) {
        const saved = await saveSavedDevotional({
          title: item.title,
          reference: item.reference,
          devotional_type: item.type,
          summary: item.summary,
        });
        setDevotionals((current) => [
          {
            id: saved.id,
            title: saved.title,
            reference: saved.reference,
            devotionalType: saved.devotional_type,
            summary: saved.summary,
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            title: item.title,
            reference: item.reference,
            devotionalType: item.type,
            summary: item.summary,
          },
          ...devotionals,
        ];
        setDevotionals(next);
        localStorage.setItem(DEVOTIONAL_LIBRARY_KEY, JSON.stringify(next));
      }

      setSaveFeedback("Devotional saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading devotional library...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <BookHeart className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Devotional Library</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Keep your saved devotionals, prayers, journaling prompts, and weekly
            action steps in one place instead of losing them after a single session.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-3">
          {starterDevotionals.map((item) => (
            <article
              key={`${item.reference}-${item.title}`}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                {item.type}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">
                {item.title}
              </h2>
              <p className="mt-2 text-sm font-medium text-[#1e40af]">{item.reference}</p>
              <p className="mt-4 leading-7 text-slate-600">{item.summary}</p>
              <button
                type="button"
                onClick={() => handleSaveDevotional(item)}
                className="mt-6 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save to library
              </button>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">Saved devotionals</h2>
            {saveFeedback ? (
              <p className="text-sm font-medium text-emerald-700">{saveFeedback}</p>
            ) : null}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {devotionals.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-[#1e40af]">
                  {item.devotionalType}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.reference}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <NotebookPen className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">What the library keeps</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-6 text-emerald-950">
              <p>• Saved devotionals generated from passage study</p>
              <p>• Prayer responses and journaling prompts</p>
              <p>• Weekly action steps and follow-up notes</p>
              <p>• Reusable content for family, group, or personal rhythms</p>
            </div>
          </div>

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Connect the flow</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              The devotional library becomes especially useful when it is paired with
              mentor threads, journeys, and exports for long-term reuse.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/devotionals"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Open devotionals
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/study"
                className="inline-flex items-center gap-2 rounded-2xl border border-violet-300 px-5 py-3 text-sm font-semibold text-violet-950 transition hover:bg-violet-100"
              >
                Open study hub
                <Heart className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
