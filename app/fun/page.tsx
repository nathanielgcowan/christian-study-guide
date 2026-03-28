"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  CalendarDays,
  Gift,
  Map,
  Shuffle,
  Sparkles,
  Swords,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getSeasonalChallenges,
  getSurpriseStudies,
  saveSeasonalChallenge,
  saveSurpriseStudy,
} from "@/lib/persistence";

const surpriseStudies = [
  {
    title: "Peace when life feels noisy",
    reference: "Psalm 46",
    prompt: "Read slowly, then write one fear you want to hand to God today.",
  },
  {
    title: "Courage in pressure",
    reference: "Joshua 1:9",
    prompt: "Ask where God is calling you to trust Him instead of shrinking back.",
  },
  {
    title: "Joy in hard seasons",
    reference: "James 1:2-4",
    prompt: "Look for the kind of endurance this trial might be producing.",
  },
];

const playfulModes = [
  {
    title: "Spin for a passage",
    detail: "Discover a Psalm, Proverb, Gospel story, or topical verse with one tap.",
    icon: Shuffle,
  },
  {
    title: "Memory battles",
    detail: "Beat your best score in fast fill-in-the-blank and rapid recall rounds.",
    icon: Swords,
  },
  {
    title: "Animated progress map",
    detail: "Move through a visible discipleship journey instead of checking a flat list.",
    icon: Map,
  },
  {
    title: "Shareable win cards",
    detail: "Turn milestones into beautiful celebration cards for streaks, paths, and badges.",
    icon: Gift,
  },
];

const seasonalChallenges = [
  "Advent journey with daily readings and reflection prompts",
  "Proverbs in 31 Days with wisdom streak rewards",
  "Easter week passion path with prayer checkpoints",
  "Summer in the Psalms with memory milestones and share cards",
];

const winCards = [
  "7-day streak celebration card",
  "Memory mastery badge card",
  "Guided path completion card",
  "Seasonal challenge finish card",
];

const SURPRISE_STUDIES_KEY = "christian-study-guide:surprise-studies";
const SEASONAL_CHALLENGES_KEY = "christian-study-guide:seasonal-challenges";

interface SavedSurpriseStudy {
  id: string;
  title: string;
  reference: string;
  prompt: string;
  category: string;
}

interface SavedSeasonalChallenge {
  id: string;
  challengeTitle: string;
  challengeSeason: string;
  status: string;
  progressNote: string;
  rewardClaimed: boolean;
}

