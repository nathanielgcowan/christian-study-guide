"use client";

import { useState } from "react";
import { CheckCircle2, HelpCircle, Sparkles } from "lucide-react";

const quizItems = [
  {
    question: "What does James say trials produce?",
    options: ["Comfort", "Steadfastness", "Riches"],
    answer: "Steadfastness",
  },
  {
    question: "What are the peacemakers called in Matthew 5?",
    options: ["Children of God", "Leaders of Israel", "Witnesses only"],
    answer: "Children of God",
  },
];

export default function QuizPage() {
  const [selected, setSelected] = useState<Record<number, string>>({});

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#7c3aed] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <HelpCircle className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Bible Quiz Generator</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-violet-50">
            Turn any chapter, path, or doctrine into quick checks for understanding and retention.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Sparkles className="h-6 w-6 text-violet-700" />
            <h2 className="text-2xl font-semibold">Sample quiz</h2>
          </div>
          <div className="mt-6 grid gap-6">
            {quizItems.map((item, index) => (
              <article key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-semibold text-slate-900">{item.question}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {item.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelected((current) => ({ ...current, [index]: option }))}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        selected[index] === option
                          ? "bg-violet-700 text-white"
                          : "bg-white text-slate-700 hover:bg-violet-100"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {selected[index] ? (
                  <p className="mt-4 text-sm font-medium text-slate-700">
                    {selected[index] === item.answer ? (
                      <span className="inline-flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Correct
                      </span>
                    ) : (
                      `Correct answer: ${item.answer}`
                    )}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
