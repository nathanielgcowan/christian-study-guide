'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import {
  BookOpen,
  Calendar,
  AlertCircle,
  Loader2,
  Check,
  Play,
  Trash2,
  Wand2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import AuthModal from '@/components/AuthModal';
import { getCustomReadingPlans, saveCustomReadingPlan } from '@/lib/persistence';

interface ReadingPlanEntry {
  reference: string;
}

interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  plan_type: 'general' | 'theology' | 'topical';
  duration_days: number;
  entries: ReadingPlanEntry[];
  userProgress?: {
    current_day: number;
    completed: boolean;
  } | null;
}

function buildPlanCoach(reference: string) {
  return {
    summary: `Today's reading in ${reference} is a chance to slow down and notice one truth about God's character and one step of obedience for your day.`,
    reflection:
      'What part of this reading feels most connected to your current season, and why?',
    prayer: `Lord, meet me through ${reference} today. Give me understanding, faith, and the courage to live what I read. Amen.`,
    action: `Read ${reference} once for understanding, once for prayer, and then write one sentence about how you will live it out before the day ends.`,
  };
}

const featuredPlans = [
  "Read the Bible in 90 days",
  "Gospel reading plan",
  "Psalms and Proverbs plan",
  "New believer plan",
];

const planBenefits = [
  "Remove the guesswork of where to read next.",
  "Turn reading into a repeatable daily rhythm instead of random chapter hopping.",
  "Connect every plan day to reflection, prayer, and one practical action.",
  "Make it easy for leaders, families, and new believers to start with structure.",
];

