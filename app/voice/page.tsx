"use client";

import Link from "next/link";
import {
  AudioLines,
  BookAudio,
  Mic,
  PlayCircle,
  RadioTower,
  SearchCode,
  Sparkles,
  Waves,
} from "lucide-react";

const voiceMoments = [
  "Listen to the passage while the text stays in sync.",
  "Ask a spoken Bible question and hear an anchored answer.",
  "Play prayer prompts and devotionals during commute or quiet time.",
  "Review memory verses with audio cueing and answer-back prompts.",
];

const voiceFeatures = [
  {
    title: "Scripture playback",
    detail: "A focused audio mode for passage study and whole-Bible reading.",
    icon: BookAudio,
  },
  {
    title: "Voice Q&A",
    detail: "Ask spoken questions about the Bible and route users into passages, theology, and mentor help.",
    icon: Mic,
  },
  {
    title: "Background listening",
    detail: "Keep devotionals, prayer prompts, and study audio steady on mobile.",
    icon: RadioTower,
  },
  {
    title: "Memory with sound",
    detail: "Use spoken prompts to make memorization feel less flat and more human.",
    icon: AudioLines,
  },
];

const interactionMoments = [
  "Speak a question like 'What does the Bible say about forgiveness?'",
  "Hear an answer tied to passages, not generic advice",
  "Queue multiple chapters for listening instead of one-off playback",
  "Move from spoken question to saved mentor thread or theology topic",
];

export default function VoicePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Waves className="h-4 w-4" />
              Audio and voice mode
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Make Bible study work with eyes closed and hands busy.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              Voice mode turns the app into a real companion during commute, chores,
              walks, and quiet time with spoken Scripture, guided prayer, and Bible Q&amp;A.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {voiceFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <Icon className="h-6 w-6 text-[#1e40af]" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{feature.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{feature.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <PlayCircle className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Best moments for voice</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {voiceMoments.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-violet-200 bg-white p-5 text-sm font-medium text-violet-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Where it connects</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/mobile"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Mobile direction
              </Link>
              <Link
                href="/questions"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
              >
                Bible Q&amp;A
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <SearchCode className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Real voice interactions</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {interactionMoments.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
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
