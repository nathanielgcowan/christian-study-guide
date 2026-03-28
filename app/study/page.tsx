'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  BellRing,
  BookHeart,
  BookOpen,
  Brain,
  BrainCircuit,
  CalendarClock,
  CheckCheck,
  Milestone,
  Shapes,
} from 'lucide-react';
import { getActivityTimeline, getMentorHistory, getStudySessions } from '@/lib/persistence';

interface SavedStudySession {
  id: string;
  reference: string;
  createdAt: string;
  mode: string;
  summary: string;
}

interface MentorHistoryItem {
  id: string;
  reference: string;
  prompt: string;
  title: string;
  createdAt: string;
}

interface MentorThread {
  reference: string;
  count: number;
  latestPrompt: string;
  latestTitle: string;
  latestCreatedAt: string;
}

interface ApiStudySession {
  id: string;
  reference: string;
  created_at: string;
  mode: string;
  summary: string;
}

interface ApiMentorHistory {
  id: string;
  reference: string;
  question: string;
  answer: string | null;
  created_at: string;
}

interface ActivityItem {
  id: string;
  event_type: string;
  reference: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const SAVED_SESSIONS_KEY = 'christian-study-guide:saved-sessions';
const MENTOR_HISTORY_KEY = 'christian-study-guide:mentor-history';
const ACTIVITY_KEY = 'christian-study-guide:activity-timeline';
const studyTemplates = [
  {
    name: 'Personal quiet time',
    summary:
      'Read the passage, note one insight, write one prayer, and choose one action step.',
  },
  {
    name: 'Small group prep',
    summary:
      'Use context, cross references, discussion questions, and one closing prayer.',
  },
  {
    name: 'Youth lesson flow',
    summary:
      'Start with one hook, one main truth, one illustration, and a response question.',
  },
];
const followUpCheckIns = [
  'How did that action step from your last mentor session go?',
  'Did you revisit the passage you saved this week?',
  'What prayer request needs a progress update today?',
];
const guidedPathExamples = [
  'Foundations of Christianity',
  'Life of Jesus',
  'Spiritual Warfare',
  'Theology Basics',
  'Bible Overview',
];

export default function StudyHubPage() {
  const [savedSessions, setSavedSessions] = useState<SavedStudySession[]>([]);
  const [mentorHistory, setMentorHistory] = useState<MentorHistoryItem[]>([]);
  const [activityTimeline, setActivityTimeline] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());
  const mentorThreads = mentorHistory.reduce<MentorThread[]>((threads, entry) => {
    const existingThread = threads.find((thread) => thread.reference === entry.reference);

    if (existingThread) {
      existingThread.count += 1;

      if (
        new Date(entry.createdAt).getTime() >
        new Date(existingThread.latestCreatedAt).getTime()
      ) {
        existingThread.latestPrompt = entry.prompt;
        existingThread.latestTitle = entry.title;
        existingThread.latestCreatedAt = entry.createdAt;
      }

      return threads;
    }

    threads.push({
      reference: entry.reference,
      count: 1,
      latestPrompt: entry.prompt,
      latestTitle: entry.title,
      latestCreatedAt: entry.createdAt,
    });

    return threads;
  }, []);

  mentorThreads.sort(
    (left, right) =>
      new Date(right.latestCreatedAt).getTime() - new Date(left.latestCreatedAt).getTime()
  );

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const [sessionsData, mentorData, activityData] = await Promise.all([
            getStudySessions(),
            getMentorHistory(),
            getActivityTimeline(),
          ]);

          setSavedSessions(
            (sessionsData as ApiStudySession[]).map((sessionItem) => ({
              id: sessionItem.id,
              reference: sessionItem.reference,
              createdAt: sessionItem.created_at,
              mode: sessionItem.mode,
              summary: sessionItem.summary,
            }))
          );

