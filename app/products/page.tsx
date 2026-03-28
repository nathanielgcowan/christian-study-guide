import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookText, BrainCircuit, Church, GraduationCap, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Products and Services | Christian Study Guide",
  description:
    "Explore the study tools, discipleship products, and church-focused services available through Christian Study Guide.",
};

const offerings = [
  {
    title: "Personal study platform",
    detail:
      "Daily Scripture flows, prayer journaling, memorization, notes, reading plans, and recommendation tools for consistent spiritual habits.",
    icon: BookText,
  },
  {
    title: "AI-assisted study tools",
    detail:
      "Study generation, commentary support, guided explanations, passage dashboards, and content workflows built to support thoughtful Bible engagement.",
    icon: BrainCircuit,
  },
  {
    title: "Church and leader tools",
    detail:
      "Support for groups, leaders, sermon follow-up, study rooms, team workflows, and discipleship tracking across ministries.",
    icon: Church,
  },
  {
    title: "Courses and guided programs",
    detail:
      "New believer paths, theology learning, devotional tracks, and milestone-based growth programs for structured development.",
    icon: GraduationCap,
  },
];

const services = [
  "Custom discipleship workflows for churches and ministry teams",
  "Bible study and devotional publishing support",
  "Leader-ready templates for classes, groups, and sermon follow-up",
  "Strategy support for productizing teaching, care, and spiritual formation",
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Products and Services
            </p>
            <h1 className="mt-6 text-5xl font-bold md:text-6xl">
              Tools for Bible study, discipleship, and church growth.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              Christian Study Guide combines digital study experiences with practical ministry
              support so churches and individuals can build meaningful discipleship rhythms.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {offerings.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <Icon className="h-6 w-6 text-[#1e40af]" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Users className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Service options</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {services.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-7 text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </article>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <h2 className="text-2xl font-semibold text-emerald-950">Best fit for</h2>
            <div className="mt-6 space-y-3 text-sm leading-7 text-emerald-950">
              <p>• Churches building a digital discipleship layer around Sunday teaching</p>
              <p>• Ministry leaders who need reusable studies, paths, and follow-up systems</p>
              <p>• Individuals who want more than a reading app and need daily guidance</p>
              <p>• Christian educators creating structured learning and growth milestones</p>
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
            >
              Talk with us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
