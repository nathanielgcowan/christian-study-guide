"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Gift, MessageCircle, MessagesSquare, Share2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSharedStudyComments, saveSharedStudyComment } from "@/lib/persistence";

const SHARED_STUDY_COMMENTS_KEY = "christian-study-guide:shared-study-comments";

const sharedStudies = [
  {
    title: "Romans 5 peace with God study",
    author: "Nathaniel",
    type: "Public passage study",
    summary:
      "A shareable study page with cross references, context, mentor insight, and devotional application.",
  },
  {
    title: "James 1 youth discussion guide",
    author: "Youth Team",
    type: "Leader guide",
    summary:
      "A public lesson starter with discussion prompts, action steps, and a closing prayer.",
  },
];

const starterComments = [
  "This was exactly what our small group needed for discussion tonight.",
  "The mentor thread and action step made this feel very practical.",
  "Would love a follow-up guide for the next passage in the series.",
];

const publishingStages = [
  "Draft the study with passage notes, explanation, and leader prompts",
  "Review tone, theology, and clarity before publishing",
  "Publish a clean public page with comments and follow-up links",
  "Track discussion, reuse, and requests for companion resources",
];

const sharingUseCases = [
  "Small-group leaders sharing weekly discussion guides",
  "Teachers publishing lesson companions for classes and youth groups",
  "Pastors sending sermon follow-up studies to the church",
  "Friends sharing devotionals and prayer-based reflections around a passage",
];

interface SharedStudyComment {
  id: string;
  studyTitle: string;
  authorName: string;
  content: string;
}

export default function SharedStudiesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [comments, setComments] = useState<SharedStudyComment[]>([]);
  const [draft, setDraft] = useState({
    studyTitle: "Romans 5 peace with God study",
    authorName: "You",
    content: "",
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
          const data = await getSharedStudyComments();
          setComments(
            (data as Array<{
              id: string;
              study_title: string;
              author_name: string;
              content: string;
            }>).map((item) => ({
              id: item.id,
              studyTitle: item.study_title,
              authorName: item.author_name,
              content: item.content,
            }))
          );
        } else {
          const raw = localStorage.getItem(SHARED_STUDY_COMMENTS_KEY);
          if (raw) {
            setComments(JSON.parse(raw));
          } else {
            setComments(
              starterComments.map((content, index) => ({
                id: `starter-${index}`,
                studyTitle: "Romans 5 peace with God study",
                authorName: "Community",
                content,
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

  const handleSaveComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.content.trim()) return;

    try {
      if (user) {
        const saved = await saveSharedStudyComment({
          study_title: draft.studyTitle,
          author_name: draft.authorName,
          content: draft.content,
        });
        setComments((current) => [
          {
            id: saved.id,
            studyTitle: saved.study_title,
            authorName: saved.author_name,
            content: saved.content,
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            studyTitle: draft.studyTitle,
            authorName: draft.authorName,
            content: draft.content,
          },
          ...comments,
        ];
        setComments(next);
        localStorage.setItem(SHARED_STUDY_COMMENTS_KEY, JSON.stringify(next));
      }

      setDraft((current) => ({ ...current, content: "" }));
      setSaveFeedback("Comment saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading shared studies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Share2 className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Shared Studies</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Publish a passage study, devotional flow, or leader guide as a clean
            public page that others can review, reuse, and discuss together.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2">
          {sharedStudies.map((study) => (
            <article
              key={study.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                {study.type}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">{study.title}</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">By {study.author}</p>
              <p className="mt-4 leading-7 text-slate-600">{study.summary}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <MessagesSquare className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Comments on shared studies</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm leading-6 text-emerald-950"
                >
                  <p className="font-semibold text-emerald-950">{comment.authorName}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-emerald-700">
                    {comment.studyTitle}
                  </p>
                  <p className="mt-2">{comment.content}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Users className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Why this helps</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              Shared public study pages make the app useful for teachers, group leaders,
              classes, and friends who want to engage the same Scripture together.
            </p>
            <Link
              href="/community"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-950 transition hover:text-violet-800"
            >
              Open community
              <MessageCircle className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">Add a comment</h2>
            {saveFeedback ? (
              <p className="text-sm font-medium text-emerald-700">{saveFeedback}</p>
            ) : null}
          </div>
          <form onSubmit={handleSaveComment} className="mt-6 grid gap-4 md:grid-cols-2">
            <select
              value={draft.studyTitle}
              onChange={(event) =>
                setDraft((current) => ({ ...current, studyTitle: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              {sharedStudies.map((study) => (
                <option key={study.title} value={study.title}>
                  {study.title}
                </option>
              ))}
            </select>
            <input
              value={draft.authorName}
              onChange={(event) =>
                setDraft((current) => ({ ...current, authorName: event.target.value }))
              }
              placeholder="Your name"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <textarea
              value={draft.content}
              onChange={(event) =>
                setDraft((current) => ({ ...current, content: event.target.value }))
              }
              rows={4}
              placeholder="Share your feedback or discussion insight"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af] md:col-span-2"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a] md:col-span-2"
            >
              Save comment
            </button>
          </form>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Public sharing direction</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Share a completed study as a clean public landing page",
              "Turn leader guides into reusable team resources",
              "Publish devotionals and passage studies with comments and follow-up links",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Publishing workflow</h2>
            </div>
            <div className="mt-6 space-y-3">
              {publishingStages.map((item, index) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-4 text-sm leading-6 text-blue-950"
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                    {index + 1}
                  </span>
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <ShieldCheck className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">When sharing works best</h2>
            </div>
            <div className="mt-6 space-y-3">
              {sharingUseCases.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm leading-6 text-emerald-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <Gift className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Shareable win cards</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "7-day streak celebration card",
              "Path completion reward card",
              "Memory mastery badge card",
              "Seasonal challenge finish card",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-amber-200 bg-white p-5 text-sm font-medium text-amber-950"
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
