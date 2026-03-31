"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Heart,
  Milestone,
  Sparkles,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getNewBelieverProgress,
  saveNewBelieverProgress,
} from "../../lib/persistence";

interface ProgramWeek {
  week: string;
  title: string;
  reading: string;
  focus: string;
  memoryVerse: string;
  prayerPrompt: string;
  actionStep: string;
  habits: string[];
  reflectionQuestions: string[];
  dailyReadings: Array<{ day: string; reference: string; label: string }>;
  checklist: string[];
}

const programWeeks = [
  {
    week: "Week 1",
    title: "Who Jesus is",
    reading: "Mark 1 and John 1",
    focus:
      "Meet Jesus, understand His identity, and begin reading the Gospels with confidence.",
    memoryVerse: "John 1:12",
    prayerPrompt:
      "Jesus, help me see You clearly and trust who You are, not just what I assume about You.",
    actionStep:
      "Read one Gospel chapter slowly and write down one thing Jesus says or does that surprises you.",
    habits: [
      "Read one Gospel chapter each day",
      "Write one sentence about Jesus",
      "Pray before and after reading",
    ],
    reflectionQuestions: [
      "What do I notice about the character of Jesus this week?",
      "How is Jesus different from what I expected?",
    ],
    dailyReadings: [
      { day: "Day 1", reference: "Mark 1", label: "Meet Jesus in action" },
      {
        day: "Day 2",
        reference: "John 1",
        label: "See Jesus as the Word made flesh",
      },
      {
        day: "Day 3",
        reference: "Mark 2",
        label: "Watch how Jesus responds to people",
      },
      {
        day: "Day 4",
        reference: "John 3",
        label: "Hear Jesus explain new birth",
      },
      {
        day: "Day 5",
        reference: "Mark 4",
        label: "Trust Jesus in fear and confusion",
      },
    ],
    checklist: [
      "Read all five daily passages",
      "Write one sentence each day about what Jesus is like",
      "Pray before and after reading at least three times",
      "Share one question you still have about Jesus",
    ],
  },
  {
    week: "Week 2",
    title: "The Gospel and salvation",
    reading: "Romans 3, Romans 5, Ephesians 2",
    focus:
      "See sin, grace, the cross, and salvation by faith in a clear and simple way.",
    memoryVerse: "Ephesians 2:8-9",
    prayerPrompt:
      "Father, thank You that salvation is a gift of grace in Christ, not something I earn by my performance.",
    actionStep:
      "Write the Gospel in your own words using the themes of sin, grace, faith, and new life.",
    habits: [
      "Review one salvation passage each day",
      "Thank God for grace",
      "Ask one honest Gospel question",
    ],
    reflectionQuestions: [
      "What does grace mean in real life, not just in theory?",
      "Where am I tempted to trust myself instead of Christ?",
    ],
    dailyReadings: [
      {
        day: "Day 1",
        reference: "Romans 3",
        label: "Understand the problem of sin",
      },
      {
        day: "Day 2",
        reference: "Romans 5",
        label: "See the love of God in Christ",
      },
      {
        day: "Day 3",
        reference: "Ephesians 2",
        label: "Receive grace by faith",
      },
      {
        day: "Day 4",
        reference: "Luke 15",
        label: "See the Father’s heart toward sinners",
      },
      {
        day: "Day 5",
        reference: "John 10",
        label: "Rest in the security of Jesus",
      },
    ],
    checklist: [
      "Read all five Gospel-and-grace passages",
      "Write the Gospel in your own words",
      "Thank God specifically for grace each day",
      "Ask one salvation question in mentor chat or notes",
    ],
  },
  {
    week: "Week 3",
    title: "Prayer and talking with God",
    reading: "Matthew 6, Psalm 23, Philippians 4",
    focus:
      "Build a daily prayer rhythm with honest prayer, thanksgiving, and dependence on God.",
    memoryVerse: "Philippians 4:6-7",
    prayerPrompt:
      "Lord, teach me to bring my worries, thanks, and needs to You with trust and honesty.",
    actionStep:
      "Set a daily prayer time and save at least one prayer request in your journal this week.",
    habits: [
      "Pray in the morning",
      "Pray from one Psalm",
      "End the day with thanksgiving",
    ],
    reflectionQuestions: [
      "What keeps me from praying honestly?",
      "What changes when I bring anxiety to God instead of carrying it alone?",
    ],
    dailyReadings: [
      {
        day: "Day 1",
        reference: "Matthew 6",
        label: "Learn from the Lord’s Prayer",
      },
      {
        day: "Day 2",
        reference: "Psalm 23",
        label: "Pray trust and dependence",
      },
      {
        day: "Day 3",
        reference: "Philippians 4",
        label: "Bring anxiety to God",
      },
      { day: "Day 4", reference: "Psalm 27", label: "Pray confidence in fear" },
      { day: "Day 5", reference: "Luke 11", label: "Ask, seek, knock" },
    ],
    checklist: [
      "Keep one daily prayer appointment",
      "Save at least one prayer request in the journal",
      "Use one Psalm as a prayer guide",
      "Record one way God met you in prayer this week",
    ],
  },
  {
    week: "Week 4",
    title: "How to read the Bible",
    reading: "James 1, Luke 24, 2 Timothy 3",
    focus:
      "Learn context, observation, application, and how Scripture connects to Scripture.",
    memoryVerse: "2 Timothy 3:16-17",
    prayerPrompt:
      "God, give me understanding as I read Your Word, and help me respond with obedience, not just information.",
    actionStep:
      "Use the pattern observe, interpret, apply on one short passage and write down what you learn.",
    habits: [
      "Ask what the passage says",
      "Notice repeated words",
      "Write one application step",
    ],
    reflectionQuestions: [
      "What does this passage reveal about God?",
      "How should this change the way I live today?",
    ],
    dailyReadings: [
      { day: "Day 1", reference: "James 1", label: "Hear and do the Word" },
      {
        day: "Day 2",
        reference: "Luke 24",
        label: "See Jesus in the Scriptures",
      },
      {
        day: "Day 3",
        reference: "2 Timothy 3",
        label: "Trust Scripture’s purpose",
      },
      { day: "Day 4", reference: "Psalm 119", label: "Love the Word deeply" },
      {
        day: "Day 5",
        reference: "Acts 17",
        label: "Search the Scriptures carefully",
      },
    ],
    checklist: [
      "Use observe, interpret, apply on one passage",
      "Look for repeated words or key ideas twice this week",
      "Write one application step from Scripture",
      "Follow one cross-reference from your reading",
    ],
  },
  {
    week: "Week 5",
    title: "The Holy Spirit and new life",
    reading: "John 14, Romans 8, Galatians 5",
    focus:
      "Understand spiritual growth, conviction, fruit, and what it means to walk with the Spirit.",
    memoryVerse: "Galatians 5:22-23",
    prayerPrompt:
      "Holy Spirit, shape my desires, grow Your fruit in me, and help me walk in step with You.",
    actionStep:
      "Choose one fruit of the Spirit to pray for intentionally each day this week.",
    habits: [
      "Pray for the Spirit’s help",
      "Notice conviction quickly",
      "Practice one fruit intentionally",
    ],
    reflectionQuestions: [
      "Where am I seeing new desires or conviction in my life?",
      "Which fruit of the Spirit do I most need God to grow right now?",
    ],
    dailyReadings: [
      {
        day: "Day 1",
        reference: "John 14",
        label: "Meet the Helper Jesus promised",
      },
      { day: "Day 2", reference: "Romans 8", label: "Walk by the Spirit" },
      {
        day: "Day 3",
        reference: "Galatians 5",
        label: "Study the fruit of the Spirit",
      },
      { day: "Day 4", reference: "Ephesians 4", label: "Put off the old life" },
      { day: "Day 5", reference: "Colossians 3", label: "Put on the new self" },
    ],
    checklist: [
      "Pray for the Spirit’s help each day",
      "Name one fruit you want God to grow",
      "Notice one area of conviction and respond quickly",
      "Write one change you see God beginning in you",
    ],
  },
  {
    week: "Week 6",
    title: "Church, community, and next steps",
    reading: "Acts 2, Hebrews 10, Colossians 3",
    focus:
      "Step into Christian community, worship, service, and a sustainable discipleship rhythm.",
    memoryVerse: "Hebrews 10:24-25",
    prayerPrompt:
      "Lord, place me in healthy Christian community and help me encourage others as I grow.",
    actionStep:
      "Take one concrete step into community: join a group, attend church faithfully, or ask for a mentor.",
    habits: [
      "Show up consistently",
      "Ask for prayer",
      "Serve in one small way",
    ],
    reflectionQuestions: [
      "Who is helping me grow in Christ right now?",
      "What next step into Christian community do I need to take this week?",
    ],
    dailyReadings: [
      {
        day: "Day 1",
        reference: "Acts 2",
        label: "See the life of the early church",
      },
      {
        day: "Day 2",
        reference: "Hebrews 10",
        label: "Stay connected to believers",
      },
      {
        day: "Day 3",
        reference: "Colossians 3",
        label: "Practice Christian community",
      },
      {
        day: "Day 4",
        reference: "1 Corinthians 12",
        label: "Understand the body of Christ",
      },
      {
        day: "Day 5",
        reference: "Romans 12",
        label: "Offer your life in service",
      },
    ],
    checklist: [
      "Read all five community passages",
      "Attend church or a group gathering",
      "Ask one believer for prayer or encouragement",
      "Choose one ongoing next step after the program ends",
    ],
  },
] as ProgramWeek[];

