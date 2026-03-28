"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { BookOpen, HelpCircle, MessageSquare, Search, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getBibleQuestions, saveBibleQuestion } from "@/lib/persistence";

const BIBLE_QUESTIONS_KEY = "christian-study-guide:bible-questions";

const starterQuestions = [
  {
    question: "Why did Jesus die?",
    answer:
      "The New Testament explains Jesus' death as a sacrifice for sin, the demonstration of God's love, and the means by which believers are reconciled to God.",
    verses: ["Isaiah 53", "Romans 5:8", "1 Peter 3:18"],
  },
  {
    question: "What is the Trinity?",
    answer:
      "Christians confess one God who eternally exists as Father, Son, and Holy Spirit. Scripture reveals their unity and distinction without presenting three gods.",
    verses: ["Matthew 28:19", "John 1:1-14", "2 Corinthians 13:14"],
  },
  {
    question: "What does the Bible say about forgiveness?",
    answer:
      "Believers are called to forgive because they have been forgiven in Christ. Forgiveness is rooted in grace, truth, and reconciliation.",
    verses: ["Ephesians 4:31-32", "Colossians 3:13", "Matthew 18:21-35"],
  },
  {
    question: "What is spiritual warfare?",
    answer:
      "Spiritual warfare involves resisting the devil, standing in truth, and depending on God's strength through prayer and obedience.",
    verses: ["Ephesians 6:10-18", "James 4:7", "1 Peter 5:8-9"],
  },
];

const answerFramework = [
  "Start with the clearest key verses on the question.",
  "Explain the meaning before jumping to application.",
  "Acknowledge where traditions emphasize different aspects of the answer.",
  "Point the user back into a passage, not just a summary paragraph.",
];

const questionCategories = [
  "Gospel and salvation",
  "Theology and doctrine",
  "Christian living and forgiveness",
  "Spiritual warfare and suffering",
  "Church, prayer, and discipleship",
];

interface SavedQuestion {
  id: string;
  question: string;
  answerSummary: string;
  selectedTopic: string;
  keyVerses: string[];
}

export default function BibleQuestionsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(starterQuestions[0]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getBibleQuestions();
          setSavedQuestions(
            (data as Array<{
              id: string;
              question: string;
              answer_summary: string;
              selected_topic: string | null;
              key_verses: string[];
            }>).map((item) => ({
              id: item.id,
              question: item.question,
              answerSummary: item.answer_summary,
              selectedTopic: item.selected_topic || "",
              keyVerses: item.key_verses || [],
            })),
          );
        } else {
          const raw = localStorage.getItem(BIBLE_QUESTIONS_KEY);
          if (raw) setSavedQuestions(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return starterQuestions;
    return starterQuestions.filter((item) =>
      `${item.question} ${item.answer}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  const handleSaveQuestion = async () => {
    try {
      if (user) {
        const saved = await saveBibleQuestion({
          question: selected.question,
          answer_summary: selected.answer,
          selected_topic: selected.question,
          key_verses: selected.verses,
        });
        setSavedQuestions((current) => [
          {
            id: saved.id,
            question: saved.question,
            answerSummary: saved.answer_summary,
            selectedTopic: saved.selected_topic || "",
            keyVerses: saved.key_verses || [],
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            question: selected.question,
            answerSummary: selected.answer,
            selectedTopic: selected.question,
            keyVerses: selected.verses,
          },
          ...savedQuestions,
        ];
        setSavedQuestions(next);
        localStorage.setItem(BIBLE_QUESTIONS_KEY, JSON.stringify(next));
      }

      setSaveFeedback("Question saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading Bible questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <HelpCircle className="h-4 w-4" />
              AI Bible question mode
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Ask big faith questions and stay anchored to Scripture.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              This mode is designed for Bible answers, theological questions,
              and discipleship conversations that need real verses, not generic advice.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="relative mb-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask about the Trinity, forgiveness, suffering, angels..."
            className="w-full rounded-3xl border border-slate-200 bg-white py-5 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1e40af]"
          />
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <MessageSquare className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Question list</h2>
            </div>
            <div className="mt-6 grid gap-3">
              {filtered.map((item) => (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setSelected(item)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selected.question === item.question
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <p className="font-semibold text-slate-900">{item.question}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 text-[#0f172a]">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-violet-700" />
                <h2 className="text-2xl font-semibold">Scripture-anchored answer</h2>
              </div>
              <button
                type="button"
                onClick={handleSaveQuestion}
                className="rounded-2xl bg-[#1e40af] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                {saveFeedback || "Save"}
              </button>
            </div>
            <p className="mt-4 leading-7 text-slate-700">{selected.answer}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {selected.verses.map((verse) => (
                <Link
                  key={verse}
                  href={`/passage/${verse.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-900 transition hover:bg-violet-100"
                >
                  {verse}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <BookOpen className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Answer framework</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {answerFramework.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-7 text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <MessageSquare className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Question categories</h2>
            </div>
            <div className="mt-6 grid gap-3">
              {questionCategories.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-medium text-emerald-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Saved Q&A</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {savedQuestions.length > 0 ? (
              savedQuestions.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="font-semibold text-slate-900">{item.question}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {item.answerSummary}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Save questions to build a reusable Bible-answers library.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
