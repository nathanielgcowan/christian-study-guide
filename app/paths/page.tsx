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
  getWorkflowRuns,
  saveGuidedPath,
  saveWorkflowRun,
  updateGuidedPath,
  updateWorkflowRun,
} from "../../lib/persistence";

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
  {
    title: "Checkpoint unlocked",
    detail:
      "Finish a week and watch the next node light up on the journey map.",
  },
  {
    title: "Boss level revealed",
    detail:
      "End-of-path capstones feel like big moments instead of quiet checkboxes.",
  },
  {
    title: "Reward drop",
    detail:
      "Each milestone can unlock XP, badges, or a shareable celebration card.",
  },
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

interface WorkflowRun {
  id: string;
  workflowName: string;
  linkedReference: string;
  stage: string;
  status: string;
  summary: string;
  nextStep: string;
  output: Record<string, unknown> | null;
}

export default function GuidedPathsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedPaths, setSavedPaths] = useState<SavedGuidedPath[]>([]);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [customDraft, setCustomDraft] = useState({
    title: "",
    pathType: "guided-study",
    cadence: "weekly",
    summary: "",
    currentWeek: "",
    currentFocus: "",
  });
  const [pathEdits, setPathEdits] = useState<
    Record<
      string,
      {
        currentWeek: string;
        currentFocus: string;
        status: string;
      }
    >
  >({});
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const [data, workflowData] = await Promise.all([
            getGuidedPaths(),
            getWorkflowRuns(),
          ]);
          setSavedPaths(
            (
              data as Array<{
                id: string;
                title: string;
                path_type: string;
                cadence: string;
                summary: string;
                current_week: string | null;
                current_focus: string | null;
                status: string;
              }>
            ).map((item) => ({
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
          setWorkflowRuns(
            (
              workflowData as Array<{
                id: string;
                workflow_name: string;
                linked_reference: string | null;
                stage: string;
                status: string;
                summary: string;
                next_step: string | null;
                output: Record<string, unknown> | null;
              }>
            )
              .filter((item) => item.workflow_name === "guided-path")
              .map((item) => ({
                id: item.id,
                workflowName: item.workflow_name,
                linkedReference: item.linked_reference || "",
                stage: item.stage,
                status: item.status,
                summary: item.summary,
                nextStep: item.next_step || "",
                output: item.output,
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

  useEffect(() => {
    setPathEdits(
      savedPaths.reduce<
        Record<
          string,
          { currentWeek: string; currentFocus: string; status: string }
        >
      >((accumulator, path) => {
        accumulator[path.id] = {
          currentWeek: path.currentWeek,
          currentFocus: path.currentFocus,
          status: path.status,
        };
        return accumulator;
      }, {}),
    );
  }, [savedPaths]);

  const findLinkedWorkflow = (path: { id: string; title: string }) =>
    workflowRuns.find((run) => {
      const outputPathId =
        run.output && typeof run.output.path_id === "string"
          ? run.output.path_id
          : null;

      return outputPathId === path.id || run.linkedReference === path.title;
    });

  const pushWorkflowRun = (workflow: {
    id: string;
    workflow_name: string;
    linked_reference: string | null;
    stage: string;
    status: string;
    summary: string;
    next_step: string | null;
    output: Record<string, unknown> | null;
  }) => {
    setWorkflowRuns((current) => {
      const nextItem: WorkflowRun = {
        id: workflow.id,
        workflowName: workflow.workflow_name,
        linkedReference: workflow.linked_reference || "",
        stage: workflow.stage,
        status: workflow.status,
        summary: workflow.summary,
        nextStep: workflow.next_step || "",
        output: workflow.output,
      };

      const existingIndex = current.findIndex(
        (item) => item.id === workflow.id,
      );
      if (existingIndex === -1) {
        return [nextItem, ...current];
      }

      return current.map((item) => (item.id === workflow.id ? nextItem : item));
    });
  };

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

        const workflow = await saveWorkflowRun({
          workflow_name: "guided-path",
          linked_reference: saved.title,
          stage: saved.current_week || "week-1",
          status: saved.status,
          summary: `${saved.title} is active with a ${saved.cadence} cadence and a current focus on ${saved.current_focus || saved.title}.`,
          next_step:
            "Complete the current week and update the next focus checkpoint.",
          output: {
            path_id: saved.id,
            path_type: saved.path_type,
            cadence: saved.cadence,
          },
        });

        pushWorkflowRun(workflow);
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

  const handleSaveCustomPath = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!customDraft.title.trim() || !customDraft.summary.trim()) return;

    try {
      if (user) {
        const saved = await saveGuidedPath({
          title: customDraft.title,
          path_type: customDraft.pathType,
          cadence: customDraft.cadence,
          summary: customDraft.summary,
          current_week: customDraft.currentWeek || "Week 1",
          current_focus: customDraft.currentFocus || customDraft.title,
          status: "active",
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

        const workflow = await saveWorkflowRun({
          workflow_name: "guided-path",
          linked_reference: saved.title,
          stage: saved.current_week || "Week 1",
          status: saved.status,
          summary: `${saved.title} was created as a custom guided path.`,
          next_step:
            "Open the path in Today or update the next focus checkpoint.",
          output: {
            path_id: saved.id,
            path_type: saved.path_type,
            cadence: saved.cadence,
            source: "custom",
          },
        });

        pushWorkflowRun(workflow);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            title: customDraft.title,
            pathType: customDraft.pathType,
            cadence: customDraft.cadence,
            summary: customDraft.summary,
            currentWeek: customDraft.currentWeek || "Week 1",
            currentFocus: customDraft.currentFocus || customDraft.title,
            status: "active",
          },
          ...savedPaths,
        ];
        setSavedPaths(next);
        localStorage.setItem(GUIDED_PATHS_KEY, JSON.stringify(next));
      }

      setCustomDraft({
        title: "",
        pathType: "guided-study",
        cadence: "weekly",
        summary: "",
        currentWeek: "",
        currentFocus: "",
      });
      setSaveFeedback("Custom path saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2200);
    }
  };

  const handleCompletePath = async (id: string) => {
    const target = savedPaths.find((path) => path.id === id);
    if (!target) return;

    if (user) {
      await updateGuidedPath({
        id,
        current_week: "Completed",
        current_focus: "Path completed",
        status: "completed",
      });

      const linkedWorkflow = findLinkedWorkflow(target);
      if (linkedWorkflow) {
        const updatedWorkflow = await updateWorkflowRun({
          id: linkedWorkflow.id,
          stage: "completed",
          status: "completed",
          next_step: "Celebrate the completion and recommend the next path.",
          output: {
            ...(linkedWorkflow.output || {}),
            path_id: target.id,
            completed: true,
          },
        });
        pushWorkflowRun(updatedWorkflow);
      }
    }

    const next = savedPaths.map((path) =>
      path.id === id
        ? {
            ...path,
            currentWeek: "Completed",
            currentFocus: "Path completed",
            status: "completed",
          }
        : path,
    );
    setSavedPaths(next);

    if (!user) {
      localStorage.setItem(GUIDED_PATHS_KEY, JSON.stringify(next));
    }
  };

  const handleUpdatePath = async (path: SavedGuidedPath) => {
    const edit = pathEdits[path.id];
    if (!edit) return;

    try {
      if (user) {
        await updateGuidedPath({
          id: path.id,
          current_week: edit.currentWeek,
          current_focus: edit.currentFocus,
          status: edit.status,
        });

        const linkedWorkflow = findLinkedWorkflow(path);
        if (linkedWorkflow) {
          const updatedWorkflow = await updateWorkflowRun({
            id: linkedWorkflow.id,
            stage: edit.currentWeek || "checkpoint-updated",
            status: edit.status,
            next_step:
              edit.status === "completed"
                ? "Recommend a follow-up path or a reading plan."
                : "Continue the next focus and update progress after the next session.",
            output: {
              ...(linkedWorkflow.output || {}),
              path_id: path.id,
              current_focus: edit.currentFocus,
            },
          });
          pushWorkflowRun(updatedWorkflow);
        } else {
          const createdWorkflow = await saveWorkflowRun({
            workflow_name: "guided-path",
            linked_reference: path.title,
            stage: edit.currentWeek || "checkpoint-updated",
            status: edit.status,
            summary: `${path.title} progress was updated.`,
            next_step:
              edit.status === "completed"
                ? "Recommend a follow-up path or a reading plan."
                : "Continue the next focus and update progress after the next session.",
            output: {
              path_id: path.id,
              current_focus: edit.currentFocus,
              cadence: path.cadence,
            },
          });
          pushWorkflowRun(createdWorkflow);
        }
      }

      const next = savedPaths.map((item) =>
        item.id === path.id
          ? {
              ...item,
              currentWeek: edit.currentWeek,
              currentFocus: edit.currentFocus,
              status: edit.status,
            }
          : item,
      );
      setSavedPaths(next);

      if (!user) {
        localStorage.setItem(GUIDED_PATHS_KEY, JSON.stringify(next));
      }

      setSaveFeedback("Path progress updated");
    } catch {
      setSaveFeedback("Update failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2200);
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
              Duolingo for Bible understanding, built around Scripture and
              discipleship.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Instead of random reading, the app builds a step-by-step learning
              path around each user&apos;s maturity, interests, study rhythm,
              and spiritual goals.
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
              <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">
                {path.title}
              </h2>
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

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#0f172a]">
                Create a custom guided path
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Build your own discipleship track with a cadence, a current
                checkpoint, and a present focus that can be updated across
                devices.
              </p>
            </div>
            {saveFeedback ? (
              <p className="text-sm font-semibold text-emerald-700">
                {saveFeedback}
              </p>
            ) : null}
          </div>

          <form
            onSubmit={handleSaveCustomPath}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <input
              value={customDraft.title}
              onChange={(event) =>
                setCustomDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Path title"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <select
              value={customDraft.pathType}
              onChange={(event) =>
                setCustomDraft((current) => ({
                  ...current,
                  pathType: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="guided-study">Guided study</option>
              <option value="new-believer">New believer</option>
              <option value="leadership">Leadership</option>
              <option value="family">Family</option>
              <option value="apologetics">Apologetics</option>
            </select>
            <select
              value={customDraft.cadence}
              onChange={(event) =>
                setCustomDraft((current) => ({
                  ...current,
                  cadence: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="flex">Flexible</option>
            </select>
            <input
              value={customDraft.currentWeek}
              onChange={(event) =>
                setCustomDraft((current) => ({
                  ...current,
                  currentWeek: event.target.value,
                }))
              }
              placeholder="Current checkpoint"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <input
              value={customDraft.currentFocus}
              onChange={(event) =>
                setCustomDraft((current) => ({
                  ...current,
                  currentFocus: event.target.value,
                }))
              }
              placeholder="Current focus"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af] md:col-span-2"
            />
            <textarea
              value={customDraft.summary}
              onChange={(event) =>
                setCustomDraft((current) => ({
                  ...current,
                  summary: event.target.value,
                }))
              }
              rows={4}
              placeholder="Summarize the discipleship goal for this path"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af] md:col-span-2"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a] md:col-span-2"
            >
              Save custom path
            </button>
          </form>
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
              Add streaks, XP points, achievements, and completed study courses
              so the path feels like a real journey of growth instead of a
              static reading plan.
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
              Unlock the next lesson after each completed step so Bible learning
              feels progressive instead of static.
            </p>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Award className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Path completion rewards
              </h2>
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
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-blue-900">
            A visual path gives guided learning more momentum. It helps users
            feel like they are traveling through Scripture with milestones, not
            just managing a list.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#0f172a]">
                Saved guided paths
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep your discipleship tracks across devices when you&apos;re
                signed in.
              </p>
            </div>
            {saveFeedback ? (
              <p className="text-sm font-semibold text-emerald-700">
                {saveFeedback}
              </p>
            ) : null}
          </div>

          {savedPaths.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              Save a guided path to start building a personalized Bible learning
              journey.
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
                      <h3 className="text-lg font-semibold text-slate-900">
                        {path.title}
                      </h3>
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
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {path.summary}
                  </p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-700">
                    <input
                      value={pathEdits[path.id]?.currentWeek || ""}
                      onChange={(event) =>
                        setPathEdits((current) => ({
                          ...current,
                          [path.id]: {
                            currentWeek: event.target.value,
                            currentFocus: current[path.id]?.currentFocus || "",
                            status: current[path.id]?.status || path.status,
                          },
                        }))
                      }
                      placeholder="Current week"
                      className="rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-[#1e40af]"
                    />
                    <input
                      value={pathEdits[path.id]?.currentFocus || ""}
                      onChange={(event) =>
                        setPathEdits((current) => ({
                          ...current,
                          [path.id]: {
                            currentWeek: current[path.id]?.currentWeek || "",
                            currentFocus: event.target.value,
                            status: current[path.id]?.status || path.status,
                          },
                        }))
                      }
                      placeholder="Current focus"
                      className="rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-[#1e40af]"
                    />
                    <select
                      value={pathEdits[path.id]?.status || path.status}
                      onChange={(event) =>
                        setPathEdits((current) => ({
                          ...current,
                          [path.id]: {
                            currentWeek: current[path.id]?.currentWeek || "",
                            currentFocus: current[path.id]?.currentFocus || "",
                            status: event.target.value,
                          },
                        }))
                      }
                      className="rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-[#1e40af]"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => void handleUpdatePath(path)}
                      className="rounded-xl border border-blue-300 px-3 py-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                    >
                      Save progress
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Map className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">
              Guided path operations trail
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-900">
            Signed-in path creation and progress updates now record workflow
            runs so your discipleship tracks can be managed like real ongoing
            programs.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {workflowRuns.length > 0 ? (
              workflowRuns.map((run) => (
                <article
                  key={run.id}
                  className="rounded-2xl border border-blue-200 bg-white p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {run.stage} • {run.status}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {run.linkedReference || "Guided path workflow"}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {run.summary}
                  </p>
                  <p className="mt-3 text-sm font-medium text-blue-950">
                    Next: {run.nextStep || "No next step saved yet."}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-blue-300 bg-white p-5 text-sm text-blue-950">
                Save or update a guided path while signed in to start the
                operations trail.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