export default function FunPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [savedStudies, setSavedStudies] = useState<SavedSurpriseStudy[]>([]);
  const [savedChallenges, setSavedChallenges] = useState<SavedSeasonalChallenge[]>([]);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const [studies, challenges] = await Promise.all([
            getSurpriseStudies(),
            getSeasonalChallenges(),
          ]);

          setSavedStudies(
            (studies as Array<{
              id: string;
              title: string;
              reference: string;
              prompt: string;
              category: string;
            }>).map((item) => ({
              id: item.id,
              title: item.title,
              reference: item.reference,
              prompt: item.prompt,
              category: item.category,
            })),
          );

          setSavedChallenges(
            (challenges as Array<{
              id: string;
              challenge_title: string;
              challenge_season: string;
              status: string;
              progress_note: string | null;
              reward_claimed: boolean;
            }>).map((item) => ({
              id: item.id,
              challengeTitle: item.challenge_title,
              challengeSeason: item.challenge_season,
              status: item.status,
              progressNote: item.progress_note || "",
              rewardClaimed: item.reward_claimed,
            })),
          );
        } else {
          const surpriseRaw = localStorage.getItem(SURPRISE_STUDIES_KEY);
          const seasonalRaw = localStorage.getItem(SEASONAL_CHALLENGES_KEY);
          if (surpriseRaw) setSavedStudies(JSON.parse(surpriseRaw));
          if (seasonalRaw) setSavedChallenges(JSON.parse(seasonalRaw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveSurpriseStudy = async (study: (typeof surpriseStudies)[number]) => {
    try {
      if (user) {
        const saved = await saveSurpriseStudy({
          title: study.title,
          reference: study.reference,
          prompt: study.prompt,
        });
        setSavedStudies((current) => [
          {
            id: saved.id,
            title: saved.title,
            reference: saved.reference,
            prompt: saved.prompt,
            category: saved.category,
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            title: study.title,
            reference: study.reference,
            prompt: study.prompt,
            category: "daily-surprise-study",
          },
          ...savedStudies,
        ];
        setSavedStudies(next);
        localStorage.setItem(SURPRISE_STUDIES_KEY, JSON.stringify(next));
      }
      setSaveFeedback(`${study.title} saved`);
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  const handleSaveChallenge = async (challenge: string) => {
    try {
      if (user) {
        const saved = await saveSeasonalChallenge({
          challenge_title: challenge,
          challenge_season: "seasonal",
          status: "active",
          progress_note: "Joined from the fun layer",
        });
        setSavedChallenges((current) => {
          const next = current.filter((item) => item.challengeTitle !== challenge);
          return [
            {
              id: saved.id,
              challengeTitle: saved.challenge_title,
              challengeSeason: saved.challenge_season,
              status: saved.status,
              progressNote: saved.progress_note || "",
              rewardClaimed: saved.reward_claimed,
            },
            ...next,
          ];
        });
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            challengeTitle: challenge,
            challengeSeason: "seasonal",
            status: "active",
            progressNote: "Joined from the fun layer",
            rewardClaimed: false,
          },
          ...savedChallenges.filter((item) => item.challengeTitle !== challenge),
        ];
        setSavedChallenges(next);
        localStorage.setItem(SEASONAL_CHALLENGES_KEY, JSON.stringify(next));
      }
      setSaveFeedback("Challenge saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading fun layer...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#7c3aed] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Fun layer
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Make Bible learning feel alive, rewarding, and worth returning to.
            </h1>
            <p className="mt-6 text-lg leading-8 text-violet-100">
              This layer adds surprise, momentum, and celebration without flattening
              spiritual growth into empty gimmicks.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/gamification"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Open gamification
              </Link>
              <Link
                href="/paths"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Open guided paths
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-3">
          {surpriseStudies.map((study) => (
            <article
              key={study.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7c3aed]">
                Daily surprise study
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{study.title}</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">{study.reference}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{study.prompt}</p>
              <button
                type="button"
                onClick={() => handleSaveSurpriseStudy(study)}
                className="mt-5 rounded-2xl bg-[#7c3aed] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
              >
                Save study
              </button>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {playfulModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <article
                key={mode.title}
                className="rounded-3xl border border-blue-200 bg-blue-50 p-8"
              >
                <Icon className="h-6 w-6 text-blue-900" />
                <h2 className="mt-4 text-2xl font-semibold text-blue-950">{mode.title}</h2>
                <p className="mt-3 text-sm leading-6 text-blue-900">{mode.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <CalendarDays className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Seasonal challenges</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {seasonalChallenges.map((challenge) => (
                <article
                  key={challenge}
                  className="rounded-2xl border border-amber-200 bg-white p-5 text-sm font-medium text-amber-950"
                >
                  <p>{challenge}</p>
                  <button
                    type="button"
                    onClick={() => handleSaveChallenge(challenge)}
                    className="mt-4 rounded-xl border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-950 transition hover:bg-amber-100"
                  >
                    Join challenge
                  </button>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Gift className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Shareable win cards</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {winCards.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-medium text-emerald-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Best next step</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Connect these moments to progression so users feel real momentum across
                paths, memory work, and daily discipleship.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Open daily dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {saveFeedback ? (
            <p className="mt-4 text-sm font-semibold text-emerald-700">{saveFeedback}</p>
          ) : null}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Saved surprise studies</h2>
            <div className="mt-6 grid gap-4">
              {savedStudies.length > 0 ? (
                savedStudies.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#7c3aed]">
                      {item.reference}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.prompt}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Save a surprise study to build a playful reading history.
                </p>
              )}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Challenge progress</h2>
            <div className="mt-6 grid gap-4">
              {savedChallenges.length > 0 ? (
                savedChallenges.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">{item.challengeTitle}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.challengeSeason} • {item.status}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.progressNote}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Join a seasonal challenge to start tracking playful progress.
                </p>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
