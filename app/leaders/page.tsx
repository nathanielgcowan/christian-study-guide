"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileOutput,
  Presentation,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const leaderFeatures = [
  {
    title: "Sermon and lesson builder",
    description:
      "Turn a passage into an outline, teaching points, illustrations, and group discussion in a few clicks.",
    icon: Presentation,
  },
  {
    title: "Shareable study pages",
    description:
      "Send a clean study link to your team, class, or small group with reflection prompts and prayer built in.",
    icon: Sparkles,
  },
  {
    title: "Export-ready resources",
    description:
      "Package sermon starters, family devotions, and group guides into something easy to copy, print, or present.",
    icon: FileOutput,
  },
  {
    title: "Church team workflows",
    description:
      "Organize recurring studies for volunteers, youth leaders, and ministry teams around one shared passage flow.",
    icon: ShieldCheck,
  },
];

const subscriptionTiers = [
  {
    name: "Leader",
    price: "$19/mo",
    audience: "Small group leaders and Bible study hosts",
    points: [
      "Unlimited group study generation",
      "Saved study sessions and discussion sets",
      "Copy and export tools for lessons",
    ],
  },
  {
    name: "Ministry Team",
    price: "$79/mo",
    audience: "Church staff, volunteer teams, and youth ministries",
    points: [
      "Shared team study library",
      "Reusable lesson templates",
      "Centralized planning for classes and events",
    ],
  },
];

export default function LeadersPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Leader and church tools
            </div>
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              Built for leaders after the study, not before the sermon.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
              Prepare youth lessons, small-group discussions, family devotions,
              and sermon starters from the same passage page your church already
              studies together.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/passage/james-1-2-4"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#d4af37] px-6 py-4 font-semibold text-[#0f172a] transition hover:bg-[#c9a66b]"
              >
                Open Leader Demo
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2">
          {leaderFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-semibold text-[#0f172a]">
                  {feature.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-12 rounded-[2rem] border border-[#d4af37]/20 bg-[#fffaf0] p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-semibold text-[#0f172a]">
                Church and ministry subscriptions
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-700">
                This is the monetizable layer: not just more AI output, but a
                simpler ministry workflow for recurring Bible teaching.
              </p>
              <div className="mt-6 grid gap-4">
                {subscriptionTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="rounded-3xl border border-[#d4af37]/20 bg-white p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#0f172a]">
                          {tier.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {tier.audience}
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-[#14532d]">
                        {tier.price}
                      </p>
                    </div>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                      {tier.points.map((point) => (
                        <li key={point}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-3xl bg-[#0f172a] p-8 text-white">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold">
                What leaders can do right now
              </h3>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-200">
                <li>• Generate a 15-minute Bible study from any passage</li>
                <li>• Build a youth lesson or sermon starter</li>
                <li>• Save study sessions for later reuse</li>
                <li>• Share a passage page with your group</li>
                <li>• Export the study view with the browser print flow</li>
              </ul>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
