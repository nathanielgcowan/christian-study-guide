import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { aiSafeguards, retentionSystems } from "../../lib/product-expansion";

const trustColumns = [
  {
    title: "Moderation",
    detail:
      "Review comments, prayer-wall activity, public study publishing, and room behavior with a real operations layer.",
  },
  {
    title: "Audit trails",
    detail:
      "Track who changed permissions, who published a study, and what happened inside sensitive team workflows.",
  },
  {
    title: "Testing",
    detail:
      "Add confidence around notes, saves, mentor flows, billing gates, and collaboration state before scale magnifies bugs.",
  },
  {
    title: "Observability",
    detail:
      "Error monitoring, funnel tracking, and health dashboards help the team trust what is actually happening in production.",
  },
];

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#991b1b] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Trust and operations
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Add the systems that make the product trustworthy at scale.
            </h1>
            <p className="mt-6 text-lg leading-8 text-red-50">
              Shared content, teams, subscriptions, and AI workflows all need
              moderation, auditability, testing discipline, and real production
              visibility.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {trustColumns.map((column) => (
            <article
              key={column.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <BadgeCheck className="h-6 w-6 text-[#14532d]" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {column.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{column.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <ShieldAlert className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Moderation and audit focus
              </h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Role changes and invite acceptance",
                "Published-study revisions and takedowns",
                "Comment review and escalation history",
                "Sensitive billing and admin changes",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-amber-200 bg-white p-5 text-sm font-medium text-amber-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Activity className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Operational quality loop
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              <article className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-6 text-blue-950">
                <ClipboardList className="mb-3 h-5 w-5" />
                Define critical flows and monitor them continuously.
              </article>
              <article className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-6 text-blue-950">
                <AlertTriangle className="mb-3 h-5 w-5" />
                Capture regressions before users feel them in ministry contexts.
              </article>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Shield className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">AI safeguard layer</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aiSafeguards.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-blue-200 bg-white p-5"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-blue-950">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="flex items-center gap-3 text-emerald-950">
            <BadgeCheck className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">
              Retention that respects users
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {retentionSystems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-emerald-200 bg-white p-5"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-emerald-950">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
