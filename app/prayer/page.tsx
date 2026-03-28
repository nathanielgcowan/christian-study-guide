'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  NotebookPen,
  PlusCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  getPrayerEntries,
  getWorkflowRuns,
  savePrayerEntry,
  saveWorkflowRun,
  updatePrayerEntry,
} from '@/lib/persistence';

interface PrayerEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  answered: boolean;
}

interface TestimonyEntry {
  id: string;
  prayerTitle: string;
  summary: string;
  nextStep: string;
}

const PRAYER_STORAGE_KEY = 'christian-study-guide:prayer-entries';
const PRAYER_TESTIMONIES_KEY = 'christian-study-guide:prayer-testimonies';
const ACTIVITY_STORAGE_KEY = 'christian-study-guide:activity-timeline';

const initialEntries: PrayerEntry[] = [
  {
    id: '1',
    title: 'Peace in anxious moments',
    content:
      'Lord, help me replace fear with trust and remember that You are near when my mind feels overwhelmed.',
    category: 'Anxiety',
    answered: false,
  },
  {
    id: '2',
    title: 'Wisdom for family decisions',
    content:
      'Give our family unity, patience, and wisdom as we make decisions about the next season.',
    category: 'Family',
    answered: true,
  },
];

const prayerTemplates = [
  {
    input: "Generate a prayer from Psalm 23.",
    output:
      "Lord, You are my Shepherd. Lead me beside quiet waters, restore my soul, guide me in righteousness, and keep me unafraid because You are with me.",
  },
  {
    input: "Generate a prayer from Philippians 4:6-7.",
    output:
      "Father, when anxiety rises, teach me to bring everything to You with thanksgiving and let Your peace guard my heart and mind in Christ Jesus.",
  },
];

const reminderIdeas = [
  "Morning prayer reminder",
  "Midday Scripture prayer pause",
  "Evening answered-prayer review",
];

