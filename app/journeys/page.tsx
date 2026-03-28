"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  BrainCircuit,
  CalendarRange,
  Clock3,
  HeartHandshake,
  Mountain,
  Repeat,
  ShieldPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getJourneys, saveJourney, updateJourney } from "@/lib/persistence";

const JOURNEYS_KEY = "christian-study-guide:journeys";

const journeys = [
  {
    title: "Anxiety to peace",
    length: "10 days",
    description:
      "A guided path through fear, trust, prayer, and the nearness of God with mentor check-ins built in.",
  },
  {
    title: "Prayer rhythm reset",
    length: "14 days",
    description:
      "A practical discipleship path that combines short readings, journaling, and one clear prayer habit at a time.",
  },
  {
    title: "Leadership under pressure",
    length: "21 days",
    description:
      "A discipleship track for small-group leaders, volunteers, and pastors trying to stay spiritually healthy while serving others.",
  },
];

const journeyFeatures = [
  "Daily Scripture and devotional guidance",
  "Mentor prompts that adapt to the journey stage",
  "Prayer checkpoints and weekly action steps",
  "Follow-up automation and completion summaries",
];

const automationLoops = [
  "Send reminder nudges when a journey day is missed",
  "Prompt mentor follow-up after difficult reflection moments",
  "Ask for prayer updates tied to the journey theme",
  "Create re-entry steps if someone falls behind",
];

interface SavedJourney {
  id: string;
  title: string;
  durationLabel: string;
  status: string;
  summary: string;
  currentStep: string;
}

export default function JourneysPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedJourneys, setSavedJourneys] = useState<SavedJourney[]>([]);
  const [savedMessage, setSavedMessage] = useState("");
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getJourneys();
          setSavedJourneys(
            (data as Array<{
              id: string;
              title: string;
              duration_label: string;
              status: string;
              summary: string;
              current_step: string | null;
            }>).map((item) => ({
              id: item.id,
              title: item.title,
              durationLabel: item.duration_label,
              status: item.status,
              summary: item.summary,
              currentStep: item.current_step || "",
            })),
          );
        } else {
          const raw = localStorage.getItem(JOURNEYS_KEY);
          if (raw) {
            setSavedJourneys(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveJourney = async (journey: (typeof journeys)[number]) => {
    const summary = `${journey.title} gives you a guided discipleship path through ${journey.description.toLowerCase()}`;
    const currentStep = "Start day 1 and save one reflection insight.";

    if (user) {
      const saved = await saveJourney({
        title: journey.title,
        duration_label: journey.length,
        summary,
        current_step: currentStep,
      });

      setSavedJourneys((current) => [
        {
          id: saved.id,
          title: saved.title,
          durationLabel: saved.duration_label,
          status: saved.status,
          summary: saved.summary,
          currentStep: saved.current_step || "",
        },
        ...current,
      ]);
    } else {
      const nextJourneys = [
        {
          id: `${Date.now()}`,
          title: journey.title,
          durationLabel: journey.length,
          status: "active",
          summary,
          currentStep,
        },
        ...savedJourneys,
      ];
      setSavedJourneys(nextJourneys);
      localStorage.setItem(JOURNEYS_KEY, JSON.stringify(nextJourneys));
    }

    setSavedMessage(`${journey.title} saved.`);
    window.setTimeout(() => setSavedMessage(""), 2400);
  };

  const handleCompleteJourney = async (id: string) => {
    if (user) {
      await updateJourney({ id, status: "completed", current_step: "Journey completed" });
    }

    const nextJourneys = savedJourneys.map((journey) =>
      journey.id === id
        ? { ...journey, status: "completed", currentStep: "Journey completed" }
        : journey,
    );
    setSavedJourneys(nextJourneys);

    if (!user) {
      localStorage.setItem(JOURNEYS_KEY, JSON.stringify(nextJourneys));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading journeys...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Mountain className="h-4 w-4" />
              AI discipleship journeys
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Multi-day spiritual guidance for real life, not just one-off answers.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              Build guided tracks for anxiety, prayer, doubt, leadership, grief,
              and discipline with Scripture, mentor support, and follow-through in one flow.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-3">
          {journeys.map((journey) => (
            <article
              key={journey.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                {journey.length}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">
                {journey.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{journey.description}</p>
              <button
                type="button"
                onClick={() => handleSaveJourney(journey)}
                className="mt-6 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save journey
              </button>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <BrainCircuit className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Journey engine</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {journeyFeatures.map((feature) => (
                <article
                  key={feature}
                  className="rounded-2xl border border-violet-200 bg-white p-5 text-sm font-medium text-violet-950"
                >
                  {feature}
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <HeartHandshake className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Why this matters</h2>
              </div>
              <p className="mt-6 leading-7 text-emerald-950">
                Journeys turn the product from a study library into something that
                can walk with a person over time, which is where discipleship starts to feel real.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <ShieldPlus className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Connect it to the app</h2>
              </div>
              <div className="mt-6 space-y-3 text-sm leading-6 text-amber-950">
                <p>• Pair journeys with notifications for follow-up.</p>
                <p>• Feed them into workflow runs for visibility.</p>
                <p>• Use reading plans and mentor history as the journey backbone.</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/orchestration"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
                >
                  Open AI workflows
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/reading-plans"
                  className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
                >
                  Open reading plans
                  <CalendarRange className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#0f172a]">Saved journeys</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep your discipleship tracks across devices and mark them complete when you finish.
              </p>
            </div>
            {savedMessage ? (
              <p className="text-sm font-medium text-emerald-700">{savedMessage}</p>
            ) : null}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {savedJourneys.length > 0 ? (
              savedJourneys.map((journey) => (
                <article
                  key={journey.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{journey.title}</p>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                      {journey.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    {journey.durationLabel}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{journey.summary}</p>
                  <p className="mt-3 text-sm text-slate-600">Next: {journey.currentStep}</p>
                  {journey.status !== "completed" ? (
                    <button
                      type="button"
                      onClick={() => handleCompleteJourney(journey.id)}
                      className="mt-4 rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                    >
                      Mark completed
                    </button>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Save one of the journeys above to start building your discipleship trail.
              </p>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <CalendarRange className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Journey progress tracking</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Daily completion streaks",
              "Missed-day recovery prompts",
              "Milestone celebrations",
              "Re-entry guidance after drift",
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

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Repeat className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Journey automation</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {automationLoops.map((item) => (
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
              <Clock3 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Milestone timing</h2>
            </div>
            <p className="mt-4 leading-7 text-blue-900">
              Journeys get much stronger when each stage can trigger a reminder,
              mentor prompt, prayer check-in, and next-step summary automatically.
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}
