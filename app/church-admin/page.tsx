"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Compass,
  LayoutDashboard,
  LineChart,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getChurchAdminSettings,
  saveChurchAdminSettings,
} from "../../lib/persistence";
import { familyChurchSystems } from "@/lib/product-expansion";

const CHURCH_ADMIN_KEY = "christian-study-guide:church-admin-settings";

const adminSystems = [
  {
    title: "Ministry dashboards",
    description:
      "See active rooms, team resource usage, plan engagement, and teaching pipelines across a whole church.",
  },
  {
    title: "Roles and approvals",
    description:
      "Separate permissions for pastors, ministry leads, moderators, teachers, and volunteers.",
  },
  {
    title: "Oversight tools",
    description:
      "Monitor room activity, publishing status, journey launches, and shared content quality in one place.",
  },
];

const operations = [
  "Team roles and ministry-level access",
  "Content approvals and publishing queues",
  "Leader resource management",
  "Room oversight and ministry visibility",
];

const churchModeFeatures = [
  "Group Bible studies",
  "Shared notes",
  "Discussion rooms",
  "Sermon companion notes",
  "Leader dashboards",
];

const ministryPlaybooks = [
  {
    title: "Weekend teaching flow",
    detail:
      "Turn the sermon text into leader prep, companion notes, prayer follow-up, and midweek group prompts.",
  },
  {
    title: "New believer lane",
    detail:
      "Guide first steps with foundations courses, mentor prompts, gentle check-ins, and milestone tracking.",
  },
  {
    title: "Volunteer training lane",
    detail:
      "Organize role expectations, study materials, reading plans, and reflection checkpoints for ministry teams.",
  },
  {
    title: "Crisis care lane",
    detail:
      "Coordinate prayer, pastoral follow-up, Scripture resources, and trusted leader visibility when support needs are urgent.",
  },
];

const weeklyReviewAreas = [
  "Which groups are active and which ones are drifting",
  "Which studies, devotionals, or guides are being reused most",
  "Which prayer and follow-up needs require pastoral attention",
  "Which leaders need publishing, moderation, or coaching support",
];