export default function PrayerPage() {
  const [entries, setEntries] = useState(initialEntries);
  const [draft, setDraft] = useState({ title: '', content: '', category: 'General' });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [testimonies, setTestimonies] = useState<TestimonyEntry[]>([]);
  const [testimonyDrafts, setTestimonyDrafts] = useState<Record<string, string>>({});
  const [supabase] = useState(() => createClient());

  const analytics = useMemo(() => {
    const answeredCount = entries.filter((entry) => entry.answered).length;
    const unansweredCount = entries.length - answeredCount;
    const categoryMap = entries.reduce<Record<string, number>>((accumulator, entry) => {
      accumulator[entry.category] = (accumulator[entry.category] || 0) + 1;
      return accumulator;
    }, {});

    const topCategory =
      Object.entries(categoryMap).sort((left, right) => right[1] - left[1])[0]?.[0] ||
      'General';

    return {
      answeredCount,
      unansweredCount,
      topCategory,
    };
  }, [entries]);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user ?? null);

        if (session) {
          const [data, workflowRuns] = await Promise.all([getPrayerEntries(), getWorkflowRuns()]);
          setEntries(
            (data as Array<{
              id: string;
              title: string;
              content: string;
              category: string;
              answered: boolean;
            }>).map((entry) => ({
              id: entry.id,
              title: entry.title,
              content: entry.content,
              category: entry.category,
              answered: entry.answered,
            })),
          );
          setTestimonies(
            (workflowRuns as Array<{
              id: string;
              workflow_name: string;
              summary: string;
              next_step: string | null;
              output: Record<string, unknown> | null;
            }>)
              .filter((item) => item.workflow_name === 'answered-prayer-testimony')
              .map((item) => ({
                id: item.id,
                prayerTitle:
                  typeof item.output?.prayer_title === 'string'
                    ? item.output.prayer_title
                    : 'Answered prayer',
                summary: item.summary,
                nextStep: item.next_step || 'Share this testimony with gratitude.',
              })),
          );
        } else {
          const raw = localStorage.getItem(PRAYER_STORAGE_KEY);
          const rawTestimonies = localStorage.getItem(PRAYER_TESTIMONIES_KEY);
          if (raw) {
            setEntries(JSON.parse(raw));
          }
          if (rawTestimonies) {
            setTestimonies(JSON.parse(rawTestimonies));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [supabase]);

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) return;

    const persist = async () => {
      if (user) {
        const saved = await savePrayerEntry(draft.title, draft.content, draft.category);
        setEntries((current) => [
          {
            id: saved.id,
            title: saved.title,
            content: saved.content,
            category: saved.category,
            answered: saved.answered,
          },
          ...current,
        ]);
      } else {
        const nextEntries = [
          {
            id: `${Date.now()}`,
            title: draft.title,
            content: draft.content,
            category: draft.category,
            answered: false,
          },
          ...entries,
        ];
        setEntries(nextEntries);
        localStorage.setItem(PRAYER_STORAGE_KEY, JSON.stringify(nextEntries));
        const existingActivity = JSON.parse(
          localStorage.getItem(ACTIVITY_STORAGE_KEY) || '[]'
        ) as Array<Record<string, unknown>>;
        localStorage.setItem(
          ACTIVITY_STORAGE_KEY,
          JSON.stringify([
            {
              id: `prayer-${Date.now()}`,
              event_type: 'prayer_entry_created',
              reference: null,
              metadata: {
                title: draft.title,
                category: draft.category,
              },
              created_at: new Date().toISOString(),
            },
            ...existingActivity,
          ].slice(0, 30))
        );
      }

      setDraft({ title: '', content: '', category: 'General' });
    };

    persist();
  };

  const toggleAnswered = (id: string) => {
    const persist = async () => {
      const target = entries.find((entry) => entry.id === id);
      if (!target) return;

      if (user) {
        const updated = await updatePrayerEntry(id, !target.answered);
        setEntries((current) =>
          current.map((entry) =>
            entry.id === id ? { ...entry, answered: updated.answered } : entry
          )
        );
      } else {
        const nextEntries = entries.map((entry) =>
          entry.id === id ? { ...entry, answered: !entry.answered } : entry
        );
        setEntries(nextEntries);
        localStorage.setItem(PRAYER_STORAGE_KEY, JSON.stringify(nextEntries));
        const existingActivity = JSON.parse(
          localStorage.getItem(ACTIVITY_STORAGE_KEY) || '[]'
        ) as Array<Record<string, unknown>>;
        localStorage.setItem(
          ACTIVITY_STORAGE_KEY,
          JSON.stringify([
            {
              id: `prayer-toggle-${Date.now()}`,
              event_type: !target.answered ? 'prayer_answered' : 'prayer_reopened',
              reference: null,
              metadata: {
                title: target.title,
                category: target.category,
              },
              created_at: new Date().toISOString(),
            },
            ...existingActivity,
          ].slice(0, 30))
        );
      }
    };

    persist();
  };

  const saveTestimony = async (entry: PrayerEntry) => {
    const summary = testimonyDrafts[entry.id]?.trim();
    if (!summary) return;

    const testimonyEntry = {
      id: `${entry.id}-${Date.now()}`,
      prayerTitle: entry.title,
      summary,
      nextStep: 'Share this update with your group, mentor, or journal review.',
    };

    if (user) {
      const saved = await saveWorkflowRun({
        workflow_name: 'answered-prayer-testimony',
        stage: 'reflection',
        status: 'completed',
        summary,
        next_step: testimonyEntry.nextStep,
        output: {
          prayer_title: entry.title,
          category: entry.category,
        },
      });

      setTestimonies((current) => [
        {
          id: saved.id,
          prayerTitle: entry.title,
          summary: saved.summary,
          nextStep: saved.next_step || testimonyEntry.nextStep,
        },
        ...current,
      ]);
    } else {
      const next = [testimonyEntry, ...testimonies];
      setTestimonies(next);
      localStorage.setItem(PRAYER_TESTIMONIES_KEY, JSON.stringify(next));
    }

    setTestimonyDrafts((current) => ({ ...current, [entry.id]: '' }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading your prayer journal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Prayer Journal</h1>
              <p className="mt-1 text-blue-100">
                Save prayers, revisit answered requests, and build a record of God&apos;s faithfulness.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="lg:col-span-2 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="flex items-center gap-3 text-emerald-950">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Prayer analytics</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm font-medium text-slate-600">Answered prayers</p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">
                {analytics.answeredCount}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm font-medium text-slate-600">Still praying</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">
                {analytics.unansweredCount}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm font-medium text-slate-600">Top category</p>
              <p className="mt-2 text-2xl font-bold text-[#0f172a]">
                {analytics.topCategory}
              </p>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2 rounded-3xl border border-violet-200 bg-violet-50 p-8">
          <div className="flex items-center gap-3 text-violet-950">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Prayer Assistant</h2>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              {prayerTemplates.map((template) => (
                <article
                  key={template.input}
                  className="rounded-2xl border border-violet-200 bg-white p-5"
                >
                  <p className="text-sm font-semibold text-violet-900">{template.input}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{template.output}</p>
                </article>
              ))}
            </div>
            <aside className="rounded-2xl border border-violet-200 bg-white p-5">
              <p className="text-sm font-semibold text-violet-950">Prayer reminders</p>
              <div className="mt-4 grid gap-3">
                {reminderIdeas.map((reminder) => (
                  <article
                    key={reminder}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800"
                  >
                    {reminder}
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-amber-950">Answered prayer testimonies</h2>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                Move beyond tracking requests by recording how God answered and what step of
                gratitude or obedience comes next.
              </p>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
            >
              Share in community
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {testimonies.length > 0 ? (
              testimonies.map((item) => (
                <article key={item.id} className="rounded-2xl border border-amber-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    {item.prayerTitle}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item.summary}</p>
                  <p className="mt-3 text-sm font-medium text-amber-950">{item.nextStep}</p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-5 text-sm text-amber-950">
                Mark a prayer answered and write one short testimony to start building a record of
                faithfulness.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <PlusCircle className="h-5 w-5 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold text-[#0f172a]">New Prayer Entry</h2>
          </div>

          <form onSubmit={addEntry} className="space-y-4">
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Prayer title"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1e40af] focus:bg-white"
            />
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1e40af] focus:bg-white"
            >
              {['General', 'Anxiety', 'Family', 'Healing', 'Guidance', 'Gratitude'].map(
                (category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              )}
            </select>
            <textarea
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              rows={6}
              placeholder="Write your prayer here..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1e40af] focus:bg-white"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#1e40af] px-5 py-3 font-medium text-white transition hover:bg-[#1e3a8a]"
            >
              Save Prayer
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <NotebookPen className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-[#0f172a]">Answered Prayer Tracker</h2>
          </div>

          <div className="space-y-4">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className={`rounded-2xl border p-5 ${
                  entry.answered
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-[#0f172a]">{entry.title}</p>
                    <p className="mt-1 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                      {entry.category}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAnswered(entry.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      entry.answered
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {entry.answered ? 'Answered' : 'Mark Answered'}
                  </button>
                </div>
                <p className="text-sm leading-7 text-slate-700">{entry.content}</p>
                {entry.answered ? (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-4">
                    <label className="text-sm font-semibold text-emerald-950">
                      Add a testimony note
                    </label>
                    <textarea
                      value={testimonyDrafts[entry.id] || ''}
                      onChange={(e) =>
                        setTestimonyDrafts((current) => ({
                          ...current,
                          [entry.id]: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="How did God answer this prayer, and what gratitude or obedience followed?"
                      className="mt-3 w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => saveTestimony(entry)}
                      className="mt-3 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      Save testimony
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
