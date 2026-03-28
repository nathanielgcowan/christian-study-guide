"use client";

import Link from "next/link";
import { ArrowRight, Compass, Heart, Sparkles, Target } from "lucide-react";

const paths = [
  {
    title: "New believer foundations",
    description:
      "A step-by-step discipleship program for learning the Gospel, prayer, Bible reading, and life in Christian community.",
    href: "/new-believers",
    cta: "Start foundations",
  },
  {
    title: "Anxiety and peace",
    description:
      "Start with calming passages, a guided prayer rhythm, and mentor prompts for fear and trust.",
    href: "/topics",
    cta: "Start with peace",
  },
  {
    title: "Prayer habit",
    description:
      "Build a repeatable daily rhythm with prayer journaling, devotionals, and follow-up next steps.",
    href: "/prayer",
    cta: "Build a prayer habit",
  },
  {
    title: "Bible basics",
    description:
      "Learn how to read a passage with context, cross references, key words, and simple explanations.",
    href: "/passage/john-3-16",
    cta: "Learn Bible basics",
  },
  {
    title: "Memory and consistency",
    description:
      "Practice one verse at a time and keep momentum with flashcards, quick reviews, and progress tracking.",
    href: "/memorize",
    cta: "Practice a verse",
  },
];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
            <Compass className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-bold md:text-6xl">
            Start where you actually are.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Choose the kind of help you need most right now, and the app will
            point you toward the right study tools instead of making you figure
            everything out first.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2">
          {paths.map((path, index) => (
            <article
              key={path.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-900">
                Path {index + 1}
              </div>
              <h2 className="text-2xl font-semibold text-[#0f172a]">
                {path.title}
              </h2>
              <p className="mt-3 leading-7 text-slate-600">{path.description}</p>
              <Link
                href={path.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
              >
                {path.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
            <Heart className="h-6 w-6 text-emerald-800" />
            <h3 className="mt-4 text-xl font-semibold text-emerald-950">
              Everyday encouragement
            </h3>
            <p className="mt-3 text-sm leading-6 text-emerald-900">
              For new believers, students, busy parents, and anyone trying to
              stay anchored in Scripture.
            </p>
          </div>
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <Sparkles className="h-6 w-6 text-violet-800" />
            <h3 className="mt-4 text-xl font-semibold text-violet-950">
              Guided AI help
            </h3>
            <p className="mt-3 text-sm leading-6 text-violet-900">
              Use the mentor, devotionals, and topic explorer without needing a
              seminary workflow first.
            </p>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <Target className="h-6 w-6 text-amber-800" />
            <h3 className="mt-4 text-xl font-semibold text-amber-950">
              Clear next steps
            </h3>
            <p className="mt-3 text-sm leading-6 text-amber-900">
              Every path points you to one concrete next action so growth stays
              practical, not abstract.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">
            Custom onboarding tracks
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "New believers",
              "Students",
              "Parents and families",
              "Leaders and ministry teams",
            ].map((track) => (
              <article
                key={track}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-800"
              >
                {track}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <h2 className="text-2xl font-semibold text-blue-950">
            Onboarding that feeds personalization
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Maturity level shapes explanation depth and mentor tone",
              "Tradition preference feeds theology, study notes, and commentary emphasis",
              "Interests and struggles generate the first guided path automatically",
              "Study rhythm sets reminders, dashboard pacing, and memorization cadence",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
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
