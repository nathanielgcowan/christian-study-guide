"use client";

import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import {
  BarChart3,
  FilePenLine,
  LayoutPanelTop,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users2,
  Workflow,
} from "lucide-react";

const adminBlocks = [
  {
    title: "Homepage featured studies",
    description: "Curate what appears first without touching code.",
  },
  {
    title: "Devotional publishing",
    description: "Manage featured devotionals and topic journeys centrally.",
  },
  {
    title: "Leader content staging",
    description: "Prepare room prompts, export packs, and church resources.",
  },
];

export default function AdminPage() {
  return (
    <AdminGate>
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <ShieldCheck className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Admin CMS</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            A content-control layer for featured studies, devotionals, leader
            resources, and premium product curation.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {adminBlocks.map((block, index) => (
            <article
              key={block.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              {index === 0 && <LayoutPanelTop className="h-6 w-6 text-blue-700" />}
              {index === 1 && <Sparkles className="h-6 w-6 text-violet-700" />}
              {index === 2 && <FilePenLine className="h-6 w-6 text-emerald-700" />}
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {block.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{block.description}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Workflow className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Content management layer</h2>
            </div>
            <p className="mt-4 leading-7 text-blue-900">
              The admin surface can grow into a real CMS for featured studies, devotional
              tracks, onboarding flows, room kits, leader packs, and premium experiences.
            </p>
            <div className="mt-6 space-y-4 text-sm leading-6 text-blue-950">
              <p>• Curate homepage modules and featured passages</p>
              <p>• Publish theme journeys and seasonal study campaigns</p>
              <p>• Control room templates, exports, and church-team resources</p>
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <ShieldCheck className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Operational connection</h2>
            </div>
            <p className="mt-4 leading-7 text-emerald-900">
              Once the CMS is connected to collaboration and orchestration, the app can
              launch campaigns, studies, and leader workflows from one control layer.
            </p>
            <Link
              href="/command-center"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-950 transition hover:text-emerald-800"
            >
              Open command center
              <Sparkles className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <ShieldCheck className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Content publishing system</h2>
          </div>
          <p className="mt-4 leading-7 text-amber-950">
            This is the editorial layer for featured studies, journey launches, seasonal
            campaigns, leader packs, and premium drops with approvals and scheduling.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-blue-950">
                <BarChart3 className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Admin analytics portal</h2>
              </div>
              <p className="mt-4 max-w-3xl leading-7 text-blue-900">
                Pair the CMS with a true analytics surface for retention, content performance,
                funnel health, and feature adoption across the platform.
              </p>
            </div>
            <Link
              href="/admin-analytics"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-100"
            >
              Open analytics portal
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <Users2 className="h-6 w-6 text-[#1e40af]" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">User management</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Search users, view role distribution, inspect adoption, and support church or team onboarding.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <ShieldAlert className="h-6 w-6 text-amber-700" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Moderation</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Review reported content, room activity, shared-study comments, and trust signals from one place.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <FilePenLine className="h-6 w-6 text-emerald-700" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Publishing</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Curate church-ready studies, publish devotional campaigns, and stage leader resources for teams.
            </p>
          </article>
        </section>
      </main>
    </div>
    </AdminGate>
  );
}
