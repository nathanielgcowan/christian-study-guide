import Link from "next/link";
import { ArrowRight, BookMarked, CheckCircle2, Milestone, TimerReset, Trophy } from "lucide-react";

const progressCards = [
  {
    title: "Whole-Bible progress",
    detail: "Track book-by-book and chapter-by-chapter reading from Genesis to Revelation.",
    icon: BookMarked,
  },
  {
    title: "Yearly goals",
    detail: "Follow annual, 90-day, Gospel-first, or custom read-through goals with visible checkpoints.",
    icon: Milestone,
  },
  {
    title: "Recovery flow",
    detail: "Missed days don’t break the journey. Re-entry plans keep people moving instead of quitting.",
    icon: TimerReset,
  },
  {
    title: "Completion moments",
    detail: "Celebrate books completed, testaments finished, and whole-Bible milestones with shareable wins.",
    icon: Trophy,
  },
];

const progressMoments = [
  "Genesis through Deuteronomy marked complete with chapter-level visibility",
  "Psalms and Proverbs tracked as a parallel daily wisdom habit",
  "A yearly read-through that shows today’s assignment and remaining chapters",
  "A comeback flow that turns missed days into a revised plan instead of guilt",
];

export default function ReadingProgressPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Whole-Bible progress tracking
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Let people see their journey through the whole Bible.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              This turns the Bible reader into a real long-term reading system with chapter
              completion, book milestones, yearly goals, and gentle recovery when someone falls behind.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {progressCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <Icon className="h-6 w-6 text-[#1e40af]" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{card.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <BookMarked className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">What this should feel like</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {progressMoments.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Trophy className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Best companion pages</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/bible"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Open Bible reader
              </Link>
              <Link
                href="/reading-plans"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
              >
                Reading plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
