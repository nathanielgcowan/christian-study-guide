"use client";

import {
  BellRing,
  Download,
  Headphones,
  Mic,
  Smartphone,
  WifiOff,
  Zap,
} from "lucide-react";
import { mobileSystems } from "@/lib/product-expansion";

const mobileLayers = [
  {
    title: "Installable experience",
    detail: "Treat the app like a daily mobile tool with homescreen presence and stronger session continuity.",
  },
  {
    title: "Offline reading",
    detail: "Cache passages, saved studies, and devotionals for low-connection moments.",
  },
  {
    title: "Persistent audio",
    detail: "Keep Scripture audio and devotional playback feeling steady on phones.",
  },
  {
    title: "Touch-first study tools",
    detail: "Larger tap targets, quicker save flows, and fewer desktop-only assumptions.",
  },
];

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#0f766e] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Smartphone className="h-4 w-4" />
              Mobile product polish
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Make daily Bible study feel native on the phone.
            </h1>
            <p className="mt-6 text-lg leading-8 text-cyan-50">
              A strong discipleship product should work beautifully during commute,
              lunch break, quiet time, and church life, not just on a laptop.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mobileLayers.map((layer) => (
            <article
              key={layer.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Zap className="h-6 w-6 text-[#1e40af]" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {layer.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{layer.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <Download className="h-6 w-6 text-emerald-950" />
            <h2 className="mt-4 text-2xl font-semibold text-emerald-950">Install flow</h2>
            <p className="mt-4 leading-7 text-emerald-900">
              Better install prompts, offline states, and app-shell polish make the habit loop stronger.
            </p>
          </article>
          <article className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <Headphones className="h-6 w-6 text-violet-950" />
            <h2 className="mt-4 text-2xl font-semibold text-violet-950">Audio mode</h2>
            <p className="mt-4 leading-7 text-violet-900">
              Scripture, prayer, and devotional playback should feel first-class on mobile.
            </p>
          </article>
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <BellRing className="h-6 w-6 text-amber-950" />
            <h2 className="mt-4 text-2xl font-semibold text-amber-950">Reminder stack</h2>
            <p className="mt-4 leading-7 text-amber-900">
              Reading nudges, prayer follow-ups, and journey checkpoints matter more on phones than desktops.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <WifiOff className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Offline-first direction</h2>
          </div>
          <p className="mt-4 max-w-3xl leading-7 text-blue-900">
            The app already has a manifest. The next mobile leap is reliable offline passage access,
            cached study sessions, and resilient audio behavior that does not depend on perfect connectivity.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Installable app behavior that feels dependable every day",
            "Offline passage reading and saved-study access for low-connection moments",
            "Audio playback and reminders tuned for commute, church, and quiet time",
          ].map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Smartphone className="h-6 w-6 text-[#1e40af]" />
              <p className="mt-4 text-sm leading-6 text-slate-600">{item}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="flex items-center gap-3 text-emerald-950">
            <Smartphone className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Concrete mobile upgrades</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {mobileSystems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-emerald-200 bg-white p-5"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-emerald-950">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Download className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">PWA and offline direction</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Save passages and the Today flow for offline reading",
                "Cache guided studies and devotionals that were already opened",
                "Keep reminder timing and journey state resilient on phones",
                "Treat installs, updates, and reconnect states like product features",
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

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Mic className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Voice on mobile</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-violet-900">
              Voice and audio are part of mobile polish, not a side idea. Scripture playback,
              spoken Q&amp;A, and prayer prompts become much more valuable on phones.
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}
