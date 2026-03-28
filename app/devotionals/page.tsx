"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";

interface Devotional {
  id: number;
  title: string;
  verse: string;
  reference: string;
  shortDescription: string;
  date: string;
  readTime: string;
  topic: string;
}

const sampleDevotionals: Devotional[] = [
  {
    id: 1,
    title: "God’s Unfailing Love",
    verse:
      "The Lord is gracious and compassionate, slow to anger and rich in love.",
    reference: "Psalm 145:8",
    shortDescription:
      "Discover the depth of God's steadfast love that never fails, even in our weakest moments.",
    date: "March 27, 2026",
    readTime: "5 min",
    topic: "Encouragement",
  },
  {
    id: 2,
    title: "Walking by Faith, Not by Sight",
    verse: "For we live by faith, not by sight.",
    reference: "2 Corinthians 5:7",
    shortDescription:
      "Learn how to trust God when circumstances look impossible.",
    date: "March 26, 2026",
    readTime: "7 min",
    topic: "Faith",
  },
  {
    id: 3,
    title: "The Peace That Surpasses Understanding",
    verse:
      "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: "Philippians 4:7",
    shortDescription:
      "How to experience God's supernatural peace in the middle of anxiety and worry.",
    date: "March 25, 2026",
    readTime: "6 min",
    topic: "Anxiety",
  },
  {
    id: 4,
    title: "Renewing Your Mind",
    verse:
      "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",
    reference: "Romans 12:2",
    shortDescription:
      "Practical steps to align your thoughts with God's truth.",
    date: "March 24, 2026",
    readTime: "8 min",
    topic: "Renewal",
  },
];

const topicFilters = ["All", "Encouragement", "Faith", "Anxiety", "Renewal"];

const devotionalElements = [
  "A key verse that sets the devotional direction",
  "A short explanation that keeps the devotional anchored to Scripture",
  "One reflection question for honest response",
  "A brief prayer to help the user answer God, not just read content",
];

const devotionalUseCases = [
  {
    title: "Morning quiet time",
    detail: "Use a devotional to begin the day with Scripture, reflection, and one clear prayer.",
  },
  {
    title: "Midday reset",
    detail: "Open a short devotional when stress, discouragement, or distraction starts shaping the day.",
  },
  {
    title: "Family or group use",
    detail: "Turn the devotional into a shared conversation starter with one question and one prayer.",
  },
  {
    title: "Mentor follow-up",
    detail: "Pair devotionals with guidance, check-ins, and next passages so they become part of a longer journey.",
  },
];

export default function DevotionalsPage() {
  const [selectedTopic, setSelectedTopic] = useState("All");

  const filteredDevotionals = useMemo(() => {
    if (selectedTopic === "All") return sampleDevotionals;
    return sampleDevotionals.filter(
      (devotional) => devotional.topic === selectedTopic,
    );
  }, [selectedTopic]);

  const featuredDevotional = filteredDevotionals[0] ?? sampleDevotionals[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mb-6 flex justify-center">
            <Calendar className="h-16 w-16 text-[#d4af37]" />
          </div>
          <h1 className="text-5xl font-bold md:text-6xl">Daily Devotionals</h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-blue-100">
            A daily feed of Scripture, reflection, prayer, and next-step
            discipleship for everyday Christians.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[#d4af37]/20 bg-white p-10 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-[#d4af37] px-4 py-1 text-sm font-semibold text-[#0f172a]">
                TODAY&apos;S DEVOTIONAL
              </div>
              <span className="text-sm text-zinc-500">{featuredDevotional.date}</span>
            </div>

            <h2 className="text-4xl font-semibold leading-tight text-[#0f172a]">
              {featuredDevotional.title}
            </h2>
            <div className="mt-6 text-2xl italic text-[#1e40af]">
              “{featuredDevotional.verse}”
            </div>
            <p className="mt-2 font-medium text-[#1e40af]">
              — {featuredDevotional.reference}
            </p>
            <p className="mt-8 text-lg leading-8 text-slate-700">
              {featuredDevotional.shortDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/passage/${featuredDevotional.reference.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center gap-3 rounded-2xl bg-[#d4af37] px-8 py-4 font-semibold text-[#0f172a] transition hover:bg-[#c9a66b]"
              >
                Study this passage
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/prayer"
                className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Open prayer journal
              </Link>
              <Link
                href="/devotional-library"
                className="inline-flex items-center gap-3 rounded-2xl border border-violet-300 px-8 py-4 font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Open devotional library
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-900">
              <Sparkles className="h-6 w-6" />
              <h3 className="text-2xl font-semibold">AI Coaching Feed</h3>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              Each devotional can naturally point into a mentor prompt, prayer
              rhythm, reflection question, and weekly action step.
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-violet-900">
              <li>• A one-question reflection to end the day</li>
              <li>• A suggested passage path for the week</li>
              <li>• A short prayer based on the devotional theme</li>
            </ul>
          </aside>
        </section>

        <section className="mb-10">
          <div className="flex flex-wrap gap-3">
            {topicFilters.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTopic === topic
                    ? "bg-[#1e40af] text-white"
                    : "bg-white text-slate-700 hover:bg-blue-50"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold text-[#0f172a]">
              Recent devotionals
            </h2>
            <p className="text-sm text-zinc-500">
              Filtered by {selectedTopic.toLowerCase()}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredDevotionals.map((devotional) => (
              <article
                key={devotional.id}
                className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-6 flex justify-between text-sm text-zinc-500">
                  <span>{devotional.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {devotional.readTime}
                  </span>
                </div>

                <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-900">
                  {devotional.topic}
                </div>

                <h3 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                  {devotional.title}
                </h3>

                <div className="mt-4 text-lg italic text-[#1e40af]">
                  “{devotional.verse}”
                </div>

                <p className="mt-5 line-clamp-3 text-[15px] leading-7 text-zinc-600">
                  {devotional.shortDescription}
                </p>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <Link
                    href={`/passage/${devotional.reference.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm font-semibold text-[#1e40af] transition hover:text-[#d4af37]"
                  >
                    Study passage
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-900">
                    <Heart className="h-3 w-3" />
                    Save idea
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="flex items-center gap-3 text-emerald-950">
            <Heart className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Saved devotional library</h2>
          </div>
          <p className="mt-4 leading-7 text-emerald-950">
            Keep generated devotionals, prayers, journaling prompts, and action steps
            in one reusable library instead of treating them as disposable outputs.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <Sparkles className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">What makes a devotional useful</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {devotionalElements.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-violet-200 bg-violet-50 p-8">
          <div className="flex items-center gap-3 text-violet-950">
            <Calendar className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Best use cases for this feed</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {devotionalUseCases.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-violet-200 bg-white p-5"
              >
                <h3 className="text-lg font-semibold text-violet-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-violet-900">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