const eachWeekIncludes = [
  "A simple Bible reading plan",
  "Plain-language explanation",
  "Reflection questions for honest response",
  "A short prayer prompt",
  "One practical next step",
];

const coreHabits = [
  {
    title: "Daily Bible time",
    detail:
      "Start with 10-15 minutes a day and focus on consistency before intensity.",
  },
  {
    title: "Simple prayer rhythm",
    detail:
      "Talk to God honestly, use Scripture in prayer, and keep a short list of requests and thanks.",
  },
  {
    title: "Weekly worship and community",
    detail:
      "Learn in the company of other believers, not only alone with your own questions.",
  },
  {
    title: "One next step of obedience",
    detail:
      "Every week should end with one concrete act of trust, not just more information.",
  },
];

const milestones = [
  "Finish your first Gospel reading block",
  "Write your first saved prayer and answered-prayer update",
  "Complete your first memory verse review",
  "Join a group, room, or church pathway for community support",
];

const mentorTopics = [
  "What does it mean to follow Jesus every day?",
  "How do I know I am saved?",
  "What should I do when I do not understand a passage?",
  "How do I pray when I feel stuck or distracted?",
];

const firstThirtyDayGuide = [
  "Days 1-7: meet Jesus in the Gospels and start one honest prayer habit.",
  "Days 8-14: understand grace, salvation, and why the cross matters personally.",
  "Days 15-21: build daily Bible reading, basic observation, and Scripture-based prayer.",
  "Days 22-30: join community, ask questions, and practice one visible act of obedience.",
];

