"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Compass,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getActivityTimeline,
  getJourneys,
  getNewBelieverProgress,
  getPersonalizationPreferences,
  getPrayerEntries,
  getStudySessions,
} from "../../lib/persistence";
import {
  buildContinuityMoments,
  buildRecommendations,
  type ActivityItem,
  type JourneyItem,
  type NewBelieverProgressItem,
  type PersonalizationPreferencesItem,
  type PrayerEntryItem,
  type StudySessionItem,
} from "../../lib/discipleship";

const RECOMMENDATIONS_STATE_KEY = "christian-study-guide:recommendations-state";

const recommendationCards = [
  {
    title: "Next passage",
    detail:
      "Recommend the next Scripture based on what the user has been reading and saving recently.",
    icon: Compass,
  },
  {
    title: "Next doctrine",
    detail:
      "Surface the theology topic or life issue that naturally follows the current study pattern.",
    icon: BrainCircuit,
  },
  {
    title: "Next habit",
    detail:
      "Suggest whether the user should read, pray, review a memory verse, or resume a path next.",
    icon: Target,
  },
  {
    title: "Next community step",
    detail:
      "Help the user move from solo study into prayer follow-up, groups, and encouragement.",
    icon: Users,
  },
];

interface OfflineState {
  activity: ActivityItem[];
  journeys: JourneyItem[];
  preferences: PersonalizationPreferencesItem | null;
  prayers: PrayerEntryItem[];
  progress: NewBelieverProgressItem | null;
  sessions: StudySessionItem[];
}

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [data, setData] = useState<OfflineState>({
    activity: [],
    journeys: [],
    preferences: null,
    prayers: [],
    progress: null,
    sessions: [],
  });
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const isSignedIn = Boolean(session);
        setSignedIn(isSignedIn);

        if (isSignedIn) {
          const [activity, journeys, preferences, prayers, progress, sessions] =
            await Promise.all([
              getActivityTimeline(),
              getJourneys(),
              getPersonalizationPreferences(),
              getPrayerEntries(),
              getNewBelieverProgress(),
              getStudySessions(),
            ]);

          setData({
            activity: activity as ActivityItem[],
            journeys: journeys as JourneyItem[],
            preferences:
              (preferences as PersonalizationPreferencesItem | null) ?? null,
            prayers: prayers as PrayerEntryItem[],
            progress: (progress as NewBelieverProgressItem | null) ?? null,
            sessions: sessions as StudySessionItem[],
          });
        } else {
          const raw = localStorage.getItem(RECOMMENDATIONS_STATE_KEY);
          if (raw) {
            setData(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  useEffect(() => {
    if (!loading && !signedIn) {
      localStorage.setItem(RECOMMENDATIONS_STATE_KEY, JSON.stringify(data));
    }
  }, [data, loading, signedIn]);

  const recommendations = useMemo(
    () =>
      buildRecommendations({
        preferences: data.preferences,
        prayers: data.prayers,
        sessions: data.sessions,
        journeys: data.journeys,
        progress: data.progress,
        activity: data.activity,
      }),
    [data],
  );

  const continuityMoments = useMemo(
    () =>
      buildContinuityMoments({
        activity: data.activity,
        sessions: data.sessions,
        prayers: data.prayers,
        journeys: data.journeys,
        workflows: [],
      }),
    [data.activity, data.journeys, data.prayers, data.sessions],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading recommendations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Smarter recommendations
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Help people know what to study next.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              This recommendation layer now looks at study continuity, prayers,
              growth goals, journeys, and new believer progress so the app can
              suggest a real next step.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {recommendationCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <Icon className="h-6 w-6 text-[#1e40af]" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">
                  {card.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {card.detail}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-blue-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-950">
              <BrainCircuit className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Recommended next steps</h2>
            </div>
            <div className="mt-6 space-y-4">
              {recommendations.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-950">
                      {item.title}
                    </h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {item.theme}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.detail}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#1e40af]">
                    {item.reason}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-orange-200 bg-orange-50 p-8">
            <div className="flex items-center gap-3 text-orange-950">
              <Compass className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                What shapes these suggestions
              </h2>
            </div>
            <div className="mt-6 space-y-3 text-sm leading-7 text-orange-950">
              <p>• Your latest study sessions and unfinished passage work</p>
              <p>
                • Active prayer requests and answered-prayer follow-up
                opportunities
              </p>
              <p>• Saved journeys and guided-program progress</p>
              <p>• Personalization signals like struggles and growth goals</p>
            </div>
            <Link
              href="/personalization"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-orange-950 transition hover:bg-orange-100"
            >
              Adjust preferences
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Target className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Cross-page continuity</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-950">
            Instead of sending people into isolated pages, the app now surfaces
            the most recent study, prayer, and journey moments so they can
            continue what they already started.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {continuityMoments.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="rounded-2xl border border-blue-200 bg-white p-5 transition hover:bg-blue-100"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                  {item.category}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-blue-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.detail}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
