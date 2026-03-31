"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  BellRing,
  Brain,
  CheckCircle2,
  Crown,
  RotateCcw,
  Swords,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getMemoryBattleStats,
  getMemorizationProgress,
  saveMemorizationProgress,
  saveMemoryBattleStats,
  updateMemorizationProgress,
  updateMemoryBattleStats,
} from "../../lib/persistence";
import { memorizationSystems } from "@/lib/product-expansion";

const flashcards = [
  {
    reference: "Philippians 4:6-7",
    front: "What does Paul say to do with anxiety?",
    back: "Bring everything to God in prayer with thanksgiving.",
  },
  {
    reference: "James 1:2-4",
    front: "What do trials produce according to James?",
    back: "Steadfastness and mature faith.",
  },
  {
    reference: "Psalm 23:1",
    front: "Fill in the blank: “The Lord is my _____.”",
    back: "Shepherd",
  },
];

const MEMORIZATION_PROGRESS_KEY = "christian-study-guide:memorization-progress";
const MEMORY_BATTLE_STATS_KEY = "christian-study-guide:memory-battle-stats";

interface MemorizationRecord {
  id: string;
  reference: string;
  prompt: string;
  reviewCount: number;
  masteryLevel: string;
  lastResult: string;
  nextReviewAt: string;
}

