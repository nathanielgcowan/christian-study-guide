"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  BookOpenText,
  BrainCircuit,
  CheckCircle2,
  Flame,
  HeartHandshake,
  Sparkles,
  Target,
  TimerReset,
} from "lucide-react";

const todayMoments = [
  {
    title: "Read",
    detail: "James 1:2-4 with a short context note and one thing to notice.",
    icon: BookOpenText,
    href: "/passage/james-1-2-4",
  },
  {
    title: "Reflect",
    detail: "Write one honest response to a guided question instead of guessing what to do next.",
    icon: BrainCircuit,
    href: "/study",
  },
  {
    title: "Pray",
    detail: "Use a structured prayer prompt anchored to what you just read.",
    icon: HeartHandshake,
    href: "/prayer",
  },
  {
    title: "Review",
    detail: "Practice one memory verse and close the day with one visible win.",
    icon: Target,
    href: "/memorize",
  },
];

const dailyJourney = [
  "Open one passage instead of deciding where to start.",
  "Read a short explanation that stays anchored to context.",
  "Respond with one reflection and one prayer.",
  "Review one memory verse before leaving the app.",
  "Finish one challenge so growth feels concrete.",
];

const persistenceMoments = [
  "Completed steps saved across devices",
  "Missed-day recovery instead of streak shame",
  "Daily flow reopened exactly where the user left off",
  "Reminder timing tied to unfinished steps",
];

export default function TodayPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Structured daily journey
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Know exactly what to do with Scripture today.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              One reading, one reflection, one prayer, one memory review, and one challenge
              that moves the habit loop forward without making the app feel noisy.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {todayMoments.map((moment) => {
            const Icon = moment.icon;
            return (
              <Link
                key={moment.title}
                href={moment.href}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Icon className="h-6 w-6 text-[#1e40af]" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{moment.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{moment.detail}</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Flame className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Daily flow that actually helps</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {dailyJourney.map((step) => (
                <article
                  key={step}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
                >
                  {step}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <BellRing className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Best companion systems</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-7 text-emerald-900">
              <p>• Daily reminders that open straight into the next study step</p>
              <p>• Guided paths that feed the passage of the day</p>
              <p>• Prayer prompts tied to what the user actually read</p>
              <p>• Memory review that feels like a natural close to quiet time</p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
            >
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <CheckCircle2 className="h-6 w-6 text-emerald-700" />
            <h2 className="text-2xl font-semibold">A better habit loop</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            Most people do not need more Bible features before breakfast. They need a clear
            starting point, a guided next step, and a small sense of completion. This page is
            the product version of that idea.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <TimerReset className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Persistent today flow</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {persistenceMoments.map((item) => (
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
