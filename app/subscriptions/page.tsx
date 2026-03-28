"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Building2, CheckCircle2, Crown, LockKeyhole, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSubscriptionSettings, saveSubscriptionSettings } from "@/lib/persistence";

const SUBSCRIPTION_SETTINGS_KEY = "christian-study-guide:subscription-settings";

const plans = [
  {
    name: "Free",
    price: "$0",
    summary: "Daily study, mentor basics, and personal devotion tools.",
  },
  {
    name: "Premium",
    price: "$12/mo",
    summary: "Advanced exports, saved libraries, journeys, and deeper leadership tools.",
  },
  {
    name: "Church",
    price: "$79/mo",
    summary: "Team seats, church admin, shared workspaces, and ministry dashboards.",
  },
];

export default function SubscriptionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [settings, setSettings] = useState({
    selectedPlan: "free",
    billingInterval: "monthly",
    teamSize: 1,
    trialActive: false,
  });
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getSubscriptionSettings();
          if (data) {
            setSettings({
              selectedPlan: data.selected_plan || "free",
              billingInterval: data.billing_interval || "monthly",
              teamSize: data.team_size || 1,
              trialActive: data.trial_active ?? false,
            });
          }
        } else {
          const raw = localStorage.getItem(SUBSCRIPTION_SETTINGS_KEY);
          if (raw) {
            setSettings(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (user) {
        await saveSubscriptionSettings({
          selected_plan: settings.selectedPlan,
          billing_interval: settings.billingInterval,
          team_size: settings.teamSize,
          trial_active: settings.trialActive,
        });
      } else {
        localStorage.setItem(SUBSCRIPTION_SETTINGS_KEY, JSON.stringify(settings));
      }

      setSaveFeedback("Subscription settings saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Crown className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Subscriptions</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            A billing and subscription layer for premium personal tools, leader workflows,
            and church-wide ministry plans.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Subscription settings
            </h2>
            {saveFeedback ? (
              <p className="text-sm font-medium text-emerald-700">{saveFeedback}</p>
            ) : null}
          </div>
          <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
            <select
              value={settings.selectedPlan}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  selectedPlan: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="church">Church</option>
            </select>
            <select
              value={settings.billingInterval}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  billingInterval: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <input
              type="number"
              min={1}
              value={settings.teamSize}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  teamSize: Number(event.target.value),
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
              <span>Trial active</span>
              <input
                type="checkbox"
                checked={settings.trialActive}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    trialActive: event.target.checked,
                  }))
                }
              />
            </label>
            <button
              type="submit"
              className="rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534] md:col-span-2"
            >
              Save subscription settings
            </button>
          </form>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-[#14532d]">
                {plan.name}
              </p>
              <h2 className="mt-3 text-4xl font-bold text-[#0f172a]">{plan.price}</h2>
              <p className="mt-4 leading-7 text-slate-600">{plan.summary}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <LockKeyhole className="h-6 w-6 text-amber-950" />
            <h2 className="mt-4 text-2xl font-semibold text-amber-950">
              Premium entitlements
            </h2>
            <p className="mt-4 leading-7 text-amber-900">
              Control which advanced features stay free, which belong to premium users,
              and which belong to church teams.
            </p>
          </article>
          <article className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <Wallet className="h-6 w-6 text-blue-950" />
            <h2 className="mt-4 text-2xl font-semibold text-blue-950">
              Billing layer
            </h2>
            <p className="mt-4 leading-7 text-blue-900">
              The next step is checkout, plan management, renewals, and account-level
              subscription visibility inside the product.
            </p>
          </article>
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <Building2 className="h-6 w-6 text-emerald-950" />
            <h2 className="mt-4 text-2xl font-semibold text-emerald-950">
              Church plans
            </h2>
            <p className="mt-4 leading-7 text-emerald-900">
              Church subscriptions fit naturally with team workspace, role permissions,
              church admin, journeys, and leader resource publishing.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <CheckCircle2 className="h-6 w-6 text-[#14532d]" />
            <h2 className="text-2xl font-semibold">Monetization fit</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Free daily study and core devotional tools",
              "Premium deeper study, libraries, and exports",
              "Leader workflows and shared study publishing",
              "Church admin, room sync, and team management",
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

        <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-8 py-6">
            <h2 className="text-2xl font-semibold text-[#0f172a]">Feature gating model</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Feature</th>
                  <th className="px-6 py-4 font-semibold">Free</th>
                  <th className="px-6 py-4 font-semibold">Premium</th>
                  <th className="px-6 py-4 font-semibold">Church</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Daily studies and basic mentor", "Yes", "Yes", "Yes"],
                  ["Advanced AI generation and exports", "Limited", "Yes", "Yes"],
                  ["Saved libraries and premium courses", "Limited", "Yes", "Yes"],
                  ["Shared workspaces and leader dashboards", "No", "Limited", "Yes"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-slate-200">
                    {row.map((cell) => (
                      <td key={cell} className="px-6 py-4 text-slate-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <LockKeyhole className="h-6 w-6 text-[#14532d]" />
            <h2 className="text-2xl font-semibold">Feature gating model</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Free: daily study, mentor basics, prayer, and notes",
              "Premium: export engine, saved passage dashboards, advanced mentor chat, and deeper journeys",
              "Church: team seats, publishing flow, permissions, rooms, and church admin controls",
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
          <article className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <Wallet className="h-6 w-6 text-blue-950" />
            <h2 className="mt-4 text-2xl font-semibold text-blue-950">Stripe-ready flow</h2>
            <p className="mt-4 text-sm leading-6 text-blue-900">
              Checkout, customer portal, invoice history, failed payment recovery, and trial conversion.
            </p>
          </article>
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <LockKeyhole className="h-6 w-6 text-emerald-950" />
            <h2 className="mt-4 text-2xl font-semibold text-emerald-950">Entitlements</h2>
            <p className="mt-4 text-sm leading-6 text-emerald-900">
              Gate AI volume, exports, leader tools, team seats, and premium dashboards by plan.
            </p>
          </article>
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <Building2 className="h-6 w-6 text-amber-950" />
            <h2 className="mt-4 text-2xl font-semibold text-amber-950">Church billing ops</h2>
            <p className="mt-4 text-sm leading-6 text-amber-900">
              Support seat counts, team ownership, church admin billing visibility, and plan-based permissions.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <LockKeyhole className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Real feature gating</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Free: daily study, Bible reader, prayer basics, and simple memorization",
              "Premium: deeper AI generation, saved libraries, advanced exports, and personalization",
              "Church: team seats, church dashboards, publishing controls, and group coordination",
              "Entitlements should control the UI, APIs, and saved feature limits consistently",
            ].map((item) => (
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