          setMentorHistory(
            (mentorData as ApiMentorHistory[]).map((item) => {
              let parsedAnswer: { title?: string } = {};
              try {
                parsedAnswer = item.answer ? JSON.parse(item.answer) : {};
              } catch {}

              return {
                id: item.id,
                reference: item.reference,
                prompt: item.question,
                title: parsedAnswer.title || 'Christian AI Mentor',
                createdAt: item.created_at,
              };
            })
          );
          setActivityTimeline(activityData as ActivityItem[]);
        } else {
          const rawSessions = localStorage.getItem(SAVED_SESSIONS_KEY);
          const rawMentorHistory = localStorage.getItem(MENTOR_HISTORY_KEY);
          const rawActivity = localStorage.getItem(ACTIVITY_KEY);

          setSavedSessions(rawSessions ? JSON.parse(rawSessions) : []);
          setMentorHistory(rawMentorHistory ? JSON.parse(rawMentorHistory) : []);
          setActivityTimeline(rawActivity ? JSON.parse(rawActivity) : []);
        }
      } catch (error) {
        console.error('Error loading study hub data:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading your study hub...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <BookHeart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Study Hub</h1>
              <p className="mt-1 text-blue-100">
                Revisit saved study sessions and your recent mentor conversations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="mb-8 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <BrainCircuit className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">AI Guided Bible Study Path</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {guidedPathExamples.map((item) => (
              <Link
                key={item}
                href="/paths"
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950 transition hover:bg-blue-100"
              >
                {item}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-3 text-amber-950">
              <BellRing className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Reading reminders</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-amber-900">
              Gentle nudges for unfinished plans, prayer habits, and keeping your
              streak alive are ready as the next retention layer.
            </p>
          </div>
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <div className="flex items-center gap-3 text-violet-950">
              <Shapes className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Study templates</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-violet-900">
              {studyTemplates.map((template) => (
                <li key={template.name}>• {template.name}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center gap-3 text-emerald-950">
              <CheckCheck className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Follow-up check-ins</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-emerald-900">
              Use saved mentor moments to prompt real obedience a few days later.
            </p>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <CalendarClock className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold text-[#0f172a]">Saved Study Sessions</h2>
            </div>

            {savedSessions.length === 0 ? (
              <p className="text-gray-600">
                Save a study session from any passage page to build your personal study library.
              </p>
            ) : (
              <div className="space-y-4">
                {savedSessions.map((session) => (
                  <article
                    key={session.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <Link
                        href={`/passage/${session.reference.toLowerCase().replace(/\s+/g, '-')}`}
                        className="font-semibold text-[#1e40af] hover:text-[#1e3a8a]"
                      >
                        {session.reference}
                      </Link>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-900">
                        {session.mode}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{session.summary}</p>
                    <p className="mt-3 text-xs text-gray-500">
                      Saved {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Brain className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-semibold text-[#0f172a]">Mentor History</h2>
            </div>

            {mentorHistory.length === 0 ? (
              <p className="text-gray-600">
                Ask the Christian AI Mentor a question to start building your history.
              </p>
            ) : (
              <div className="space-y-4">
                {mentorHistory.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <Link
                        href={`/passage/${entry.reference.toLowerCase().replace(/\s+/g, '-')}`}
                        className="font-semibold text-[#1e40af] hover:text-[#1e3a8a]"
                      >
                        {entry.reference}
                      </Link>
                      <BookOpen className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">{entry.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{entry.prompt}</p>
                    <p className="mt-3 text-xs text-gray-500">
                      Asked {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Brain className="h-6 w-6 text-emerald-700" />
            <div>
              <h2 className="text-2xl font-semibold text-emerald-950">
                AI Study Companion Threads
              </h2>
              <p className="text-sm text-emerald-900">
                Keep mentor conversations grouped by passage so each study page starts to
                feel like an ongoing discipleship thread.
              </p>
            </div>
          </div>

          {mentorThreads.length === 0 ? (
            <p className="text-sm leading-6 text-emerald-900">
              Ask the mentor a question from a passage page and this hub will start
              collecting passage-based companion threads here.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {mentorThreads.map((thread) => (
                <article
                  key={thread.reference}
                  className="rounded-2xl border border-emerald-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/passage/${thread.reference.toLowerCase().replace(/\s+/g, '-')}`}
                      className="font-semibold text-emerald-900 hover:text-emerald-700"
                    >
                      {thread.reference}
                    </Link>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-900">
                      {thread.count} thread{thread.count === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900">
                    {thread.latestTitle}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {thread.latestPrompt}
                  </p>
                  <p className="mt-3 text-xs text-gray-500">
                    Latest activity {new Date(thread.latestCreatedAt).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Milestone className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold text-[#0f172a]">Journal timeline</h2>
            </div>
            <div className="space-y-4">
              {(activityTimeline.length > 0
                ? activityTimeline
                : [
                    {
                      id: 'fallback-study',
                      event_type: 'study_session_saved',
                      reference: 'James 1:2-4',
                      metadata: null,
                      created_at: new Date().toISOString(),
                    },
                    {
                      id: 'fallback-prayer',
                      event_type: 'prayer_entry_created',
                      reference: null,
                      metadata: { title: 'Family wisdom' },
                      created_at: new Date(Date.now() - 86400000).toISOString(),
                    },
                  ]
              ).map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {index + 1} days ago
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.event_type.replace(/_/g, ' ')}
                    {item.reference ? ` • ${item.reference}` : ''}
                    {typeof item.metadata?.title === 'string'
                      ? ` • ${item.metadata.title}`
                      : ''}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Brain className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-semibold text-[#0f172a]">AI follow-up check-ins</h2>
            </div>
            <div className="space-y-4">
              {followUpCheckIns.map((prompt) => (
                <article
                  key={prompt}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
                >
                  <p className="text-sm leading-6 text-emerald-950">{prompt}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
