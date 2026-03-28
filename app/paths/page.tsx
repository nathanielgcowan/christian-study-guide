"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  Flame,
  GraduationCap,
  Map,
  Sparkles,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  deleteGuidedPath,
  getGuidedPaths,
  saveGuidedPath,
  updateGuidedPath,
} from "@/lib/persistence";

const GUIDED_PATHS_KEY = "christian-study-guide:guided-paths";

const onboardingPrompts = [
  "Are you a new Christian?",
  "What topics interest you most?",
  "How often do you study?",
  "Do you want theology, devotional study, or deep study?",
];

const learningPaths = [
  {
    title: "Understand the Gospel",
    audience: "Foundations",
    weeks: [
      "Week 1: The Problem of Sin • Romans 3",
      "Week 2: Why Jesus Died • Isaiah 53",
      "Week 3: Salvation by Faith • Ephesians 2",
      "Week 4: New Life in Christ • Romans 8",
    ],
  },
  {
    title: "Spiritual Warfare Path",
    audience: "Deep Study",
    weeks: [
      "Week 1: The Reality of Spiritual Warfare • Ephesians 6",
      "Week 2: Authority of Christ • Colossians 2",
      "Week 3: Resisting the Devil • James 4",
      "Week 4: Prayer and Spiritual Protection • Psalms and Epistles",
    ],
  },
  {
    title: "Life of Jesus",
    audience: "Course Track",
    weeks: [
      "Week 1: Birth and identity of Christ",
      "Week 2: Ministry and miracles",
      "Week 3: Crucifixion and atonement",
      "Week 4: Resurrection and mission",
    ],
  },
  {
    title: "New Believer Foundations",
    audience: "New Believers",
    weeks: [
      "Week 1: Who Jesus Is • Mark 1 and John 1",
      "Week 2: The Gospel and Salvation • Romans 3 and Ephesians 2",
      "Week 3: Prayer and Trust • Matthew 6 and Psalm 23",
      "Week 4: Bible Reading and Community • James 1 and Acts 2",
    ],
  },
];

const studyStepBlocks = [
  "Bible reading",
  "AI explanation",
  "Reflection questions",
  "Short quiz",
  "Prayer prompt",
];

const badges = ["Bible Beginner", "Gospel Explorer", "Romans Scholar"];
const guidedMapSteps = ["Start", "Week 1", "Week 2", "Week 3", "Boss level"];
const animatedMapMoments = [
  { title: "Checkpoint unlocked", detail: "Finish a week and watch the next node light up on the journey map." },
  { title: "Boss level revealed", detail: "End-of-path capstones feel like big moments instead of quiet checkboxes." },
  { title: "Reward drop", detail: "Each milestone can unlock XP, badges, or a shareable celebration card." },
];

interface SavedGuidedPath {
  id: string;
  title: string;
  pathType: string;
  cadence: string;
  summary: string;
  currentWeek: string;
  currentFocus: string;
  status: string;
}