export default function ReadingPlansPage() {
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [customPlanPrompt, setCustomPlanPrompt] = useState("Create a 14-day plan about faith.");
  const [customPlans, setCustomPlans] = useState<
    Array<{
      id: string;
      prompt: string;
      title: string;
      durationDays: number;
      summary: string;
    }>
  >([]);
  const [customPlanFeedback, setCustomPlanFeedback] = useState('');

  const [supabase] = useState(() => createClient());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (user) {
      loadPlans();
      loadCustomPlans();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCustomPlans = async () => {
    try {
      const data = await getCustomReadingPlans();
      setCustomPlans(
        (data as Array<{
          id: string;
          prompt: string;
          title: string;
          duration_days: number;
          summary: string;
        }>).map((item) => ({
          id: item.id,
          prompt: item.prompt,
          title: item.title,
          durationDays: item.duration_days,
          summary: item.summary,
        }))
      );
    } catch {}
  };

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reading-plans');

      if (!response.ok) {
        throw new Error('Failed to load reading plans');
      }

      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
      alert('Failed to load reading plans');
    } finally {
      setLoading(false);
    }
  };

  const handleStartPlan = async (planId: string) => {
    try {
      setEnrolling(planId);
      const response = await fetch('/api/reading-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: planId }),
      });

      if (!response.ok) {
        const result = await response.json();
        if (response.status === 409) {
          alert('You are already enrolled in this plan');
        } else {
          throw new Error(result.error);
        }
        return;
      }

      await loadPlans();
    } catch {
      alert('Failed to start plan');
    } finally {
      setEnrolling(null);
    }
  };

  const handleRemovePlan = async (planId: string) => {
    if (!confirm('Remove this plan from your reading list?')) return;

    try {
      setRemoving(planId);
      const response = await fetch(`/api/reading-plans/${planId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove plan');
      }

      await loadPlans();
    } catch {
      alert('Failed to remove plan');
    } finally {
      setRemoving(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theology':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'topical':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getProgressPercentage = (plan: ReadingPlan) => {
    if (!plan.duration_days || !plan.userProgress) return 0;
    return Math.round((plan.userProgress.current_day / plan.duration_days) * 100);
  };

  const getCurrentReference = (plan: ReadingPlan) => {
    const index = Math.max((plan.userProgress?.current_day || 1) - 1, 0);
    return plan.entries?.[index]?.reference || plan.entries?.[0]?.reference || 'Scripture';
  };

  const handleSaveCustomPlan = async () => {
    if (!customPlanPrompt.trim()) return;

    const generatedTitle = customPlanPrompt.includes('faith')
      ? '14-Day Faith Builder'
      : 'Custom Reading Plan';
    const generatedSummary =
      'A custom AI-shaped reading plan with a daily focus, Scripture rhythm, and one coaching nudge for spiritual consistency.';
    const generatedEntries = [
      { day: 1, reference: 'Hebrews 11', note: 'See faith defined and embodied.' },
      { day: 2, reference: 'Romans 4', note: 'Study Abraham and justification by faith.' },
      { day: 3, reference: 'James 2', note: 'Explore living faith and obedience.' },
    ];

    try {
      const saved = await saveCustomReadingPlan({
        prompt: customPlanPrompt,
        title: generatedTitle,
        duration_days: 14,
        focus: 'faith',
        summary: generatedSummary,
        entries: generatedEntries,
      });

      setCustomPlans((current) => [
        {
          id: saved.id,
          prompt: saved.prompt,
          title: saved.title,
          durationDays: saved.duration_days,
          summary: saved.summary,
        },
        ...current,
      ]);
      setCustomPlanFeedback('Custom plan saved');
    } catch {
      setCustomPlanFeedback('Save failed');
    } finally {
      setTimeout(() => setCustomPlanFeedback(''), 2000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="mb-8">
            <BookOpen className="h-16 w-16 text-[#1e40af] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reading Plans
            </h1>
            <p className="text-gray-600">
              Sign in to access personalized reading plans and track your progress.
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-[#1e40af] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors"
          >
            Sign In to Continue
          </button>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode="signin"
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1e40af]" />
          <p className="text-gray-600">Loading reading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-lg">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Reading Plans</h1>
              <p className="text-blue-200 mt-1">
                Structured Bible reading journeys for deeper growth
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="mb-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Calendar className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Popular plan tracks</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {featuredPlans.map((plan) => (
                <article
                  key={plan}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-medium text-emerald-950"
                >
                  {plan}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Wand2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">AI custom plan prompt</h2>
            </div>
            <textarea
              value={customPlanPrompt}
              onChange={(event) => setCustomPlanPrompt(event.target.value)}
              rows={4}
              className="mt-6 w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
            />
            <p className="mt-4 text-sm leading-6 text-violet-900">
              Example output: daily readings, a short goal for each day, and one coaching prompt.
            </p>
            <button
              onClick={handleSaveCustomPlan}
              className="mt-5 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              {customPlanFeedback || 'Save custom plan'}
            </button>
          </aside>
        </section>

        {customPlans.length > 0 ? (
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0f172a]">Saved AI custom plans</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {customPlans.map((plan) => (
                <article
                  key={plan.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="font-semibold text-slate-900">{plan.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{plan.prompt}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{plan.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <Wand2 className="h-6 w-6 text-violet-700" />
              <h2 className="text-2xl font-semibold">Reading Plan Builder</h2>
            </div>
            <p className="mt-4 leading-7 text-slate-600">
              Generate a custom plan by topic, book, duration, or spiritual goal,
              then pair it with weekly AI coaching.
            </p>
            <Link
              href="/plan-builder"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-6 py-4 font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Open Plan Builder
            </Link>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <h2 className="text-2xl font-semibold text-emerald-950">
              AI Plan Coach
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-emerald-950">
              <li>• Weekly summaries that spot the main thread in your readings</li>
              <li>• Mid-plan check-ins when momentum drops</li>
              <li>• Goal-aware coaching based on consistency, depth, or leadership focus</li>
              <li>• Suggested next plans after completion</li>
            </ul>
          </aside>
        </section>

        <section className="mb-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Calendar className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Why reading plans matter</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {planBenefits.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-7 text-blue-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        {/* Active Plans */}
        {plans.some((p) => p.userProgress && !p.userProgress.completed) && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-8 flex items-center gap-3">
              <Play className="h-7 w-7 text-orange-600" />
              Your Active Plans
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {plans
                .filter((p) => p.userProgress && !p.userProgress.completed)
                .map((plan) => {
                  const progress = getProgressPercentage(plan);
                  const currentReference = getCurrentReference(plan);
                  const coach = buildPlanCoach(currentReference);
                  return (
                    <div
                      key={plan.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#0f172a] mb-2">
                            {plan.name}
                          </h3>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(
                              plan.plan_type
                            )}`}
                          >
                            {plan.plan_type.charAt(0).toUpperCase() +
                              plan.plan_type.slice(1)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemovePlan(plan.id)}
                          disabled={removing === plan.id}
                          className="text-gray-400 hover:text-red-600 transition p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <p className="text-gray-600 mb-6">{plan.description}</p>

                      <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                        <h4 className="mb-2 font-semibold text-emerald-950">
                          AI Coaching for Today
                        </h4>
                        <p className="text-sm leading-6 text-emerald-950">
                          {coach.summary}
                        </p>
                        <p className="mt-3 text-sm text-emerald-900">
                          <span className="font-semibold">Reflect:</span> {coach.reflection}
                        </p>
                        <p className="mt-3 text-sm text-emerald-900">
                          <span className="font-semibold">Pray:</span> {coach.prayer}
                        </p>
                        <p className="mt-3 text-sm text-emerald-900">
                          <span className="font-semibold">Action:</span> {coach.action}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm font-bold text-[#1e40af]">
                            {plan.userProgress?.current_day || 0} /{' '}
                            {plan.duration_days}{' '}
                            <span className="text-gray-600">({progress}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-[#1e40af] to-[#0f172a] h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/passage/${currentReference.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex-1 bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                        >
                          <Calendar className="h-5 w-5" />
                          Today&apos;s Reading
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* Completed Plans */}
        {plans.some((p) => p.userProgress && p.userProgress.completed) && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-8 flex items-center gap-3">
              <Check className="h-7 w-7 text-green-600" />
              Completed Plans
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {plans
                .filter((p) => p.userProgress && p.userProgress.completed)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-lg shadow-sm border border-green-200 p-8 bg-gradient-to-br from-green-50 to-emerald-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-green-900 mb-2">
                          {plan.name}
                        </h3>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(
                            plan.plan_type
                          )}`}
                        >
                          {plan.plan_type.charAt(0).toUpperCase() +
                            plan.plan_type.slice(1)}
                        </span>
                      </div>
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-green-900 mb-4">
                      Congratulations on completing {plan.duration_days} days of
                      focused Bible study!
                    </p>
                    <button
                      onClick={() => handleRemovePlan(plan.id)}
                      className="w-full text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg font-medium transition"
                    >
                      Remove from Library
                    </button>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Available Plans */}
        <section>
          <h2 className="text-3xl font-bold text-[#0f172a] mb-8">
            Available Plans to Start
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans
              .filter((p) => !p.userProgress)
              .map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition flex flex-col"
                >
                  <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                    {plan.name}
                  </h3>

                  <span
                    className={`inline-block w-fit px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getTypeColor(
                      plan.plan_type
                    )}`}
                  >
                    {plan.plan_type.charAt(0).toUpperCase() +
                      plan.plan_type.slice(1)}
                  </span>

                  <p className="text-gray-600 text-sm mb-4 flex-1">
                    {plan.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{plan.duration_days} days</span>
                  </div>

                  <button
                    onClick={() => handleStartPlan(plan.id)}
                    disabled={enrolling === plan.id}
                    className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    {enrolling === plan.id ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        Start Plan
                      </>
                    )}
                  </button>
                </div>
              ))}
          </div>

          {plans.filter((p) => !p.userProgress).length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-blue-900 font-medium">All plans are active!</p>
              <p className="text-blue-700 text-sm mt-1">
                You&apos;re either enrolled in or have completed all available plans.
              </p>
            </div>
          )}
        </section>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </div>
  );
}
