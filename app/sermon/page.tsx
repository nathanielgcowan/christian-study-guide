"use client";

import { BookOpen, Lightbulb, MessageSquare, Mic2, Sparkles } from "lucide-react";

const sermonBlocks = [
  "Title",
  "Main points",
  "Illustrations",
  "Discussion questions",
  "Prayer",
];

export default function SermonPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] via-[#0f172a] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Mic2 className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">AI Sermon & Study Builder</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            Build sermons, youth lessons, family devotions, and leader-ready studies from one passage.
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
              {index === 3 && <MessageSquare className="h-5 w-5 text-emerald-700" />}
              {index === 4 && <Mic2 className="h-5 w-5 text-[#7c2d12]" />}
              <p className="mt-4 text-sm font-semibold text-slate-900">{block}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