export default function ChurchAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");
  const [settings, setSettings] = useState({
    ministryName: "Sunday Leadership Team",
    roleScope: "ministry-lead",
    approvalsEnabled: true,
    roomOversightEnabled: true,
    publishingQueueEnabled: true,
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
          const data = await getChurchAdminSettings();
          if (data) {
            setSettings({
              ministryName: data.ministry_name || "Church Team",
              roleScope: data.role_scope || "ministry-lead",
              approvalsEnabled: data.approvals_enabled ?? true,
              roomOversightEnabled: data.room_oversight_enabled ?? true,
              publishingQueueEnabled: data.publishing_queue_enabled ?? true,
            });
          }
        } else {
          const raw = localStorage.getItem(CHURCH_ADMIN_KEY);
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

    if (user) {
      await saveChurchAdminSettings({
        ministry_name: settings.ministryName,
        role_scope: settings.roleScope,
        approvals_enabled: settings.approvalsEnabled,
        room_oversight_enabled: settings.roomOversightEnabled,
        publishing_queue_enabled: settings.publishingQueueEnabled,
      });
    } else {
      localStorage.setItem(CHURCH_ADMIN_KEY, JSON.stringify(settings));
    }

    setSavedMessage("Church admin settings saved.");
    window.setTimeout(() => setSavedMessage(""), 2400);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading church admin settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Building2 className="h-4 w-4" />
              Church admin layer
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              A control layer for real ministries, not just individual users.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              This is the church-facing operating system for dashboards, role
              management, room oversight, publishing approvals, and ministry
              collaboration.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Building2 className="h-6 w-6 text-[#14532d]" />
            <h2 className="text-2xl font-semibold">Save admin defaults</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep ministry-level oversight settings and publishing posture synced
            with your account.
          </p>
          <form
            onSubmit={handleSave}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <input
              value={settings.ministryName}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  ministryName: event.target.value,
                }))
              }
              placeholder="Ministry name"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <select
              value={settings.roleScope}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  roleScope: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="ministry-lead">Ministry lead</option>
              <option value="pastor">Pastor</option>
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
            </select>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
              <span>Approvals enabled</span>
              <input
                type="checkbox"
                checked={settings.approvalsEnabled}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    approvalsEnabled: event.target.checked,
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
              <span>Room oversight enabled</span>
              <input
                type="checkbox"
                checked={settings.roomOversightEnabled}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    roomOversightEnabled: event.target.checked,
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Publishing queue enabled</span>
              <input
                type="checkbox"
                checked={settings.publishingQueueEnabled}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    publishingQueueEnabled: event.target.checked,
                  }))
                }
              />
            </label>
            <div className="md:col-span-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Save church admin settings
              </button>
              {savedMessage ? (
                <p className="text-sm font-medium text-emerald-700">
                  {savedMessage}
                </p>
              ) : null}
            </div>
          </form>
        </section>

        <section className="mb-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Users2 className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">
              Family and church operating systems
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {familyChurchSystems.map((item) => (
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

        <section className="grid gap-6 md:grid-cols-3">
          {adminSystems.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <LayoutDashboard className="h-6 w-6 text-[#14532d]" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {item.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <LayoutDashboard className="h-6 w-6 text-[#14532d]" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Church dashboards
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              See active groups, reading-plan engagement, leader workflow
              status, and ministry adoption in one place.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <LineChart className="h-6 w-6 text-blue-700" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Engagement visibility
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Compare group participation, study completion, and sermon
              companion usage across ministries.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <ClipboardList className="h-6 w-6 text-amber-700" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Leader coordination
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Give pastors, editors, and moderators one shared operating surface
              instead of scattered tools.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <LayoutDashboard className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Church Mode</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {churchModeFeatures.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Users2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Role-based team permissions
              </h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Owner and pastor access",
                "Editor and moderator permissions",
                "Leader publishing rights",
                "Viewer-only ministry access",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-violet-200 bg-white p-5 text-sm font-medium text-violet-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-rose-200 bg-rose-50 p-8">
            <div className="flex items-center gap-3 text-rose-950">
              <ShieldCheck className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Moderation and oversight
              </h2>
            </div>
            <p className="mt-4 leading-7 text-rose-900">
              Add approval queues, audit history, room escalation tools, and
              content review so church teams can scale collaboration without
              losing trust.
            </p>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <ClipboardList className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Operational systems</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {operations.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <Users2 className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">
                  Admin + collaboration
                </h2>
              </div>
              <p className="mt-6 leading-7 text-emerald-950">
                Church admin becomes especially valuable when it is connected to
                live rooms, journeys, content publishing, and leader workspaces
                instead of sitting alone.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <ShieldCheck className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Connect the surfaces</h2>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
                >
                  Open Admin CMS
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
                >
                  Open Workspace
                  <Building2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <Compass className="h-6 w-6 text-[#14532d]" />
              <h2 className="text-2xl font-semibold">Ministry playbooks</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {ministryPlaybooks.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-[#14532d]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
              <div className="flex items-center gap-3 text-blue-950">
                <LineChart className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Weekly admin review</h2>
              </div>
              <div className="mt-6 space-y-3">
                {weeklyReviewAreas.map((item) => (
                  <article
                    key={item}
                    className="rounded-2xl border border-blue-200 bg-white p-4 text-sm leading-6 text-blue-950"
                  >
                    {item}
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8">
              <div className="flex items-center gap-3 text-rose-950">
                <ShieldAlert className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Trust and escalation</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-rose-900">
                A professional church layer should make it easy to spot stalled
                rooms, unresolved care needs, unreviewed content, and moderation
                issues before they become ministry pain points.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <Sparkles className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Best outcome</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-amber-950">
                The goal is not more admin work. It is a calmer ministry system
                where pastors, leaders, editors, and volunteers can see what
                matters and act on it together.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
