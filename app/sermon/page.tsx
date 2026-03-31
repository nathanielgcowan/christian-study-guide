"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Lightbulb,
  MessageSquare,
  Mic2,
  NotebookPen,
  Sparkles,
  Users2,
} from "lucide-react";
import { sermonCompanionModes } from "../../lib/product-expansion";

const sermonBlocks = [
  "Title",
  "Main points",
  "Illustrations",
  "Discussion questions",
  "Prayer",
];

const modePresets = {
  listener: {
    label: "Listener mode",
    summary:
      "Capture the message in a way that helps one person listen well, pray honestly, and leave with one clear response.",
    output: [
      "Big idea: Trials can become places where God matures faith rather than evidence that He left us.",
      "Takeaway: Endurance grows when we stay under the Word instead of only asking to escape pressure.",
      "Prayer: Lord, make me steadfast in the trial I am carrying this week.",
    ],
  },
  leader: {
    label: "Leader mode",
    summary:
      "Turn the sermon into a small-group follow-up flow with text observation, discussion, and prayer application.",
    output: [
      "Open with James 1:2-4 and ask what sounds impossible in the passage at first reading.",
      "Discussion: What is the difference between pretending joy and counting trials through faith?",
      "Prayer prompt: Where does our group need steadfastness instead of quick relief?",
    ],
  },
  family: {
    label: "Family mode",
    summary:
      "Translate the sermon into a simpler household rhythm for parents, kids, and shared conversation after church.",
    output: [
      "Family question: What hard thing this week needs God's help instead of only our frustration?",
      "Kid-friendly summary: God uses hard days to help us trust Him and keep growing.",
      "Practice: Each person names one challenge and one prayer before dinner.",
    ],
  },
};

export default function SermonPage() {
  const [mode, setMode] = useState<keyof typeof modePresets>("listener");

  const activeMode = useMemo(() => modePresets[mode], [mode]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] via-[#0f172a] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Mic2 className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">
            AI Sermon & Study Builder
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            Build sermons, youth lessons, family devotions, and leader-ready
            studies from one passage.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-5">
          {sermonBlocks.map((block, index) => (
            <article
              key={block}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {index === 0 && <BookOpen className="h-5 w-5 text-[#1e40af]" />}
              {index === 1 && <Sparkles className="h-5 w-5 text-violet-700" />}
              {index === 2 && <Lightbulb className="h-5 w-5 text-amber-700" />}
              {index === 3 && (
                <MessageSquare className="h-5 w-5 text-emerald-700" />
              )}
              {index === 4 && <Mic2 className="h-5 w-5 text-[#7c2d12]" />}
              <p className="mt-4 text-sm font-semibold text-slate-900">
                {block}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Mic2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Sermon companion workspace
              </h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-emerald-900">
              Paste a sermon title or passage, choose the audience, and generate
              the right note structure instead of rebuilding the same prep flow
              every week.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {Object.entries(modePresets).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setMode(key as keyof typeof modePresets)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    mode === key
                      ? "bg-[#14532d] text-white"
                      : "bg-white text-emerald-950 hover:bg-emerald-100"
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                {activeMode.label}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {activeMode.summary}
              </p>
              <div className="mt-5 space-y-3">
                {activeMode.output.map((item) => (
                  <article
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Users2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Church-ready outputs</h2>
            </div>
            <div className="mt-6 space-y-3">
              {sermonCompanionModes.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-amber-200 bg-white p-4"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-amber-950">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <NotebookPen className="h-6 w-6 text-[#1e40af]" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Source-aware notes
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Keep Scripture text, sermon observations, and AI-generated
              follow-up clearly separated so leaders know what is primary.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <MessageSquare className="h-6 w-6 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Discussion flow
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Generate one observation question, one application question, and
              one prayer transition that carry the sermon into the room.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <Lightbulb className="h-6 w-6 text-amber-700" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Midweek follow-up
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Package the message into one recap, one family prompt, one
              reading, and one pastoral encouragement during the week.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
