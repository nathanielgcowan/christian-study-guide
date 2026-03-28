"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Award, BookOpen, CheckSquare, GraduationCap, Shield, Sparkles, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  deleteCourseEnrollment,
  getCourseEnrollments,
  saveCourseEnrollment,
  updateCourseEnrollment,
} from "@/lib/persistence";

const COURSE_ENROLLMENTS_KEY = "christian-study-guide:course-enrollments";

const courses = [
  {
    title: "New Believer Foundations",
    category: "foundations",
    summary: "A simple first discipleship course on the Gospel, prayer, Bible reading, church, and daily obedience.",
  },
  {
    title: "Trinity",
    category: "theology",
    summary: "One God in three Persons, with anchor texts, doctrine notes, and short knowledge checks.",
  },
  {
    title: "Salvation",
    category: "gospel",
    summary: "Grace, faith, justification, and assurance structured as a guided doctrine track.",
  },
  {
    title: "Church history",
    category: "history",
    summary: "A beginner-friendly path through the early church, councils, reform, and modern movements.",
  },
  {
    title: "Apologetics",
    category: "defense",
    summary: "A course path for the resurrection, reliability of Scripture, and common worldview questions.",
  },
  {
    title: "Biblical theology",
    category: "deep-study",
    summary: "Trace the storyline of Scripture from creation to new creation with guided connections.",
  },
];

const courseOutcomes = [
  "Know the major biblical texts behind each doctrine",
  "Explain the idea in plain language without drifting from Scripture",
  "Compare major Christian perspectives with humility and clarity",
  "Apply the doctrine to prayer, discipleship, and real-life decisions",
];

const learningFormats = [
  "Short lesson brief",
  "Key verses and cross references",
  "Reflection prompts and mini quiz",
  "Prayer and application step",
];

interface SavedCourseEnrollment {
  id: string;
  title: string;
  category: string;
  progressPercentage: number;
  status: string;
  currentModule: string;
  summary: string;
}

export default function CoursesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [savedCourses, setSavedCourses] = useState<SavedCourseEnrollment[]>([]);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getCourseEnrollments();
          setSavedCourses(
            (data as Array<{
              id: string;
              title: string;
              category: string;
              progress_percentage: number;
              status: string;
              current_module: string | null;
              summary: string;
            }>).map((item) => ({
              id: item.id,
              title: item.title,
              category: item.category,
              progressPercentage: item.progress_percentage,
              status: item.status,
              currentModule: item.current_module || "",
              summary: item.summary,
            })),
          );
        } else {
          const raw = localStorage.getItem(COURSE_ENROLLMENTS_KEY);
          if (raw) setSavedCourses(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleEnroll = async (course: (typeof courses)[number]) => {
    try {
      if (user) {
        const saved = await saveCourseEnrollment({
          title: course.title,
          category: course.category,
          progress_percentage: 0,
          current_module: "Module 1",
          summary: course.summary,
        });

        setSavedCourses((current) => [
          {
            id: saved.id,
            title: saved.title,
            category: saved.category,
            progressPercentage: saved.progress_percentage,
            status: saved.status,
            currentModule: saved.current_module || "",
            summary: saved.summary,
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            title: course.title,
            category: course.category,
            progressPercentage: 0,
            status: "active",
            currentModule: "Module 1",
            summary: course.summary,
          },
          ...savedCourses,
        ];
        setSavedCourses(next);
        localStorage.setItem(COURSE_ENROLLMENTS_KEY, JSON.stringify(next));
      }

      setSaveFeedback(`${course.title} enrolled`);
    } catch {
      setSaveFeedback("Enrollment failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2200);
    }
  };

  const handleAdvanceCourse = async (course: SavedCourseEnrollment) => {
    const nextProgress = Math.min(course.progressPercentage + 25, 100);
    const completed = nextProgress === 100;
    const nextModule = completed
      ? "Course completed"
      : `Module ${Math.min(Math.floor(nextProgress / 25) + 1, 4)}`;

    if (user) {
      await updateCourseEnrollment({
        id: course.id,
        progress_percentage: nextProgress,
        status: completed ? "completed" : "active",
        current_module: nextModule,
      });
    }

    const next = savedCourses.map((item) =>
      item.id === course.id
        ? {
            ...item,
            progressPercentage: nextProgress,
            status: completed ? "completed" : "active",
            currentModule: nextModule,
          }
        : item,
    );
    setSavedCourses(next);

    if (!user) {
      localStorage.setItem(COURSE_ENROLLMENTS_KEY, JSON.stringify(next));
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      if (user) {
        await deleteCourseEnrollment(id);
      }

      const next = savedCourses.filter((course) => course.id !== id);
      setSavedCourses(next);

      if (!user) {
        localStorage.setItem(COURSE_ENROLLMENTS_KEY, JSON.stringify(next));
      }

      setSaveFeedback("Enrollment removed");
    } catch {
      setSaveFeedback("Delete failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2200);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <GraduationCap className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">AI Theology Tutor</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Structured lessons, quizzes, readings, and doctrine tracks for a course-style learning experience.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {courses.map((course, index) => (
            <article
              key={course.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {index % 2 === 0 ? (
                <BookOpen className="h-5 w-5 text-[#1e40af]" />
              ) : (
                <Shield className="h-5 w-5 text-emerald-700" />
              )}
              <p className="mt-4 text-sm font-semibold text-slate-900">{course.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{course.summary}</p>
              <button
                type="button"
                onClick={() => handleEnroll(course)}
                className="mt-5 rounded-2xl bg-[#1e40af] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Enroll
              </button>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-violet-200 bg-violet-50 p-8">
          <div className="flex items-center gap-3 text-violet-950">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Course structure</h2>
          </div>
          <p className="mt-4 leading-7 text-violet-900">
            Each course can combine guided reading paths, theology notes, quizzes,
            apologetics explanations, and progress tracking inside one learning system.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <Target className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">What a strong course should produce</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {courseOutcomes.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <CheckSquare className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Lesson format</h2>
            </div>
            <div className="mt-6 space-y-3">
              {learningFormats.map((item, index) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm leading-6 text-emerald-950"
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">
                    {index + 1}
                  </span>
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-amber-950">
                <Award className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Certificates and completion rewards</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-amber-900">
                Guided paths and theology tracks feel more substantial when users unlock a certificate,
                course badge, or shareable completion card at the end.
              </p>
            </div>
            <Link
              href="/certificates"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
            >
              Open certificates
            </Link>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <GraduationCap className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Recommended learning tracks</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "New believer track: Salvation -> Life of Jesus -> Prayer basics",
              "Leader track: Biblical theology -> Church history -> Apologetics",
              "Doctrine track: Trinity -> Salvation -> Sanctification and assurance",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-6 text-blue-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#0f172a]">Saved enrollments</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Signed-in users can keep course progress synced across devices.
              </p>
            </div>
            {saveFeedback ? (
              <p className="text-sm font-semibold text-emerald-700">{saveFeedback}</p>
            ) : null}
          </div>

          {savedCourses.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              Enroll in a course to start tracking theology and discipleship progress.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {savedCourses.map((course) => (
                <article
                  key={course.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                        {course.category} • {course.status}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {course.progressPercentage < 100 ? (
                        <button
                          type="button"
                          onClick={() => handleAdvanceCourse(course)}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white"
                        >
                          Advance
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="rounded-xl border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{course.summary}</p>
                  <div className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold text-slate-900">Current module:</span>{" "}
                      {course.currentModule || "Module 1"}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">Progress:</span>{" "}
                      {course.progressPercentage}%
                    </p>
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
