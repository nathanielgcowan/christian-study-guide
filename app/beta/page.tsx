"use client";

import Link from "next/link";
import { Globe2, Mic, Share2, Sparkles } from "lucide-react";

const betaFeatures = [
  {
    title: "Voice mode",
    description:
      "Speak your question, listen to guided prayer, and hear passages read aloud during study sessions.",
    status: "Coming soon",
    icon: Mic,
  },
  {
    title: "Multilingual study",
    description:
      "Offer devotionals, mentor guidance, and study prompts in more than one language for families and ministries.",
    status: "Coming soon",
    icon: Globe2,
  },
  {
    title: "Shareable study cards",
    description:
      "Turn a verse, prayer, or reflection into a clean card for group chats, classes, or social sharing.",
    status: "In design",
    icon: Share2,
  },
];

export default function BetaPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-bold md:text-6xl">What&apos;s next</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-orange-100">
            A preview of the next premium experiences we can turn into full
            product surfaces as the app grows.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {betaFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-900">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                  {feature.status}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">
                  {feature.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-orange-200 bg-orange-50 p-8">
          <h2 className="text-2xl font-semibold text-[#0f172a]">
            What is already live
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-700">
            The app already supports shareable passage pages, printable study
            views, saved study sessions, mentor history, and themed study modes.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/study"
              className="rounded-2xl bg-[#0f172a] px-5 py-3 font-semibold text-white transition hover:bg-[#1f2937]"
            >
              Open Study Hub
            </Link>
            <Link
              href="/passage/james-1-2-4"
              className="rounded-2xl border border-orange-300 px-5 py-3 font-semibold text-orange-900 transition hover:bg-orange-100"
            >
              View Live Passage Tools
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
