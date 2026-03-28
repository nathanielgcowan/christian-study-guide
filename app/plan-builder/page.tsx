"use client";

import Link from "next/link";
import { ArrowRight, CalendarRange, Compass, Sparkles, Target, Wand2 } from "lucide-react";

const builderPresets = [
  {
    title: "30 days of peace",
    description:
      "Build a plan around anxiety, prayer, trust, and God’s presence in pressure.",
    settings: "Topic • 30 days • Everyday encouragement",
  },
  {
    title: "Life of Jesus intensive",
    description:
      "Focus on the Gospels with a faster pace and weekly coaching checkpoints.",
    settings: "Christ-centered • 21 days • Depth mode",
  },
  {
    title: "Leader prep rhythm",
    description:
      "Create a custom Scripture path for sermon prep, small groups, or youth teaching.",
    settings: "Leadership • 6 weeks • Group-ready",
  },
];

export default function PlanBuilderPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Wand2 className="h-4 w-4" />
              Reading plan builder
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Build a reading plan around the person, not just the passage list.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              Generate custom plans by topic, duration, goal, and spiritual
              season, then pair them with coaching and reflection prompts.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Builder inputs
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                placeholder="Plan theme or need"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
              <input
                placeholder="Duration in days"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
              <input
                placeholder="Audience or stage of life"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
              <input
                placeholder="Reading goal"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </div>
            <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-6 py-4 font-semibold text-white transition hover:bg-[#1e3a8a]">
              <Sparkles className="h-5 w-5" />
              Generate custom plan
            </button>
          </div>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <CalendarRange className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">What this unlocks</h2>
            </div>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-blue-950">
              <li>• Topic-led plan creation for real life struggles</li>
              <li>• Duration-aware pacing for busy users</li>
              <li>• AI coaching summaries at weekly checkpoints</li>
              <li>• Leader-ready plans for small groups and ministries</li>
            </ul>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {builderPresets.map((preset) => (
            <article
              key={preset.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-[#0f172a]">
                {preset.title}
              </h2>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-[#1e40af]">
                {preset.settings}
              </p>
              <p className="mt-4 leading-7 text-slate-600">
                {preset.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Target className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Advanced reading-plan generator</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Build by topic, life season, or spiritual goal",
                "Adjust intensity for busy weeks or depth mode",
                "Create leader-ready plans for groups and ministries",
                "Attach AI coaching checkpoints to each phase",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-medium text-emerald-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Compass className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Generator direction</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              This is the lane for user-specific plan generation, where journeys,
              personalization, and reading-plan coaching all start to work together.
            </p>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link
            href="/reading-plans"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
          >
            Open reading plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
