"use client";

import { BarChart3, Brain, Flame, TrendingUp } from "lucide-react";

const themeInsights = [
  { label: "Most studied theme", value: "Hope under pressure" },
  { label: "Top mentor topic", value: "Anxiety and trust" },
  { label: "Most revisited book", value: "Romans" },
  { label: "Prayer trend", value: "Family and guidance" },
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <BarChart3 className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Reading Insights Timeline</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            A richer longitudinal view of your study patterns, prayer themes,
            and discipleship momentum over time.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {themeInsights.map((insight) => (
            <article
              key={insight.label}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <TrendingUp className="h-6 w-6 text-[#1e40af]" />
              <p className="mt-4 text-sm font-medium text-slate-600">{insight.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{insight.value}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8">
            <Flame className="h-6 w-6 text-orange-700" />
            <h2 className="mt-4 text-2xl font-semibold text-orange-950">Streak arcs</h2>
            <p className="mt-4 leading-7 text-orange-900">
              Show when consistency rises, dips, and rebounds across months.
            </p>
          </div>
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <Brain className="h-6 w-6 text-violet-700" />
            <h2 className="mt-4 text-2xl font-semibold text-violet-950">Mentor patterns</h2>
            <p className="mt-4 leading-7 text-violet-900">
              Surface recurring struggles, growth themes, and spiritual questions.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <BarChart3 className="h-6 w-6 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-semibold text-emerald-950">Prayer trends</h2>
            <p className="mt-4 leading-7 text-emerald-900">
              Track what categories dominate your prayers and what gets answered.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
