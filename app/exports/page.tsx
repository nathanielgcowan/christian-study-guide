import Link from "next/link";
import {
  Boxes,
  FileDown,
  FileText,
  MonitorPlay,
  Printer,
  Share2,
  Sparkles,
  WandSparkles,
} from "lucide-react";

const exportFormats = [
  { name: "PDF packet", detail: "A printable study handout with notes and prompts." },
  { name: "Teaching handout", detail: "A group-ready sheet for small groups or classes." },
  { name: "Slide outline", detail: "A presentation-style summary for sermon or lesson flow." },
  { name: "Share card", detail: "A visual summary for text, email, or group chat." },
];

export default function ExportsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <FileDown className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Advanced Export Suite</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            Turn a study, sermon builder, or group resource into something you
            can actually share, print, and present.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {exportFormats.map((format, index) => (
            <article
              key={format.name}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              {index === 0 && <FileText className="h-6 w-6 text-blue-700" />}
              {index === 1 && <Printer className="h-6 w-6 text-emerald-700" />}
              {index === 2 && <MonitorPlay className="h-6 w-6 text-violet-700" />}
              {index === 3 && <Share2 className="h-6 w-6 text-amber-700" />}
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {format.name}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{format.detail}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <WandSparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Premium export pipeline</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              Move beyond single downloads into a pipeline that assembles study content,
              mentor output, leader notes, and design templates into polished deliverables.
            </p>
            <div className="mt-6 space-y-4 text-sm leading-6 text-violet-950">
              <p>• Select audience and visual template</p>
              <p>• Pull in notes, questions, and prayer blocks automatically</p>
              <p>• Generate print, presentation, and sharing variants in one pass</p>
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Connected output</h2>
            </div>
            <p className="mt-4 leading-7 text-emerald-900">
              Exports get much stronger when they are fed from the orchestration layer,
              not manually assembled page by page.
            </p>
            <Link
              href="/orchestration"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-950 transition hover:text-emerald-800"
            >
              Open AI workflows
              <Share2 className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <FileDown className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Batch exports</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Export a whole discipleship journey",
              "Create a room packet for small groups",
              "Bundle a sermon series into one set",
              "Generate a multi-study leader handout pack",
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

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Boxes className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Advanced export engine</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Audience-aware layouts for youth, small groups, and family devotion",
              "One-click pull-through from mentor threads, notes, and saved studies",
              "Series-level packaging instead of single-resource downloads",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-800"
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
