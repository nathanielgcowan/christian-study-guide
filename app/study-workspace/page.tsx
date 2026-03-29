import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  MessageSquareQuote,
  NotebookTabs,
  Sparkles,
} from "lucide-react";

const workspaceColumns = [
  {
    title: "Left panel",
    bullets: ["Bible text", "Verse highlighting", "Reading controls"],
  },
  {
    title: "Center panel",
    bullets: ["AI explanation", "Themes", "Commentary and context"],
  },
  {
    title: "Right panel",
    bullets: ["Notes", "Cross references", "Questions and saved insights"],
  },
];

export default function StudyWorkspacePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <NotebookTabs className="h-4 w-4" />
              AI Bible study workspace
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              A serious study dashboard, not just a chat box.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              This workspace direction turns a passage into a multi-panel study experience
              with Scripture, anchored explanation, notes, and connected questions.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-3">
          {workspaceColumns.map((column) => (
            <article
              key={column.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-[#0f172a]">{column.title}</h2>
              <div className="mt-5 grid gap-3">
                {column.bullets.map((item) => (
                  <article
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800"
                  >
                    {item}
                  </article>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <BrainCircuit className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Anchored AI</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              The AI layer should stay anchored to immediate context, related verses,
              and historical background so it explains Scripture instead of drifting
              into generic encouragement.
            </p>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Best connected pages</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/passage/romans-8"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Open sample passage
                <BookOpen className="h-4 w-4" />
              </Link>
              <Link
                href="/mentor-chat"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
              >
                Open mentor thread
                <MessageSquareQuote className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <BrainCircuit className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Real AI passage generation</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Generate explanation, devotional, prayer, and quiz from one passage source",
              "Let users refine the output instead of starting from scratch every time",
              "Keep the text, context, and notes visible while generation happens",
              "Save the best outputs back into the study workflow for later use",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
              >
                {item}
              </article>
            ))}
          </div>
          <Link
            href="/ai-studio"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-100"
          >
            Open AI studio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