const churchVocabulary = [
  {
    term: "Gospel",
    meaning:
      "The good news that Jesus saves sinners through His life, death, and resurrection.",
  },
  {
    term: "Grace",
    meaning:
      "God's undeserved favor given to us in Christ, not something we earn.",
  },
  {
    term: "Disciple",
    meaning: "A follower of Jesus who learns from Him and obeys Him.",
  },
  {
    term: "Sanctification",
    meaning:
      "The ongoing process of God changing believers to become more like Jesus.",
  },
];

const NEW_BELIEVER_PROGRESS_KEY = "christian-study-guide:new-believer-progress";

interface ProgramProgress {
  programName: string;
  currentWeekIndex: number;
  currentWeekTitle: string;
  completedWeeks: string[];
  completedMilestones: string[];
  reviewedMentorTopics: string[];
  weekChecklists: Record<string, string[]>;
  dailyReadingsCompleted: Record<string, string[]>;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
}

const defaultProgress: ProgramProgress = {
  programName: "New Believer Foundations",
  currentWeekIndex: 0,
  currentWeekTitle: programWeeks[0]?.title || "",
  completedWeeks: [],
  completedMilestones: [],
  reviewedMentorTopics: [],
  weekChecklists: {},
  dailyReadingsCompleted: {},
  status: "not-started",
  startedAt: null,
  completedAt: null,
};

