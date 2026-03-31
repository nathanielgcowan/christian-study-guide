"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MessageSquareQuote,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getMentorChatMessages,
  getMentorChatThreads,
  saveMentorChatMessage,
  saveMentorChatThread,
  updateMentorChatThread,
} from "../../lib/persistence";

const MENTOR_CHAT_THREADS_KEY = "christian-study-guide:mentor-chat-threads";
const MENTOR_CHAT_MESSAGES_KEY = "christian-study-guide:mentor-chat-messages";

const threadStages = [
  "Passage-aware opening question",
  "Follow-up coaching and clarifying questions",
  "Recommended Scriptures and study plan",
  "Saved action step and check-in reminder",
];

interface MentorThread {
  id: string;
  reference: string;
  title: string;
  goal: string;
  status: string;
  latestSummary: string;
  nextStep: string;
}

interface MentorMessage {
  id: string;
  threadId: string;
  speaker: string;
  message: string;
  stage: string;
}

export default function MentorChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [messageFeedback, setMessageFeedback] = useState("");
  const [threads, setThreads] = useState<MentorThread[]>([]);
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [threadDraft, setThreadDraft] = useState({
    reference: "Philippians 4:6-7",
    title: "Anxiety from a Biblical perspective",
    goal: "Understand anxiety and build a prayer-based response.",
    latestSummary: "",
    nextStep: "",
  });
  const [messageDraft, setMessageDraft] = useState({
    speaker: "user",
    message: "",
    stage: "conversation",
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
          const data = await getMentorChatThreads();
          const mapped = (
            data as Array<{
              id: string;
              reference: string;
              title: string;
              goal: string | null;
              status: string;
              latest_summary: string | null;
              next_step: string | null;
            }>
          ).map((item) => ({
            id: item.id,
            reference: item.reference,
            title: item.title,
            goal: item.goal || "",
            status: item.status,
            latestSummary: item.latest_summary || "",
            nextStep: item.next_step || "",
          }));
          setThreads(mapped);
          if (mapped[0]) {
            setSelectedThreadId(mapped[0].id);
          }
        } else {
          const rawThreads = localStorage.getItem(MENTOR_CHAT_THREADS_KEY);
          const rawMessages = localStorage.getItem(MENTOR_CHAT_MESSAGES_KEY);
          const localThreads = rawThreads ? JSON.parse(rawThreads) : [];
          const localMessages = rawMessages ? JSON.parse(rawMessages) : [];
          setThreads(localThreads);
          setMessages(localMessages);
          if (localThreads[0]) {
            setSelectedThreadId(localThreads[0].id);
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedThreadId || !user) return;
      try {
        const data = await getMentorChatMessages(selectedThreadId);
        setMessages(
          (
            data as Array<{
              id: string;
              thread_id: string;
              speaker: string;
              message: string;
              stage: string;
            }>
          ).map((item) => ({
            id: item.id,
            threadId: item.thread_id,
            speaker: item.speaker,
            message: item.message,
            stage: item.stage,
          })),
        );
      } catch {}
    };

    loadMessages();
  }, [selectedThreadId, user]);

  const handleSaveThread = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!threadDraft.reference.trim() || !threadDraft.title.trim()) return;

    try {
      if (user) {
        const saved = await saveMentorChatThread({
          reference: threadDraft.reference,
          title: threadDraft.title,
          goal: threadDraft.goal,
          latest_summary: threadDraft.latestSummary,
          next_step: threadDraft.nextStep,
        });
        const nextThread = {
          id: saved.id,
          reference: saved.reference,
          title: saved.title,
          goal: saved.goal || "",
          status: saved.status,
          latestSummary: saved.latest_summary || "",
          nextStep: saved.next_step || "",
        };
        setThreads((current) => [nextThread, ...current]);
        setSelectedThreadId(nextThread.id);
      } else {
        const nextThread = {
          id: `${Date.now()}`,
          reference: threadDraft.reference,
          title: threadDraft.title,
          goal: threadDraft.goal,
          status: "active",
          latestSummary: threadDraft.latestSummary,
          nextStep: threadDraft.nextStep,
        };
        const nextThreads = [nextThread, ...threads];
        setThreads(nextThreads);
        setSelectedThreadId(nextThread.id);
        localStorage.setItem(
          MENTOR_CHAT_THREADS_KEY,
          JSON.stringify(nextThreads),
        );
      }

      setThreadDraft((current) => ({
        ...current,
        latestSummary: "",
        nextStep: "",
      }));
      setSaveFeedback("Mentor thread saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  const handleSaveMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedThreadId || !messageDraft.message.trim()) return;

    try {
      if (user) {
        const saved = await saveMentorChatMessage({
          thread_id: selectedThreadId,
          speaker: messageDraft.speaker,
          message: messageDraft.message,
          stage: messageDraft.stage,
        });
        setMessages((current) => [
          ...current,
          {
            id: saved.id,
            threadId: saved.thread_id,
            speaker: saved.speaker,
            message: saved.message,
            stage: saved.stage,
          },
        ]);
        await updateMentorChatThread({
          id: selectedThreadId,
          latest_summary: messageDraft.message,
        });
      } else {
        const nextMessages = [
          ...messages,
          {
            id: `${Date.now()}`,
            threadId: selectedThreadId,
            speaker: messageDraft.speaker,
            message: messageDraft.message,
            stage: messageDraft.stage,
          },
        ];
        setMessages(nextMessages);
        localStorage.setItem(
          MENTOR_CHAT_MESSAGES_KEY,
          JSON.stringify(nextMessages),
        );
      }

      setMessageDraft((current) => ({ ...current, message: "" }));
      setMessageFeedback("Message saved");
    } catch {
      setMessageFeedback("Save failed");
    } finally {
      setTimeout(() => setMessageFeedback(""), 2000);
    }
  };

  const selectedMessages = messages.filter(
    (message) => message.threadId === selectedThreadId,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading mentor chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#7c3aed] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <MessageSquareQuote className="h-4 w-4" />
              Full mentor chat
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Move from one answer to an ongoing discipleship conversation.
            </h1>
            <p className="mt-6 text-lg leading-8 text-violet-50">
              A real mentor chat should remember the passage, preserve the
              thread, recommend next Scriptures, and help users act on what they
              learned.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <Waypoints className="h-6 w-6 text-violet-700" />
              <h2 className="text-2xl font-semibold">
                Conversation thread model
              </h2>
            </div>
            <div className="mt-6 grid gap-4">
              {threadStages.map((stage) => (
                <article
                  key={stage}
                  className="rounded-2xl border border-violet-200 bg-violet-50 p-5 text-sm font-medium text-violet-950"
                >
                  {stage}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Why this matters</h2>
            </div>
            <p className="mt-4 leading-7 text-emerald-900">
              People rarely need just one response. They need guidance that can
              deepen over several prompts, stay attached to the passage, and
              create a trail of encouragement they can revisit later.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/passage/james-1-2-4"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Open mentor in passage
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/study"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
              >
                Open study hub
                <BookOpen className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Passage context stays in memory throughout the thread.",
            "Saved mentor titles, action plans, and follow-up prompts become a real growth trail.",
            "The best version ends in practice, not just better wording.",
          ].map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <CheckCircle2 className="h-6 w-6 text-[#1e40af]" />
              <p className="mt-4 leading-7 text-slate-700">{item}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#0f172a]">
                Create a thread
              </h2>
              {saveFeedback ? (
                <p className="text-sm font-medium text-emerald-700">
                  {saveFeedback}
                </p>
              ) : null}
            </div>
            <form onSubmit={handleSaveThread} className="mt-6 grid gap-4">
              <input
                value={threadDraft.reference}
                onChange={(event) =>
                  setThreadDraft((current) => ({
                    ...current,
                    reference: event.target.value,
                  }))
                }
                placeholder="Reference"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#7c3aed]"
              />
              <input
                value={threadDraft.title}
                onChange={(event) =>
                  setThreadDraft((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Thread title"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#7c3aed]"
              />
              <textarea
                value={threadDraft.goal}
                onChange={(event) =>
                  setThreadDraft((current) => ({
                    ...current,
                    goal: event.target.value,
                  }))
                }
                rows={3}
                placeholder="Goal for this thread"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#7c3aed]"
              />
              <input
                value={threadDraft.nextStep}
                onChange={(event) =>
                  setThreadDraft((current) => ({
                    ...current,
                    nextStep: event.target.value,
                  }))
                }
                placeholder="Next step"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#7c3aed]"
              />
              <button
                type="submit"
                className="rounded-2xl bg-[#7c3aed] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
              >
                Save mentor thread
              </button>
            </form>

            <div className="mt-6 grid gap-3">
              {threads.length > 0 ? (
                threads.map((thread) => (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedThreadId === thread.id
                        ? "border-violet-400 bg-violet-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <p className="font-semibold text-slate-900">
                      {thread.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {thread.reference} • {thread.status}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Save a thread to start a persistent mentor conversation.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#0f172a]">
                Thread messages
              </h2>
              {messageFeedback ? (
                <p className="text-sm font-medium text-emerald-700">
                  {messageFeedback}
                </p>
              ) : null}
            </div>
            <div className="mt-6 grid gap-3">
              {selectedMessages.length > 0 ? (
                selectedMessages.map((message) => (
                  <article
                    key={message.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                      {message.speaker} • {message.stage}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {message.message}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Select a thread and save messages to build a real mentor
                  trail.
                </p>
              )}
            </div>

            <form onSubmit={handleSaveMessage} className="mt-6 grid gap-4">
              <select
                value={messageDraft.speaker}
                onChange={(event) =>
                  setMessageDraft((current) => ({
                    ...current,
                    speaker: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#7c3aed]"
              >
                <option value="user">User</option>
                <option value="mentor">Mentor</option>
              </select>
              <select
                value={messageDraft.stage}
                onChange={(event) =>
                  setMessageDraft((current) => ({
                    ...current,
                    stage: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#7c3aed]"
              >
                <option value="conversation">Conversation</option>
                <option value="follow-up">Follow-up</option>
                <option value="action-plan">Action plan</option>
              </select>
              <textarea
                value={messageDraft.message}
                onChange={(event) =>
                  setMessageDraft((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
                rows={4}
                placeholder="Add a message to the selected thread"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#7c3aed]"
              />
              <button
                type="submit"
                disabled={!selectedThreadId}
                className="rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save message
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
