"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  BrainCircuit,
  Compass,
  GitBranch,
  HeartHandshake,
  Sparkles,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getPersonalizationPreferences,
  savePersonalizationPreferences,
} from "../../lib/persistence";

const PERSONALIZATION_KEY = "christian-study-guide:personalization-preferences";

const inputs = [
  "Tradition and theological preference",
  "Most-studied books, topics, and life struggles",
  "Prayer journal patterns and answered requests",
  "Mentor history, saved sessions, and collections",
];

const graphMoments = [
  {
    title: "Study -> Prayer",
    description:
      "Link a passage insight to a live prayer burden and a follow-up prompt.",
  },
  {
    title: "Mentor -> Goal",
    description:
      "Turn mentor advice into a measurable next-step goal instead of leaving it as inspiration.",
  },
  {
    title: "Note -> Collection -> Plan",
    description:
      "Promote strong notes into collections and then into custom study plans.",
  },
];

export default function PersonalizationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");
  const [preferences, setPreferences] = useState({
    favoriteThemes: "hope, wisdom, prayer",
    activeStruggles: "anxiety, distraction",
    growthGoals: "consistency, family discipleship",
    preferredTone: "encouraging",
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
          const data = await getPersonalizationPreferences();
          if (data) {
            setPreferences({
              favoriteThemes: (data.favorite_themes || []).join(", "),
              activeStruggles: (data.active_struggles || []).join(", "),
              growthGoals: (data.growth_goals || []).join(", "),
              preferredTone: data.preferred_tone || "encouraging",
            });
          }
        } else {
          const raw = localStorage.getItem(PERSONALIZATION_KEY);
          if (raw) {
            setPreferences(JSON.parse(raw));
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

    const favoriteThemes = preferences.favoriteThemes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const activeStruggles = preferences.activeStruggles
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const growthGoals = preferences.growthGoals
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (user) {
      await savePersonalizationPreferences({
        favorite_themes: favoriteThemes,
        active_struggles: activeStruggles,
        growth_goals: growthGoals,
        preferred_tone: preferences.preferredTone,
        recommendation_profile: {
          themes_count: favoriteThemes.length,
          goals_count: growthGoals.length,
        },
      });
    } else {
      localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(preferences));
    }

    setSavedMessage("Personalization preferences saved.");
    window.setTimeout(() => setSavedMessage(""), 2400);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading personalization settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Personalization engine
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Make the product respond to the person, not just the passage.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              This layer connects preferences, habits, struggles, history, and
              goals so every recommendation starts to feel more guided and less
              generic.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Sparkles className="h-6 w-6 text-violet-700" />
            <h2 className="text-2xl font-semibold">
              Save personalization profile
            </h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep your favorite themes, current struggles, growth goals, and tone
            preference synced with your account.
          </p>
          <form
            onSubmit={handleSave}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <input
              value={preferences.favoriteThemes}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  favoriteThemes: event.target.value,
                }))
              }
              placeholder="Favorite themes"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <input
              value={preferences.activeStruggles}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  activeStruggles: event.target.value,
                }))
              }
              placeholder="Current struggles"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <input
              value={preferences.growthGoals}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  growthGoals: event.target.value,
                }))
              }
              placeholder="Growth goals"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af] md:col-span-2"
            />
            <select
              value={preferences.preferredTone}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  preferredTone: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="encouraging">Encouraging</option>
              <option value="practical">Practical</option>
              <option value="gentle">Gentle</option>
              <option value="challenging">Challenging</option>
            </select>
            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <button
                type="submit"
                className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save personalization profile
              </button>
              {savedMessage ? (
                <p className="text-sm font-medium text-emerald-700">
                  {savedMessage}
                </p>
              ) : null}
            </div>
          </form>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <BrainCircuit className="h-6 w-6 text-violet-700" />
              <h2 className="text-2xl font-semibold">Recommendation inputs</h2>
            </div>
            <div className="mt-6 space-y-4">
              {inputs.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-medium text-slate-800">{item}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <GitBranch className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Cross-device discipleship graph
              </h2>
            </div>
            <p className="mt-4 leading-7 text-emerald-950">
              Instead of treating notes, goals, prayer, mentor moments, and
              studies as isolated records, connect them into one growth graph
              that follows the user across devices.
            </p>
            <div className="mt-6 grid gap-4">
              {graphMoments.map((moment) => (
                <article
                  key={moment.title}
                  className="rounded-2xl border border-emerald-200 bg-white p-5"
                >
                  <p className="font-semibold text-emerald-950">
                    {moment.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-900">
                    {moment.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <Compass className="h-6 w-6 text-amber-950" />
            <h2 className="mt-4 text-2xl font-semibold text-amber-950">
              Dynamic study paths
            </h2>
            <p className="mt-4 leading-7 text-amber-900">
              Recommend the next passage, plan, mentor prompt, or prayer
              practice based on what someone actually needs now.
            </p>
          </article>
          <article className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <HeartHandshake className="h-6 w-6 text-violet-950" />
            <h2 className="mt-4 text-2xl font-semibold text-violet-950">
              Pastoral sensitivity
            </h2>
            <p className="mt-4 leading-7 text-violet-900">
              Personalization should feel spiritually wise, not manipulative. It
              should serve discipleship, trust, and gentleness.
            </p>
          </article>
          <article className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <Target className="h-6 w-6 text-blue-950" />
            <h2 className="mt-4 text-2xl font-semibold text-blue-950">
              Goal-aware guidance
            </h2>
            <p className="mt-4 leading-7 text-blue-900">
              Tie recommendations to goals like consistency, depth, prayer
              habits, memory work, leadership prep, or family discipleship.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <Compass className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">
              Professional personalization outcomes
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Guided paths that start from onboarding, not from random browsing",
              "Dashboard recommendations shaped by habits, saved state, and recent struggles",
              "Mentor tone and study depth aligned to maturity and goals",
              "Reminder cadence tuned to consistency patterns instead of generic schedules",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-amber-200 bg-white p-5 text-sm font-medium text-amber-950"
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
