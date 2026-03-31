"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Award,
  Brain,
  CalendarDays,
  CheckCircle2,
  Crown,
  Flame,
  Gem,
  Map,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getGamificationProgress,
  saveGamificationProgress,
} from "../../lib/persistence";

const GAMIFICATION_PROGRESS_KEY = "christian-study-guide:gamification-progress";

const xpSystems = [
  {
    title: "XP and levels",
    detail:
      "Earn progress for study sessions, prayer entries, memorization reviews, quizzes, and guided-path completion.",
    icon: Crown,
  },
  {
    title: "Achievement badges",
    detail:
      "Unlock milestones like Bible Beginner, Gospel Explorer, Psalm Prayer Warrior, and Romans Scholar.",
    icon: Award,
  },
  {
    title: "Memory mastery ranks",
    detail:
      "Move verses through Learning, Familiar, Confident, and Mastered instead of just checking them off once.",
    icon: Brain,
  },
];

const dailySystems = [
  "Read one passage",
  "Answer one reflection question",
  "Review one memory verse",
  "Log one prayer",
];

const weeklySystems = [
  "Finish 3 studies this week",
  "Memorize 2 verses",
  "Complete 5 prayer entries",
  "Stay on plan for 7 days",
];

const badgeShelf = [
  { name: "Bible Beginner", summary: "Finish your first guided path." },
  {
    name: "Gospel Explorer",
    summary: "Complete a Gospel-focused study track.",
  },
  {
    name: "Faithful for 30 Days",
    summary: "Keep a 30-day study streak alive.",
  },
  { name: "Romans Scholar", summary: "Finish a deep study through Romans." },
];

const mapSteps = [
  {
    week: "Level 1",
    focus: "Foundations of Christianity",
    reward: "Bible Beginner badge",
  },
  { week: "Level 2", focus: "Life of Jesus", reward: "Gospel Explorer badge" },
  {
    week: "Level 3",
    focus: "Spiritual Growth Habits",
    reward: "Streak boost + XP pack",
  },
  {
    week: "Level 4",
    focus: "Theology Basics",
    reward: "Course completion trophy",
  },
];

const advancedSystems = [
  {
    title: "Streak freezes and grace days",
    detail:
      "Keep people from dropping off after one missed day while still protecting the value of consistency.",
    icon: Shield,
  },
  {
    title: "Boss-level capstones",
    detail:
      "End each major journey with a larger quiz, reflection set, or applied challenge that feels like a milestone.",
    icon: Swords,
  },
  {
    title: "Seasonal events",
    detail:
      "Run Easter, Advent, Proverbs in 31 Days, and New Believer Month campaigns with themed rewards.",
    icon: CalendarDays,
  },
  {
    title: "Private leaderboards",
    detail:
      "Use small-group and church leaderboards carefully, keeping competition optional and community-based.",
    icon: Trophy,
  },
  {
    title: "Collections and trophy shelves",
    detail:
      "Let users display finished journeys, memorized verses, favorite studies, and unlocked badges.",
    icon: Gem,
  },
  {
    title: "Guided learning maps",
    detail:
      "Show progress visually so people feel like they are moving through Scripture, not wandering randomly.",
    icon: Map,
  },
];

const seasonalEvents = [
  "Advent reading challenge with daily encouragement",
  "Proverbs in 31 Days with wisdom streak milestones",
  "New Believer Month with guided path unlocks",
  "Summer in the Psalms with memory and prayer rewards",
];