function referenceToHref(reference: string) {
  return `/passage/${reference
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export default function NewBelieversPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [progress, setProgress] = useState<ProgramProgress>(defaultProgress);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getNewBelieverProgress();
          if (data) {
            setProgress({
              programName: data.program_name || defaultProgress.programName,
              currentWeekIndex: data.current_week_index ?? 0,
              currentWeekTitle:
                data.current_week_title || programWeeks[0]?.title || "",
              completedWeeks: data.completed_weeks || [],
              completedMilestones: data.completed_milestones || [],
              reviewedMentorTopics: data.reviewed_mentor_topics || [],
              weekChecklists: data.week_checklists || {},
              dailyReadingsCompleted: data.daily_readings_completed || {},
              status: data.status || "not-started",
              startedAt: data.started_at || null,
              completedAt: data.completed_at || null,
            });
          }
        } else {
          const raw = localStorage.getItem(NEW_BELIEVER_PROGRESS_KEY);
          if (raw) {
            setProgress(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const persistProgress = async (next: ProgramProgress, feedback: string) => {
    setProgress(next);

    if (user) {
      await saveNewBelieverProgress({
        program_name: next.programName,
        current_week_index: next.currentWeekIndex,
        current_week_title: next.currentWeekTitle,
        completed_weeks: next.completedWeeks,
        completed_milestones: next.completedMilestones,
        reviewed_mentor_topics: next.reviewedMentorTopics,
        week_checklists: next.weekChecklists,
        daily_readings_completed: next.dailyReadingsCompleted,
        status: next.status,
        started_at: next.startedAt,
        completed_at: next.completedAt,
      });
    } else {
      localStorage.setItem(NEW_BELIEVER_PROGRESS_KEY, JSON.stringify(next));
    }

    setSaveFeedback(feedback);
    window.setTimeout(() => setSaveFeedback(""), 2200);
  };

  const handleStartProgram = async () => {
    const next: ProgramProgress = {
      ...progress,
      currentWeekIndex: 0,
      currentWeekTitle: programWeeks[0]?.title || "",
      status: "active",
      startedAt: progress.startedAt || new Date().toISOString(),
      completedAt: null,
    };

    await persistProgress(next, "Program started");
  };

  const handleAdvanceWeek = async () => {
    const currentWeek = programWeeks[progress.currentWeekIndex];
    const nextCompletedWeeks = currentWeek
      ? Array.from(new Set([...progress.completedWeeks, currentWeek.title]))
      : progress.completedWeeks;

    const nextWeekIndex = Math.min(
      progress.currentWeekIndex + 1,
      programWeeks.length - 1,
    );
    const completed = progress.currentWeekIndex >= programWeeks.length - 1;

    const next: ProgramProgress = {
      ...progress,
      completedWeeks: nextCompletedWeeks,
      currentWeekIndex: completed ? progress.currentWeekIndex : nextWeekIndex,
      currentWeekTitle: completed
        ? "Program completed"
        : programWeeks[nextWeekIndex]?.title || progress.currentWeekTitle,
      status: completed ? "completed" : "active",
      completedAt: completed ? new Date().toISOString() : null,
      startedAt: progress.startedAt || new Date().toISOString(),
    };

    await persistProgress(
      next,
      completed ? "Program completed" : "Advanced to next week",
    );
  };

  const handleToggleMilestone = async (item: string) => {
    const nextItems = progress.completedMilestones.includes(item)
      ? progress.completedMilestones.filter((entry) => entry !== item)
      : [...progress.completedMilestones, item];

    await persistProgress(
      {
        ...progress,
        completedMilestones: nextItems,
      },
      "Milestones updated",
    );
  };

  const handleToggleMentorTopic = async (item: string) => {
    const nextItems = progress.reviewedMentorTopics.includes(item)
      ? progress.reviewedMentorTopics.filter((entry) => entry !== item)
      : [...progress.reviewedMentorTopics, item];

    await persistProgress(
      {
        ...progress,
        reviewedMentorTopics: nextItems,
      },
      "Mentor topics updated",
    );
  };

  const handleToggleChecklistItem = async (weekTitle: string, item: string) => {
    const currentItems = progress.weekChecklists[weekTitle] || [];
    const nextItems = currentItems.includes(item)
      ? currentItems.filter((entry) => entry !== item)
      : [...currentItems, item];

    await persistProgress(
      {
        ...progress,
        weekChecklists: {
          ...progress.weekChecklists,
          [weekTitle]: nextItems,
        },
      },
      "Weekly checklist updated",
    );
  };

  const handleToggleDailyReading = async (
    weekTitle: string,
    reference: string,
  ) => {
    const currentItems = progress.dailyReadingsCompleted[weekTitle] || [];
    const nextItems = currentItems.includes(reference)
      ? currentItems.filter((entry) => entry !== reference)
      : [...currentItems, reference];

    await persistProgress(
      {
        ...progress,
        dailyReadingsCompleted: {
          ...progress.dailyReadingsCompleted,
          [weekTitle]: nextItems,
        },
      },
      "Daily reading progress updated",
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading new believer program...</div>
      </div>
    );
  }

  const currentWeek =
    programWeeks[progress.currentWeekIndex] || programWeeks[0];
  const currentWeekChecklist = progress.weekChecklists[currentWeek.title] || [];
  const currentWeekReadings =
    progress.dailyReadingsCompleted[currentWeek.title] || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#1e40af] via-[#14532d] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Compass className="h-4 w-4" />
              New believer discipleship program
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              A clear first path for learning to follow Jesus.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              This program gives new believers a simple structure for Scripture,
              prayer, habits, and community so they do not have to guess where
              to start.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Track your discipleship progress
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep your current week, milestone progress, and mentor follow-up
                synced across devices when signed in.
              </p>
            </div>
            {saveFeedback ? (
              <p className="text-sm font-semibold text-emerald-700">
                {saveFeedback}
              </p>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                Status
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {progress.status}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                Current week
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {currentWeek?.week || "Week 1"}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                Weeks completed
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {progress.completedWeeks.length}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                Milestones checked
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {progress.completedMilestones.length}
              </p>
            </article>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStartProgram}
              className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Start program
            </button>
            <button
              type="button"
              onClick={handleAdvanceWeek}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {progress.status === "completed"
                ? "Completed"
                : "Complete current week"}
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <BookOpen className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">
                6-week discipleship path
              </h2>
            </div>
            <div className="mt-6 grid gap-4">
              {programWeeks.map((item) => (
                <article
                  key={item.week}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    {item.week}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  {progress.completedWeeks.includes(item.title) ? (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Completed
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm font-medium text-emerald-700">
                    {item.reading}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.focus}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <CheckCircle2 className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Each week includes</h2>
              </div>
              <div className="mt-6 space-y-3">
                {eachWeekIncludes.map((item) => (
                  <article
                    key={item}
                    className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm leading-6 text-emerald-950"
                  >
                    {item}
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <Milestone className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">
                  Milestones that matter
                </h2>
              </div>
              <div className="mt-6 space-y-3">
                {milestones.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleToggleMilestone(item)}
                    className={`block w-full rounded-2xl border p-4 text-left text-sm leading-6 transition ${
                      progress.completedMilestones.includes(item)
                        ? "border-emerald-300 bg-emerald-100 text-emerald-950"
                        : "border-amber-200 bg-white text-amber-950 hover:bg-amber-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Target className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Current week spotlight</h2>
            </div>
            <div className="mt-6 rounded-3xl border border-blue-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                {currentWeek.week}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                {currentWeek.title}
              </h3>
              <p className="mt-3 text-sm font-medium text-emerald-700">
                {currentWeek.reading}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {currentWeek.focus}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    Memory verse
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {currentWeek.memoryVerse}
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    Action step
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {currentWeek.actionStep}
                  </p>
                </article>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <article className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-900">
                    Prayer prompt
                  </p>
                  <p className="mt-2 text-sm leading-6 text-violet-950">
                    {currentWeek.prayerPrompt}
                  </p>
                </article>
                <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                    Habits to practice
                  </p>
                  <div className="mt-2 space-y-2">
                    {currentWeek.habits.map((habit) => (
                      <p
                        key={habit}
                        className="text-sm leading-6 text-amber-950"
                      >
                        {habit}
                      </p>
                    ))}
                  </div>
                </article>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    Daily readings
                  </p>
                  <div className="mt-4 space-y-3">
                    {currentWeek.dailyReadings.map((entry) => {
                      const completed = currentWeekReadings.includes(
                        entry.reference,
                      );
                      return (
                        <div
                          key={entry.day}
                          className={`rounded-2xl border p-4 ${
                            completed
                              ? "border-emerald-300 bg-emerald-100"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                                {entry.day}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">
                                {entry.reference}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {entry.label}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleDailyReading(
                                  currentWeek.title,
                                  entry.reference,
                                )
                              }
                              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                completed
                                  ? "bg-emerald-700 text-white hover:bg-emerald-800"
                                  : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {completed ? "Done" : "Mark done"}
                            </button>
                          </div>
                          <Link
                            href={referenceToHref(entry.reference)}
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
                          >
                            Open passage
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    Weekly checklist
                  </p>
                  <div className="mt-4 space-y-3">
                    {currentWeek.checklist.map((item) => {
                      const completed = currentWeekChecklist.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() =>
                            handleToggleChecklistItem(currentWeek.title, item)
                          }
                          className={`block w-full rounded-2xl border p-4 text-left text-sm leading-6 transition ${
                            completed
                              ? "border-emerald-300 bg-emerald-100 text-emerald-950"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <CheckCircle2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Questions to talk through this week
              </h2>
            </div>
            <div className="mt-6 space-y-3">
              {currentWeek.reflectionQuestions.map((question) => (
                <article
                  key={question}
                  className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm leading-6 text-emerald-950"
                >
                  {question}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Mentor support for common questions
              </h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {mentorTopics.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleToggleMentorTopic(item)}
                  className={`rounded-2xl border p-5 text-left text-sm leading-6 transition ${
                    progress.reviewedMentorTopics.includes(item)
                      ? "border-emerald-300 bg-emerald-100 text-emerald-950"
                      : "border-violet-200 bg-white text-violet-950 hover:bg-violet-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Heart className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Best next steps after this program
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: "Start the guided path", href: "/paths" },
                { label: "Build a prayer habit", href: "/prayer" },
                { label: "Join group study", href: "/groups" },
                {
                  label: "Continue into foundations courses",
                  href: "/courses",
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-blue-200 bg-white px-5 py-4 text-sm font-semibold text-blue-950 transition hover:bg-blue-100"
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <Heart className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">
                Core habits for the first 30-60 days
              </h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {coreHabits.map((habit) => (
                <article
                  key={habit.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-[#1e40af]">
                    {habit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {habit.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Milestone className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                How this program connects to the rest of the app
              </h2>
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Use Reading Plans for daily Scripture structure after the 6-week program.",
                "Use Prayer Journal to keep an honest record of requests, fears, and answered prayer.",
                "Use Memorize to reinforce one verse each week instead of reading only once.",
                "Use Groups and Community to move from private learning into shared discipleship.",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-amber-200 bg-white p-4 text-sm leading-6 text-amber-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Compass className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">First 30 days roadmap</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {firstThirtyDayGuide.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-7 text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Church vocabulary made simple
              </h2>
            </div>
            <div className="mt-6 space-y-3">
              {churchVocabulary.map((item) => (
                <article
                  key={item.term}
                  className="rounded-2xl border border-violet-200 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-violet-950">
                    {item.term}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.meaning}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Start with the foundations path
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This program works best when it is connected to guided paths,
                prayer, memory work, and community.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/paths"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Open guided paths
                <Target className="h-4 w-4" />
              </Link>
              <Link
                href="/reading-plans"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reading plans
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/memorize"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Memory work
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
