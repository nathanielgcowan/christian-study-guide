"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  BookHeart,
  LayoutDashboard,
  MessageSquareQuote,
  NotebookTabs,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getPassageDashboards,
  savePassageDashboard,
} from "../../lib/persistence";

const PASSAGE_DASHBOARDS_KEY = "christian-study-guide:passage-dashboards";

const dashboardBlocks = [
  {
    title: "Study snapshot",
    description:
      "Keep passage summary, context, cross references, and your chosen study mode together in one saved workspace.",
  },
  {
    title: "Mentor thread",
    description:
      "Reopen the ongoing discipleship conversation tied to that exact passage instead of starting from scratch.",
  },
  {
    title: "Prayer and action",
    description:
      "Save the prayer response, journaling prompt, and next action step that came out of the study.",
  },
  {
    title: "Leader handoff",
    description:
      "Carry sermon notes, group questions, and export-ready content into the same saved passage dashboard.",
  },
];

interface PassageDashboard {
  id: string;
  reference: string;
  title: string;
  studyMode: string;
  summary: string;
  mentorThreadSummary: string;
  prayerFocus: string;
  nextAction: string;
}

export default function PassageDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [dashboards, setDashboards] = useState<PassageDashboard[]>([]);
  const [draft, setDraft] = useState({
    reference: "Romans 5:1",
    title: "Romans 5 peace with God dashboard",
    studyMode: "overview",
    summary: "",
    mentorThreadSummary: "",
    prayerFocus: "",
    nextAction: "",
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
          const data = await getPassageDashboards();
          setDashboards(
            (
              data as Array<{
                id: string;
                reference: string;
                title: string;
                study_mode: string;
                summary: string;
                mentor_thread_summary: string | null;
                prayer_focus: string | null;
                next_action: string | null;
              }>
            ).map((item) => ({
              id: item.id,
              reference: item.reference,
              title: item.title,
              studyMode: item.study_mode,
              summary: item.summary,
              mentorThreadSummary: item.mentor_thread_summary || "",
              prayerFocus: item.prayer_focus || "",
              nextAction: item.next_action || "",
            })),
          );
        } else {
          const raw = localStorage.getItem(PASSAGE_DASHBOARDS_KEY);
          if (raw) {
            setDashboards(JSON.parse(raw));
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
    if (!draft.reference.trim() || !draft.title.trim() || !draft.summary.trim())
      return;

    try {
      if (user) {
        const saved = await savePassageDashboard({
          reference: draft.reference,
          title: draft.title,
          study_mode: draft.studyMode,
          summary: draft.summary,
          mentor_thread_summary: draft.mentorThreadSummary,
          prayer_focus: draft.prayerFocus,
          next_action: draft.nextAction,
        });

        setDashboards((current) => [
          {
            id: saved.id,
            reference: saved.reference,
            title: saved.title,
            studyMode: saved.study_mode,
            summary: saved.summary,
            mentorThreadSummary: saved.mentor_thread_summary || "",
            prayerFocus: saved.prayer_focus || "",
            nextAction: saved.next_action || "",
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            ...draft,
          },
          ...dashboards,
        ];
        setDashboards(next);
        localStorage.setItem(PASSAGE_DASHBOARDS_KEY, JSON.stringify(next));
      }

      setDraft((current) => ({
        ...current,
        summary: "",
        mentorThreadSummary: "",
        prayerFocus: "",
        nextAction: "",
      }));
      setSaveFeedback("Passage dashboard saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading passage dashboards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <LayoutDashboard className="h-4 w-4" />
              Saved passage dashboards
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Turn one passage into a reusable command surface.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              A saved passage dashboard keeps interpretation, mentor guidance,
              prayer, exports, and follow-up in one place so the user does not
              lose momentum between visits.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {dashboardBlocks.map((block) => (
            <article
              key={block.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <NotebookTabs className="h-6 w-6 text-[#1e40af]" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {block.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {block.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <BookHeart className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                What gets saved together
              </h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Passage, translation, and study mode",
                "Mentor thread and saved prompts",
                "Devotional, journaling, and prayer output",
                "Discussion questions, notes, and exports",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-violet-200 bg-white p-5 text-sm font-medium text-violet-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Best connected pages</h2>
            </div>
            <p className="mt-4 leading-7 text-emerald-900">
              This layer works best when it is tied directly to study history,
              mentor conversations, and export workflows instead of living as a
              disconnected save feature.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/study"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Open study hub
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/mentor-chat"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
              >
                View mentor chat
                <MessageSquareQuote className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Save a dashboard
            </h2>
            {saveFeedback ? (
              <p className="text-sm font-medium text-emerald-700">
                {saveFeedback}
              </p>
            ) : null}
          </div>
          <form
            onSubmit={handleSave}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <input
              value={draft.reference}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  reference: event.target.value,
                }))
              }
              placeholder="Reference"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Dashboard title"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <select
              value={draft.studyMode}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  studyMode: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="overview">Overview</option>
              <option value="devotional">Devotional</option>
              <option value="group">Group</option>
              <option value="language">Language</option>
            </select>
            <input
              value={draft.nextAction}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  nextAction: event.target.value,
                }))
              }
              placeholder="Next action"
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
              rows={4}
              placeholder="Study summary"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af] md:col-span-2"
            />
            <input
              value={draft.mentorThreadSummary}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  mentorThreadSummary: event.target.value,
                }))
              }
              placeholder="Mentor thread summary"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <input
              value={draft.prayerFocus}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  prayerFocus: event.target.value,
                }))
              }
              placeholder="Prayer focus"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a] md:col-span-2"
            >
              Save passage dashboard
            </button>
          </form>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">
            Saved dashboards
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {dashboards.length > 0 ? (
              dashboards.map((dashboard) => (
                <article
                  key={dashboard.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    {dashboard.reference} • {dashboard.studyMode}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {dashboard.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {dashboard.summary}
                  </p>
                  {dashboard.mentorThreadSummary ? (
                    <p className="mt-3 text-sm text-slate-600">
                      Mentor: {dashboard.mentorThreadSummary}
                    </p>
                  ) : null}
                  {dashboard.prayerFocus ? (
                    <p className="mt-2 text-sm text-slate-600">
                      Prayer: {dashboard.prayerFocus}
                    </p>
                  ) : null}
                  {dashboard.nextAction ? (
                    <p className="mt-2 text-sm text-slate-600">
                      Next: {dashboard.nextAction}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Save your first passage dashboard to keep a full study workspace
                together.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
