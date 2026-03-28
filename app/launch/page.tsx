"use client";

import { BadgeCheck, Bug, CreditCard, LineChart, Rocket, ShieldCheck } from "lucide-react";

const launchLayers = [
  "Real AI backend with usage controls, retries, and saved outputs",
  "Reliable Bible/content data provider integration",
  "Billing, subscriptions, and entitlement enforcement",
  "E2E tests, analytics, and error monitoring",
  "Role-based access and moderation flows",
  "Performance, accessibility, and mobile QA",
];

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] via-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Rocket className="h-4 w-4" />
              Launch readiness
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Turn a broad product into something that can actually launch well.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              This is the operational checklist for moving from an ambitious prototype
              to a professional application with reliability, trust, and real business systems.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {launchLayers.map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <BadgeCheck className="h-6 w-6 text-[#1e40af]" />
              <p className="mt-4 text-sm leading-6 text-slate-700">{item}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <CreditCard className="h-6 w-6 text-amber-950" />
            <h2 className="mt-4 text-xl font-semibold text-amber-950">Billing</h2>
            <p className="mt-3 text-sm leading-6 text-amber-900">
              Checkout, trials, invoices, and feature entitlements.
            </p>
          </article>
          <article className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <Bug className="h-6 w-6 text-violet-950" />
            <h2 className="mt-4 text-xl font-semibold text-violet-950">Testing</h2>
            <p className="mt-3 text-sm leading-6 text-violet-900">
              Protect notes, auth, mentor, payment, and persistence flows.
            </p>
          </article>
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <LineChart className="h-6 w-6 text-emerald-950" />
            <h2 className="mt-4 text-xl font-semibold text-emerald-950">Analytics</h2>
            <p className="mt-3 text-sm leading-6 text-emerald-900">
              Measure activation, retention, study completion, and premium conversion.
            </p>
          </article>
          <article className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <ShieldCheck className="h-6 w-6 text-blue-950" />
            <h2 className="mt-4 text-xl font-semibold text-blue-950">Trust</h2>
            <p className="mt-3 text-sm leading-6 text-blue-900">
              Access control, moderation, observability, and accessibility readiness.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
