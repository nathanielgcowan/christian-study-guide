"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  Save,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPublicProfile, savePublicProfile } from "../../lib/persistence";

const PROFILE_STORAGE_KEY = "christian-study-guide:public-profile";

interface ProfileDraft {
  displayName: string;
  currentFocus: string;
  favoritePassages: string;
  recentHighlights: string;
  isPublic: boolean;
}

const initialDraft: ProfileDraft = {
  displayName: "Nathaniel",
  currentFocus: "Trusting God in pressure-filled seasons",
  favoritePassages: "Romans 8, Psalm 23, John 15, James 1:2-4",
  recentHighlights:
    "Saved a mentor session on anxiety and trust\nCompleted a devotional flow on Romans 8\nMarked a family prayer request as answered",
  isPublic: false,
};

export default function PublicProfilePage() {
  const [draft, setDraft] = useState<ProfileDraft>(initialDraft);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const profile = await getPublicProfile();
          if (profile) {
            setDraft({
              displayName:
                profile.display_name ||
                session.user.email?.split("@")[0] ||
                "Member",
              currentFocus: profile.current_focus || "",
              favoritePassages: (profile.favorite_passages || []).join(", "),
              recentHighlights: (profile.recent_highlights || []).join("\n"),
              isPublic: Boolean(profile.is_public),
            });
          }
        } else {
          const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
          if (raw) {
            setDraft(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [supabase]);

  const favoritePassages = draft.favoritePassages
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const recentHighlights = draft.recentHighlights
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const handleSave = () => {
    const persist = async () => {
      try {
        if (user) {
          await savePublicProfile({
            display_name: draft.displayName,
            current_focus: draft.currentFocus,
            favorite_passages: favoritePassages,
            recent_highlights: recentHighlights,
            is_public: draft.isPublic,
          });
        } else {
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(draft));
        }

        setSaveFeedback("Profile saved");
      } catch {
        setSaveFeedback("Save failed");
      } finally {
        setTimeout(() => setSaveFeedback(""), 2000);
      }
    };

    persist();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading your public profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/15">
              <UserRound className="h-12 w-12" />
            </div>
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                Optional public profile
              </div>
              <h1 className="mt-4 text-5xl font-bold">
                {draft.displayName}&apos;s Study Page
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-blue-100">
                A shareable profile for favorite passages, recent study
                momentum, and encouragement worth passing along.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Public profile settings
            </h2>
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                saveFeedback
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-[#1e40af] text-white hover:bg-[#1e3a8a]"
              }`}
            >
              <Save className="h-4 w-4" />
              {saveFeedback || "Save profile"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={draft.displayName}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  displayName: event.target.value,
                }))
              }
              placeholder="Display name"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <input
              value={draft.currentFocus}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  currentFocus: event.target.value,
                }))
              }
              placeholder="Current focus"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <textarea
              value={draft.favoritePassages}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  favoritePassages: event.target.value,
                }))
              }
              rows={3}
              placeholder="Favorite passages, separated by commas"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <textarea
              value={draft.recentHighlights}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  recentHighlights: event.target.value,
                }))
              }
              rows={3}
              placeholder="One recent highlight per line"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={draft.isPublic}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  isPublic: event.target.checked,
                }))
              }
            />
            Make this profile shareable
          </label>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <Sparkles className="h-6 w-6 text-violet-700" />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Current focus
            </p>
            <p className="mt-2 text-xl font-semibold text-[#0f172a]">
              {draft.currentFocus || "Add your current study focus"}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <Heart className="h-6 w-6 text-rose-700" />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Prayer milestone
            </p>
            <p className="mt-2 text-xl font-semibold text-[#0f172a]">
              {draft.isPublic
                ? "Visible to people you share with"
                : "Private draft"}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <Share2 className="h-6 w-6 text-blue-700" />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Profile use case
            </p>
            <p className="mt-2 text-xl font-semibold text-[#0f172a]">
              Share encouragement without exposing private notes
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <BookOpen className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Favorite passages</h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {favoritePassages.map((passage) => (
                <Link
                  key={passage}
                  href={`/passage/${passage.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-100"
                >
                  {passage}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Recent highlights
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              {recentHighlights.map((highlight) => (
                <li key={highlight}>• {highlight}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Share2 className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">
              Shared public study pages
            </h2>
          </div>
          <p className="mt-4 leading-7 text-blue-900">
            Public profiles can naturally extend into shareable study pages for
            saved passage work, devotionals, leader guides, and mentor-shaped
            reflection sets.
          </p>
          <Link
            href="/shared-studies"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-950 transition hover:text-blue-800"
          >
            Open shared studies
            <BookOpen className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
