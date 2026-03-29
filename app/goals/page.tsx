import { CheckCircle2, Flame, Goal, Target } from "lucide-react";

const goals = [
  { title: "Study 4 times a week", progress: 75, cue: "3 of 4 complete" },
  { title: "Memorize 2 verses this month", progress: 50, cue: "1 of 2 complete" },
  { title: "Pray daily for 10 minutes", progress: 86, cue: "6-day streak" },
];

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Goal className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Goal Tracking</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Turn spiritual intentions into visible goals with momentum, streaks,
            and completion feedback.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {goals.map((goal) => (
            <article
              key={goal.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Target className="h-6 w-6 text-[#1e40af]" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {goal.title}
              </h2>
              <p className="mt-3 text-sm font-semibold text-slate-600">{goal.cue}</p>
              <div className="mt-5 h-3 w-full rounded-full bg-slate-200">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#1e40af] to-emerald-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#1e40af]">
                {goal.progress}% complete
              </p>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Flame className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Momentum engine</h2>
            </div>
            <p className="mt-4 leading-7 text-amber-950">
              Tie goals into streaks, reading plans, prayer habits, and verse
              memory so growth feels measurable.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <CheckCircle2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Goal completion logic</h2>
            </div>
            <p className="mt-4 leading-7 text-emerald-950">
              Connect goals to actual app events like saved sessions, mentor
              follow-through, and prayer consistency.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