export default function GamificationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [progress, setProgress] = useState({
    xpPoints: 240,
    currentLevel: 4,
    unlockedBadges: badgeShelf.slice(0, 2).map((badge) => badge.name),
    completedDailyQuests: dailySystems.slice(0, 2),
    activeWeeklyChallenges: weeklySystems,
    masteryRank: "Confident",
    streakFreezes: 1,
  });
  const [supabase] = useState(() => createClient());

  const nextBadge = useMemo(
    () =>
      badgeShelf.find((badge) => !progress.unlockedBadges.includes(badge.name))
        ?.name ?? "All starter badges unlocked",
    [progress.unlockedBadges],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getGamificationProgress();
          if (data) {
            setProgress({
              xpPoints: data.xp_points,
              currentLevel: data.current_level,
              unlockedBadges: data.unlocked_badges ?? [],
              completedDailyQuests: data.completed_daily_quests ?? [],
              activeWeeklyChallenges: data.active_weekly_challenges ?? [],
              masteryRank: data.mastery_rank ?? "Learning",
              streakFreezes: data.streak_freezes ?? 0,
            });
          }
        } else {
          const raw = localStorage.getItem(GAMIFICATION_PROGRESS_KEY);
          if (raw) setProgress(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveProgress = async () => {
    try {
      if (user) {
        const saved = await saveGamificationProgress({
          xp_points: progress.xpPoints,
          current_level: progress.currentLevel,
          unlocked_badges: progress.unlockedBadges,
          completed_daily_quests: progress.completedDailyQuests,
          active_weekly_challenges: progress.activeWeeklyChallenges,
          mastery_rank: progress.masteryRank,
          streak_freezes: progress.streakFreezes,
        });
        setProgress({
          xpPoints: saved.xp_points,
          currentLevel: saved.current_level,
          unlockedBadges: saved.unlocked_badges ?? [],
          completedDailyQuests: saved.completed_daily_quests ?? [],
          activeWeeklyChallenges: saved.active_weekly_challenges ?? [],
          masteryRank: saved.mastery_rank ?? "Learning",
          streakFreezes: saved.streak_freezes ?? 0,
        });
      } else {
        localStorage.setItem(
          GAMIFICATION_PROGRESS_KEY,
          JSON.stringify(progress),
        );
      }

      setSaveFeedback("Progress saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  const handleCompleteQuest = (quest: string) => {
    setProgress((current) => {
      if (current.completedDailyQuests.includes(quest)) return current;
      const nextXp = current.xpPoints + 25;
      return {
        ...current,
        xpPoints: nextXp,
        currentLevel: Math.max(
          current.currentLevel,
          Math.floor(nextXp / 100) + 1,
        ),
        completedDailyQuests: [...current.completedDailyQuests, quest],
        masteryRank:
          current.completedDailyQuests.length + 1 >= 4
            ? "Mastered"
            : current.completedDailyQuests.length + 1 >= 2
              ? "Confident"
              : "Familiar",
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading progression...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#166534] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Gamified Bible learning
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Turn Bible study into a guided growth journey people want to
              return to.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              The goal is not shallow competition. It is consistent spiritual
              formation: clear wins, visible progress, and better habits around
              Scripture, prayer, memorization, and guided learning.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/paths"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Open guided paths
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-14 grid gap-6 md:grid-cols-4">
          {[
            { label: "XP points", value: `${progress.xpPoints}` },
            { label: "Current level", value: `Level ${progress.currentLevel}` },
            { label: "Mastery rank", value: progress.masteryRank },
            { label: "Next badge", value: nextBadge },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {item.value}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {xpSystems.map(({ title, detail, icon: Icon }) => (
            <article
              key={title}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold text-slate-900">
                Daily quests
              </h2>
            </div>
            <div className="mt-6 grid gap-3">
              {dailySystems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <button
                    type="button"
                    onClick={() => handleCompleteQuest(item)}
                    className="text-left"
                  >
                    {item}
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSaveProgress}
              className="mt-6 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Save progression
            </button>
            {saveFeedback ? (
              <p className="mt-3 text-sm font-semibold text-emerald-700">
                {saveFeedback}
              </p>
            ) : null}
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-amber-700" />
              <h2 className="text-2xl font-semibold text-slate-900">
                Weekly challenges
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              {weeklySystems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-amber-200 bg-white px-4 py-4"
                >
                  <p className="text-sm font-medium text-slate-700">{item}</p>
                </div>
              ))}
              <p className="text-sm leading-6 text-slate-600">
                These are ideal for small groups, church teams, and personal
                momentum loops.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <Map className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-semibold text-slate-900">
                Guided learning map
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              {mapSteps.map((step) => (
                <div
                  key={step.week}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                        {step.week}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {step.focus}
                      </h3>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {step.reward}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-semibold text-slate-900">
                Badge shelf
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {badgeShelf.map((badge) => (
                <div
                  key={badge.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {badge.name}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {badge.summary}
                  </p>
                  {progress.unlockedBadges.includes(badge.name) ? (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Unlocked
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-slate-900">
              Advanced retention systems
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              These are the systems that move the product from simple study
              utility into a habit-forming learning platform.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {advancedSystems.map(({ title, detail, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1e40af] shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <CalendarDays className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Seasonal challenges</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {seasonalEvents.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-amber-200 bg-white p-5 text-sm font-medium text-amber-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">More playful discovery</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              Add surprise-study moments, memory battles, shareable win cards,
              and seasonal campaigns so the product feels encouraging and
              dynamic.
            </p>
            <Link
              href="/fun"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-violet-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              Open fun layer
              <Sparkles className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