export default function MemorizePage() {
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [fillGuess, setFillGuess] = useState("");
  const [battleScore, setBattleScore] = useState(0);
  const [bestBattleScore, setBestBattleScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [roundsWon, setRoundsWon] = useState(0);
  const [battleFeedback, setBattleFeedback] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<MemorizationRecord[]>([]);
  const [supabase] = useState(() => createClient());

  const current = flashcards[index];
  const reminderMessage = useMemo(
    () =>
      completed.length >= flashcards.length
        ? "Great work. Your next spaced-repetition review is tomorrow."
        : "Daily reminder: review one verse in the morning and one before bed.",
    [completed.length],
  );

  const masteryRank = useMemo(() => {
    if (completed.length >= flashcards.length) return "Mastered";
    if (completed.length >= 2) return "Confident";
    if (completed.length >= 1) return "Familiar";
    return "Learning";
  }, [completed.length]);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const [data, battleStats] = await Promise.all([
            getMemorizationProgress(),
            getMemoryBattleStats(),
          ]);
          setRecords(
            (
              data as Array<{
                id: string;
                reference: string;
                prompt: string;
                review_count: number;
                mastery_level: string;
                last_result: string;
                next_review_at: string | null;
              }>
            ).map((item) => ({
              id: item.id,
              reference: item.reference,
              prompt: item.prompt,
              reviewCount: item.review_count,
              masteryLevel: item.mastery_level,
              lastResult: item.last_result,
              nextReviewAt: item.next_review_at || "",
            })),
          );
          if (battleStats) {
            setBattleScore(battleStats.current_score ?? 0);
            setBestBattleScore(battleStats.best_score ?? 0);
            setRoundsPlayed(battleStats.rounds_played ?? 0);
            setRoundsWon(battleStats.rounds_won ?? 0);
          }
        } else {
          const raw = localStorage.getItem(MEMORIZATION_PROGRESS_KEY);
          const battleRaw = localStorage.getItem(MEMORY_BATTLE_STATS_KEY);
          if (raw) setRecords(JSON.parse(raw));
          if (battleRaw) {
            const parsed = JSON.parse(battleRaw);
            setBattleScore(parsed.currentScore ?? 0);
            setBestBattleScore(parsed.bestScore ?? 0);
            setRoundsPlayed(parsed.roundsPlayed ?? 0);
            setRoundsWon(parsed.roundsWon ?? 0);
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const persistReview = async () => {
    const nextReviewAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();
    const existing = records.find(
      (record) => record.reference === current.reference,
    );

    if (user) {
      if (existing) {
        const updated = await updateMemorizationProgress({
          id: existing.id,
          review_count: existing.reviewCount + 1,
          mastery_level: existing.reviewCount + 1 >= 4 ? "steady" : "starting",
          last_result: "reviewed",
          next_review_at: nextReviewAt,
        });
        setRecords((currentRecords) =>
          currentRecords.map((record) =>
            record.id === existing.id
              ? {
                  id: updated.id,
                  reference: updated.reference || record.reference,
                  prompt: updated.prompt || record.prompt,
                  reviewCount: updated.review_count,
                  masteryLevel: updated.mastery_level,
                  lastResult: updated.last_result,
                  nextReviewAt: updated.next_review_at || "",
                }
              : record,
          ),
        );
        return;
      }

      const saved = await saveMemorizationProgress({
        reference: current.reference,
        prompt: current.front,
        review_count: 1,
        mastery_level: "starting",
        last_result: "reviewed",
        next_review_at: nextReviewAt,
      });
      setRecords((currentRecords) => [
        {
          id: saved.id,
          reference: saved.reference,
          prompt: saved.prompt,
          reviewCount: saved.review_count,
          masteryLevel: saved.mastery_level,
          lastResult: saved.last_result,
          nextReviewAt: saved.next_review_at || "",
        },
        ...currentRecords,
      ]);
      return;
    }

    const nextRecords = existing
      ? records.map((record) =>
          record.reference === current.reference
            ? {
                ...record,
                reviewCount: record.reviewCount + 1,
                masteryLevel:
                  record.reviewCount + 1 >= 4 ? "steady" : "starting",
                nextReviewAt,
              }
            : record,
        )
      : [
          {
            id: `${Date.now()}`,
            reference: current.reference,
            prompt: current.front,
            reviewCount: 1,
            masteryLevel: "starting",
            lastResult: "reviewed",
            nextReviewAt,
          },
          ...records,
        ];

    setRecords(nextRecords);
    localStorage.setItem(
      MEMORIZATION_PROGRESS_KEY,
      JSON.stringify(nextRecords),
    );
  };

  const handleBattleRound = (correct: boolean) => {
    setRoundsPlayed((current) => current + 1);
    if (correct) {
      setRoundsWon((current) => current + 1);
      setBattleScore((currentScore) => {
        const next = currentScore + 10;
        setBestBattleScore((best) => Math.max(best, next));
        return next;
      });
      return;
    }

    setBattleScore(0);
  };

  const handleSaveBattleStats = async () => {
    try {
      if (user) {
        const payload = {
          current_score: battleScore,
          best_score: bestBattleScore,
          rounds_played: roundsPlayed,
          rounds_won: roundsWon,
        };
        const existing = await getMemoryBattleStats();
        const saved = existing
          ? await updateMemoryBattleStats({
              ...payload,
            })
          : await saveMemoryBattleStats({
              current_score: 0,
              best_score: 0,
              rounds_played: 0,
              rounds_won: 0,
            });
        setBattleScore(saved.current_score ?? 0);
        setBestBattleScore(saved.best_score ?? 0);
        setRoundsPlayed(saved.rounds_played ?? 0);
        setRoundsWon(saved.rounds_won ?? 0);
      } else {
        localStorage.setItem(
          MEMORY_BATTLE_STATS_KEY,
          JSON.stringify({
            currentScore: battleScore,
            bestScore: bestBattleScore,
            roundsPlayed,
            roundsWon,
          }),
        );
      }

      setBattleFeedback("Battle stats saved");
    } catch {
      setBattleFeedback("Save failed");
    } finally {
      setTimeout(() => setBattleFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading memorization progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Verse Memorization</h1>
              <p className="mt-1 text-blue-100">
                Practice flashcards, fill-in-the-blank prompts, and repeat
                Scripture until it stays with you.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-[#1e40af]">
                {current.reference}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#0f172a]">
                Card {index + 1} of {flashcards.length}
              </h2>
            </div>
            <button
              onClick={() => {
                setIndex(0);
                setShowBack(false);
                setCompleted([]);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          <div
            className="mb-6 rounded-3xl border border-violet-200 bg-violet-50 px-8 py-16 text-center"
            onClick={() => setShowBack((currentValue) => !currentValue)}
          >
            <p className="text-sm font-medium uppercase tracking-wide text-violet-700">
              {showBack ? "Answer" : "Prompt"}
            </p>
            <p className="mt-6 text-2xl leading-10 text-violet-950">
              {showBack ? current.back : current.front}
            </p>
            <p className="mt-6 text-sm text-violet-700">Tap card to flip</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowBack((currentValue) => !currentValue)}
              className="rounded-xl bg-[#1e40af] px-5 py-3 font-medium text-white transition hover:bg-[#1e3a8a]"
            >
              {showBack ? "Hide Answer" : "Show Answer"}
            </button>
            <button
              onClick={() => {
                if (!completed.includes(index)) {
                  setCompleted((currentValue) => [...currentValue, index]);
                }
                void persistReview();
                setShowBack(false);
                setIndex((currentValue) =>
                  currentValue === flashcards.length - 1 ? 0 : currentValue + 1,
                );
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-5 py-3 font-medium text-emerald-900 transition hover:bg-emerald-200"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark Reviewed
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-[#0f172a]">Progress</h3>
          <p className="mt-2 text-gray-600">
            Reviewed {completed.length} of {flashcards.length} cards this round.
          </p>
          <div className="mt-4 h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#1e40af] to-emerald-500 transition-all"
              style={{
                width: `${(completed.length / flashcards.length) * 100}%`,
              }}
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
            <Crown className="h-6 w-6 text-emerald-700" />
            <p className="mt-4 text-sm font-medium text-emerald-900">
              Mastery rank
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-950">
              {masteryRank}
            </p>
          </article>
          <article className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
            <BellRing className="h-6 w-6 text-blue-700" />
            <p className="mt-4 text-sm font-medium text-blue-900">
              Daily reminder
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-950">
              {reminderMessage}
            </p>
          </article>
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <Trophy className="h-6 w-6 text-amber-700" />
            <p className="mt-4 text-sm font-medium text-amber-900">
              Next milestone
            </p>
            <p className="mt-2 text-sm leading-6 text-amber-950">
              Complete all cards today to unlock a memory-builder badge.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Brain className="h-6 w-6" />
            <h3 className="text-2xl font-semibold">Full memorization system</h3>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {memorizationSystems.map((system) => (
              <article
                key={system.title}
                className="rounded-2xl border border-blue-200 bg-white p-5"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">
                  {system.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-blue-950">
                  {system.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <h3 className="text-2xl font-semibold text-violet-950">
              Fill-in-the-blank practice
            </h3>
            <p className="mt-4 text-violet-900">
              For God so loved the world that He gave His only ______.
            </p>
            <input
              value={fillGuess}
              onChange={(event) => setFillGuess(event.target.value)}
              placeholder="Type your answer"
              className="mt-5 w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
            />
            {fillGuess ? (
              <p className="mt-4 text-sm font-medium text-violet-950">
                {fillGuess.trim().toLowerCase() === "son"
                  ? "Correct. Keep repeating the whole verse aloud once more."
                  : "Keep going. Try recalling the full phrase before checking."}
              </p>
            ) : null}
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <BellRing className="h-6 w-6" />
              <h3 className="text-2xl font-semibold">Spaced repetition</h3>
            </div>
            <p className="mt-4 leading-7 text-amber-900">{reminderMessage}</p>
            <div className="mt-6 grid gap-3">
              {[
                "Review after 1 day",
                "Review after 3 days",
                "Review after 7 days",
                "Review after 14 days",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-xl border border-amber-200 bg-white p-4 text-sm font-medium text-amber-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-8">
          <div className="flex items-center gap-3 text-rose-950">
            <Swords className="h-6 w-6" />
            <h3 className="text-2xl font-semibold">Memory battles</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-rose-900">
            Turn memorization into a fast self-challenge. Keep a streak going by
            marking each recall round as correct or missed, and try to beat your
            best score.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-rose-200 bg-white p-5">
              <p className="text-sm font-medium text-rose-800">Current score</p>
              <p className="mt-2 text-3xl font-bold text-rose-950">
                {battleScore}
              </p>
            </article>
            <article className="rounded-2xl border border-rose-200 bg-white p-5">
              <p className="text-sm font-medium text-rose-800">Best score</p>
              <p className="mt-2 text-3xl font-bold text-rose-950">
                {bestBattleScore}
              </p>
            </article>
            <article className="rounded-2xl border border-rose-200 bg-white p-5">
              <p className="text-sm font-medium text-rose-800">Round prompt</p>
              <p className="mt-2 text-sm leading-6 text-rose-950">
                Recite{" "}
                <span className="font-semibold">{current.reference}</span> aloud
                before revealing the answer.
              </p>
            </article>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-rose-200 bg-white p-5">
              <p className="text-sm font-medium text-rose-800">Rounds played</p>
              <p className="mt-2 text-2xl font-bold text-rose-950">
                {roundsPlayed}
              </p>
            </article>
            <article className="rounded-2xl border border-rose-200 bg-white p-5">
              <p className="text-sm font-medium text-rose-800">Rounds won</p>
              <p className="mt-2 text-2xl font-bold text-rose-950">
                {roundsWon}
              </p>
            </article>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => handleBattleRound(true)}
              className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Count as correct
            </button>
            <button
              onClick={() => handleBattleRound(false)}
              className="rounded-xl border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-900 transition hover:bg-rose-100"
            >
              Missed it
            </button>
            <button
              onClick={() => void handleSaveBattleStats()}
              className="rounded-xl border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-900 transition hover:bg-rose-100"
            >
              Save battle stats
            </button>
          </div>
          {battleFeedback ? (
            <p className="mt-4 text-sm font-semibold text-emerald-700">
              {battleFeedback}
            </p>
          ) : null}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-[#0f172a]">
            Saved memorization progress
          </h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {records.length > 0 ? (
              records.map((record) => (
                <article
                  key={record.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="font-semibold text-slate-900">
                    {record.reference}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Reviews: {record.reviewCount} • Mastery:{" "}
                    {record.masteryLevel}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Review cards to start building memorization history.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
