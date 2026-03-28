'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { UserProfile, UserStreak } from '@/lib/types/database';
import {
  ArrowRight,
  BrainCircuit,
  BookOpen,
  Compass,
  Flame,
  Loader2,
  LogOut,
  Target,
  Trash2,
  Trophy,
  User,
  AlertTriangle,
  BarChart3,
  Gem,
} from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth/signin');
        return;
      }

      setUser(session.user);

      const [profileRes, streakRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/studies'),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      if (streakRes.ok) {
        const { streak: streakData } = await streakRes.json();
        setStreak(streakData);
      }

      setLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'delete my account') {
      alert("Please type exactly: 'delete my account'");
      return;
    }

    if (!user) {
      alert('You need to be signed in to delete your account.');
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to delete account');

      alert('Your account has been permanently deleted.');
      await supabase.auth.signOut();
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error: ${message}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const growthScore = useMemo(() => {
    const streakValue = streak?.current_streak ?? 0;
    const studyValue = streak?.total_studies ?? 0;
    return Math.min(100, streakValue * 6 + studyValue * 2);
  }, [streak]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1e40af]" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <User className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                Welcome back, {user?.email?.split('@')[0]}
              </h1>
              <p className="mt-2 text-blue-200">{user?.email}</p>
              <p className="mt-1 text-sm text-blue-100">
                Tradition: {profile?.tradition || 'overview'}
              </p>
              <p className="mt-1 text-sm text-blue-100">
                Role: {profile?.role || 'user'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <section className="grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-6">
            <Flame className="h-6 w-6 text-orange-600" />
            <p className="mt-4 text-sm font-medium text-slate-600">Current streak</p>
            <p className="mt-2 text-4xl font-bold text-orange-600">
              {streak?.current_streak || 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">days in a row</p>
          </div>
          <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <Trophy className="h-6 w-6 text-purple-600" />
            <p className="mt-4 text-sm font-medium text-slate-600">Best streak</p>
            <p className="mt-2 text-4xl font-bold text-purple-600">
              {streak?.best_streak || 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">personal record</p>
          </div>
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <p className="mt-4 text-sm font-medium text-slate-600">Total studies</p>
            <p className="mt-2 text-4xl font-bold text-blue-600">
              {streak?.total_studies || 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">passages completed</p>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50 p-6">
            <Target className="h-6 w-6 text-emerald-600" />
            <p className="mt-4 text-sm font-medium text-slate-600">Growth score</p>
            <p className="mt-2 text-4xl font-bold text-emerald-600">{growthScore}</p>
            <p className="mt-1 text-sm text-slate-500">simple momentum signal</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Progress dashboard
            </h2>
            <p className="mt-2 text-slate-600">
              A clearer retention view of how your study life is building over time.
            </p>

            <div className="mt-6 rounded-3xl bg-slate-50 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Weekly momentum</p>
                  <p className="mt-1 text-xl font-semibold text-[#0f172a]">
                    Keep one steady rhythm this week
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#1e40af]">
                  {growthScore}% engaged
                </p>
              </div>
              <div className="mt-4 h-3 w-full rounded-full bg-slate-200">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#1e40af] to-emerald-500"
                  style={{ width: `${growthScore}%` }}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Link
                href="/command-center"
                className="rounded-3xl border border-amber-200 bg-amber-50 p-5 transition hover:bg-amber-100"
              >
                <BrainCircuit className="h-5 w-5 text-amber-700" />
                <h3 className="mt-3 font-semibold text-amber-950">Command center</h3>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  Open the advanced system dashboard for recommendations and metrics.
                </p>
              </Link>
              <Link
                href="/study"
                className="rounded-3xl border border-blue-200 bg-blue-50 p-5 transition hover:bg-blue-100"
              >
                <Compass className="h-5 w-5 text-blue-700" />
                <h3 className="mt-3 font-semibold text-blue-950">Saved sessions</h3>
                <p className="mt-2 text-sm leading-6 text-blue-900">
                  Reopen your study sessions and mentor history.
                </p>
              </Link>
              <Link
                href="/prayer"
                className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 transition hover:bg-emerald-100"
              >
                <Target className="h-5 w-5 text-emerald-700" />
                <h3 className="mt-3 font-semibold text-emerald-950">Prayer journal</h3>
                <p className="mt-2 text-sm leading-6 text-emerald-900">
                  Record requests and mark answered prayers.
                </p>
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-[#d4af37]/20 bg-[#fffaf0] p-8">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Suggested next steps
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <li>• Save one study session this week for later review</li>
              <li>• Start a prayer journal entry tied to your current passage</li>
              <li>• Pick one topic path for your next focused study</li>
              <li>• Review one verse in memory mode before bed</li>
            </ul>
            <Link
              href="/topics"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
            >
              Explore topic paths
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-violet-200 bg-violet-50 p-8">
          <div className="flex items-center gap-3 text-violet-950">
            <BarChart3 className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Spiritual growth analytics</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Prayer rhythm",
              "Study depth",
              "Memory consistency",
              "Mentor follow-through",
            ].map((metric) => (
              <article
                key={metric}
                className="rounded-2xl border border-violet-200 bg-white p-5 text-sm font-medium text-violet-950"
              >
                {metric}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <Gem className="h-6 w-6 text-violet-700" />
            <p className="mt-4 text-sm font-medium text-violet-900">XP level</p>
            <p className="mt-2 text-3xl font-bold text-violet-950">
              {Math.max(1, Math.floor((streak?.total_studies || 0) / 5) + 1)}
            </p>
            <p className="mt-1 text-sm text-violet-900">based on study activity</p>
          </article>
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <Trophy className="h-6 w-6 text-amber-700" />
            <p className="mt-4 text-sm font-medium text-amber-900">Unlocked badge</p>
            <p className="mt-2 text-2xl font-bold text-amber-950">
              {growthScore >= 60 ? 'Gospel Explorer' : 'Bible Beginner'}
            </p>
            <p className="mt-1 text-sm text-amber-900">current featured reward</p>
          </article>
          <article className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
            <BarChart3 className="h-6 w-6 text-blue-700" />
            <p className="mt-4 text-sm font-medium text-blue-900">Trophy shelf</p>
            <p className="mt-2 text-sm leading-6 text-blue-950">
              Display completed journeys, memorized verses, badges, and finished courses here.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Account settings</h2>
          <div className="mt-6 space-y-5">
            <div className="flex justify-between gap-4 border-b pb-4">
              <div>
                <p className="font-medium">Email address</p>
                <p className="text-slate-500">{user?.email}</p>
              </div>
              <button className="text-sm text-[#1e40af] hover:underline">Change Email</button>
            </div>
            <div className="flex justify-between gap-4 border-b pb-4">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-slate-500">Last changed: Never</p>
              </div>
              <button className="text-sm text-[#1e40af] hover:underline">Reset Password</button>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-red-200 bg-red-50/50 p-8">
          <h3 className="text-xl font-semibold text-red-700">Danger zone</h3>
          <p className="mt-2 text-red-600">
            Deleting your account is permanent. Your saved studies, notes, and
            progress will be removed.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 font-semibold text-white transition hover:bg-red-700"
            >
              <Trash2 className="h-5 w-5" />
              Delete my account
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-medium text-red-600 transition hover:bg-red-100"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </section>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-10">
            <div className="mb-6 flex items-center gap-4">
              <AlertTriangle className="h-10 w-10 text-red-600" />
              <h2 className="text-2xl font-bold text-red-700">Delete account?</h2>
            </div>

            <p className="mb-8 text-slate-700">
              This action is <strong>permanent</strong> and cannot be undone.
            </p>

            <p className="mb-4 text-sm text-slate-600">
              Type <strong>&quot;delete my account&quot;</strong> to confirm:
            </p>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="mb-8 w-full rounded-2xl border border-red-200 px-5 py-3 focus:border-red-600 focus:outline-none"
              placeholder="delete my account"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-2xl border border-zinc-300 py-4 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation.toLowerCase() !== 'delete my account'}
                className="flex-1 rounded-2xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300"
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