export default function GuidedPathsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedPaths, setSavedPaths] = useState<SavedGuidedPath[]>([]);
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
          const data = await getGuidedPaths();
          setSavedPaths(
            (data as Array<{
              id: string;
              title: string;
              path_type: string;
              cadence: string;
              summary: string;
              current_week: string | null;
              current_focus: string | null;
              status: string;
            }>).map((item) => ({
              id: item.id,
              title: item.title,
              pathType: item.path_type,
              cadence: item.cadence,
              summary: item.summary,
              currentWeek: item.current_week || "",
              currentFocus: item.current_focus || "",
              status: item.status,
            })),
          );
        } else {
          const raw = localStorage.getItem(GUIDED_PATHS_KEY);
          if (raw) setSavedPaths(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSavePath = async (path: (typeof learningPaths)[number]) => {
    const currentWeek = path.weeks[0] || "";
    const currentFocus = currentWeek.split("•")[1]?.trim() || path.title;
    const summary = `${path.title} gives a ${path.audience.toLowerCase()} path through ${path.weeks.length} guided weeks of study, reflection, and prayer.`;

    try {
      if (user) {
        const saved = await saveGuidedPath({
          title: path.title,
          path_type: path.audience.toLowerCase().replace(/\s+/g, "-"),
          cadence: "weekly",
          summary,
          current_week: currentWeek,
          current_focus: currentFocus,
        });

        setSavedPaths((current) => [
          {
            id: saved.id,
            title: saved.title,
            pathType: saved.path_type,
            cadence: saved.cadence,
            summary: saved.summary,
            currentWeek: saved.current_week || "",
            currentFocus: saved.current_focus || "",
            status: saved.status,
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            title: path.title,
            pathType: path.audience.toLowerCase().replace(/\s+/g, "-"),
            cadence: "weekly",
            summary,
            currentWeek,
            currentFocus,
            status: "active",
          },
          ...savedPaths,
        ];
        setSavedPaths(next);
        localStorage.setItem(GUIDED_PATHS_KEY, JSON.stringify(next));
      }

      setSaveFeedback(`${path.title} saved`);
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2200);
    }
  };

  const handleCompletePath = async (id: string) => {
    if (user) {
      await updateGuidedPath({
        id,
        current_week: "Completed",
        current_focus: "Path completed",
        status: "completed",
      });
    }

    const next = savedPaths.map((path) =>
      path.id === id
        ? { ...path, currentWeek: "Completed", currentFocus: "Path completed", status: "completed" }
        : path,
    );
    setSavedPaths(next);

    if (!user) {
      localStorage.setItem(GUIDED_PATHS_KEY, JSON.stringify(next));
    }
  };

  const handleDeletePath = async (id: string) => {
    try {
      if (user) {
        await deleteGuidedPath(id);
      }

      const next = savedPaths.filter((path) => path.id !== id);
      setSavedPaths(next);

      if (!user) {
        localStorage.setItem(GUIDED_PATHS_KEY, JSON.stringify(next));
      }

      setSaveFeedback("Path removed");
    } catch {
      setSaveFeedback("Delete failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2200);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading guided paths...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <BrainCircuit className="h-4 w-4" />
              AI guided Bible study path
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Duolingo for Bible understanding, built around Scripture and discipleship.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Instead of random reading, the app builds a step-by-step learning path
              around each user&apos;s maturity, interests, study rhythm, and spiritual goals.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Target className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Personalized intake</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {onboardingPrompts.map((prompt) => (
                <article
                  key={prompt}
                  className="rounded-2xl border border-violet-200 bg-white p-5 text-sm font-medium text-violet-950"
                >
                  {prompt}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Every step includes</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {studyStepBlocks.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-medium text-emerald-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {learningPaths.map((path) => (
            <article
              key={path.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                {path.audience}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">{path.title}</h2>
              <div className="mt-5 grid gap-3">
                {path.weeks.map((week) => (
                  <article
                    key={week}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                  >
                    {week}
                  </article>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleSavePath(path)}
                className="mt-6 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save path
              </button>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Flame className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Gamified growth</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {badges.map((badge) => (
                <article
                  key={badge}
                  className="rounded-2xl border border-amber-200 bg-white p-5 text-center text-sm font-semibold text-amber-950"
                >
                  {badge}
                </article>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-amber-900">
              Add streaks, XP points, achievements, and completed study courses so
              the path feels like a real journey of growth instead of a static reading plan.
            </p>
          </div>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <GraduationCap className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Best companion pages</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/study-workspace"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Open study workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-2xl border border-blue-300 px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-100"
              >
                Open courses
                <BookOpen className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Map className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Guided learning map</h2>
            </div>
            <div className="mt-6 grid grid-cols-5 gap-3">
              {guidedMapSteps.map((step, index) => (
                <article
                  key={step}
                  className={`rounded-2xl p-4 text-center text-sm font-semibold ${
                    index < 2
                      ? "bg-[#1e40af] text-white"
                      : "border border-violet-200 bg-white text-violet-950"
                  }`}
                >
                  {step}
                </article>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-violet-900">
              Unlock the next lesson after each completed step so Bible learning feels progressive instead of static.
            </p>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Award className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Path completion rewards</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Unlock a completion badge",
                "Reveal a boss-level capstone quiz",
                "Grant XP for every finished week",
                "Add the path to a trophy shelf",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-medium text-emerald-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-blue-950">
            <Map className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Animated progress map</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {animatedMapMoments.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-blue-200 bg-blue-50 p-5"
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-blue-900">
            A visual path gives guided learning more momentum. It helps users feel like
            they are traveling through Scripture with milestones, not just managing a list.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#0f172a]">Saved guided paths</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep your discipleship tracks across devices when you&apos;re signed in.
              </p>
            </div>
            {saveFeedback ? (
              <p className="text-sm font-semibold text-emerald-700">{saveFeedback}</p>
            ) : null}
          </div>

          {savedPaths.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              Save a guided path to start building a personalized Bible learning journey.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {savedPaths.map((path) => (
                <article
                  key={path.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{path.title}</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                        {path.cadence} cadence • {path.status}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {path.status !== "completed" ? (
                        <button
                          type="button"
                          onClick={() => handleCompletePath(path.id)}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white"
                        >
                          Mark complete
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDeletePath(path.id)}
                        className="rounded-xl border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{path.summary}</p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-700">
                    <div className="rounded-xl bg-white p-3">
                      <span className="font-semibold text-slate-900">Current week:</span> {path.currentWeek || "Not started"}
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <span className="font-semibold text-slate-900">Current focus:</span> {path.currentFocus || "Choose your next reading"}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
