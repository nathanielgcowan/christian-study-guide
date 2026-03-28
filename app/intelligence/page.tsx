"use client";

import Link from "next/link";
import {
  Languages,
  ArrowRight,
  BookMarked,
  Cpu,
  GitBranch,
  Network,
  Radar,
  Smartphone,
  WifiOff,
} from "lucide-react";

const intelligenceLayers = [
  {
    title: "Cross-reference graphing",
    description:
      "Map passages by theme, doctrine, narrative parallels, and repeated language rather than only static verse lists.",
  },
  {
    title: "Theme clustering",
    description:
      "Group search, notes, mentor history, and plans around themes like hope, suffering, forgiveness, holiness, or mission.",
  },
  {
    title: "Book intelligence",
    description:
      "Surface author, audience, structure, key terms, timeline, and theological movement as a reusable study layer.",
  },
  {
    title: "Real Bible data layer",
    description:
      "Move cross references, lexical insight, and context metadata onto richer structured Bible sources so the experience feels more authoritative.",
  },
];

const mobileFeatures = [
  "Installable PWA behavior",
  "Offline-friendly reading and saved studies",
  "Cached devotionals and passage sessions",
  "Audio-first study and touch-friendly navigation",
];

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Radar className="h-4 w-4" />
              Bible intelligence
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Build a smarter Scripture engine around the reader.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              This is where the app becomes more than content generation: better
              Scripture relationships, deeper discovery, and stronger mobile behavior.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-3">
          {intelligenceLayers.map((layer) => (
            <article
              key={layer.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Network className="h-6 w-6 text-[#1e40af]" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {layer.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{layer.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <Cpu className="h-6 w-6 text-violet-700" />
              <h2 className="text-2xl font-semibold">Smarter Bible intelligence</h2>
            </div>
            <p className="mt-4 leading-7 text-slate-600">
              Cross references, key terms, context, theology compare, and apologetics
              can all start sharing the same intelligence layer instead of living as
              separate page sections.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/passage/romans-5-1"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Open a sample passage
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Open smart search
                <BookMarked className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Smartphone className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Mobile-first behavior</h2>
            </div>
            <div className="mt-6 space-y-4">
              {mobileFeatures.map((feature) => (
                <article
                  key={feature}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-medium text-emerald-950"
                >
                  {feature}
                </article>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-5">
              <WifiOff className="mt-0.5 h-5 w-5 text-emerald-800" />
              <p className="text-sm leading-6 text-emerald-900">
                The app already has a web manifest. The next mobile layer is stronger
                offline caching and session continuity for saved studies.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <GitBranch className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Verse relationship graph</h2>
            </div>
            <p className="mt-4 leading-7 text-blue-900">
              Move from simple related-verse lists to a visual graph of themes, theological
              links, repeated language, and narrative parallels across Scripture.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Theme clusters like grace, kingdom, suffering, mission",
                "Doctrinal links between justification, covenant, and hope",
                "Narrative parallels and fulfillment patterns",
                "Repeated original-language roots across passages",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Cpu className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">API-driven Bible intelligence</h2>
            </div>
            <p className="mt-4 leading-7 text-amber-900">
              The strongest next intelligence layer is richer source data for cross references,
              original languages, context structure, and linked study metadata.
            </p>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Cpu className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Real Bible API integration</h2>
            </div>
            <p className="mt-4 leading-7 text-emerald-900">
              The next realism upgrade is richer Bible, cross-reference, and language data
              so the product relies less on static examples and more on structured source material.
            </p>
          </div>

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Languages className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Multilingual support</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              Add translated UI, multilingual mentor responses, and devotional output
              so families, students, and ministries can use the same study system in more languages.
            </p>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Cpu className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Data realism roadmap</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Structured Bible text and passage metadata",
              "Richer cross-reference datasets",
              "Lexical and language source integration",
              "Reusable context graph for study modes",
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

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Bible text and metadata provider for richer passage context",
            "Cross-reference dataset for smarter related verse explanations",
            "Lexical and language data for original Greek and Hebrew depth mode",
          ].map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Cpu className="h-6 w-6 text-[#1e40af]" />
              <p className="mt-4 text-sm leading-6 text-slate-600">{item}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <BookMarked className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Professional data integration checklist</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Bible text provider with stable licensing and translation support",
              "Structured metadata for books, authors, timelines, and places",
              "Cross-reference and lexical sources for deeper study layers",
              "Caching and normalization so the data layer is reliable across the app",
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
