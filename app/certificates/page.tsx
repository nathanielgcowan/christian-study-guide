"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Award,
  BadgeCheck,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getCertificates,
  saveCertificate,
  updateCertificate,
} from "../../lib/persistence";

const CERTIFICATES_KEY = "christian-study-guide:certificates";

const certificates = [
  {
    title: "Foundations of Christianity",
    reward: "Certificate of completion",
    detail:
      "Awarded when a user finishes the full guided path, prayer prompts, quiz checks, and final review.",
  },
  {
    title: "Life of Jesus track",
    reward: "Gospel Explorer badge",
    detail:
      "Recognizes completion of the reading path, study reflections, and a final course milestone.",
  },
  {
    title: "Theology Basics",
    reward: "Course distinction badge",
    detail:
      "Adds a more serious learning milestone for doctrine-focused users and church classes.",
  },
];

export default function CertificatesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [savedCertificates, setSavedCertificates] = useState<
    Array<{
      id: string;
      title: string;
      reward: string;
      status: string;
      shareCardState: string;
    }>
  >([]);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getCertificates();
          setSavedCertificates(
            (
              data as Array<{
                id: string;
                title: string;
                reward: string;
                status: string;
                share_card_state: string;
              }>
            ).map((item) => ({
              id: item.id,
              title: item.title,
              reward: item.reward,
              status: item.status,
              shareCardState: item.share_card_state,
            })),
          );
        } else {
          const raw = localStorage.getItem(CERTIFICATES_KEY);
          if (raw) setSavedCertificates(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleEarnCertificate = async (title: string, reward: string) => {
    try {
      if (user) {
        const saved = await saveCertificate({
          title,
          reward,
          status: "earned",
          share_card_state: "private",
        });
        setSavedCertificates((current) => [
          {
            id: saved.id,
            title: saved.title,
            reward: saved.reward,
            status: saved.status,
            shareCardState: saved.share_card_state,
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            title,
            reward,
            status: "earned",
            shareCardState: "private",
          },
          ...savedCertificates,
        ];
        setSavedCertificates(next);
        localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(next));
      }
      setSaveFeedback("Certificate earned");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  const handleToggleShare = async (id: string) => {
    const existing = savedCertificates.find((item) => item.id === id);
    if (!existing) return;
    const nextState =
      existing.shareCardState === "shared" ? "private" : "shared";

    try {
      if (user) {
        await updateCertificate({ id, share_card_state: nextState });
      }
      const next = savedCertificates.map((item) =>
        item.id === id ? { ...item, shareCardState: nextState } : item,
      );
      setSavedCertificates(next);
      if (!user) localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(next));
      setSaveFeedback("Certificate updated");
    } catch {
      setSaveFeedback("Update failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4" />
              Certificates and completion rewards
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Make learning paths feel like real journeys with meaningful
              completion moments.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              Certificates, distinction badges, and course milestones give users
              a clear sense of progress without turning Bible learning into
              empty achievement hunting.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-3">
          {certificates.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Award className="h-6 w-6 text-[#1e40af]" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm font-semibold text-amber-700">
                {item.reward}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {item.detail}
              </p>
              <button
                type="button"
                onClick={() => handleEarnCertificate(item.title, item.reward)}
                className="mt-6 rounded-2xl bg-[#1e40af] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Earn certificate
              </button>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              Saved certificates
            </h2>
            {saveFeedback ? (
              <p className="text-sm font-semibold text-emerald-700">
                {saveFeedback}
              </p>
            ) : null}
          </div>
          {savedCertificates.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              Earn a certificate to keep completion milestones across devices.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {savedCertificates.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-amber-700">
                    {item.reward}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                    {item.status} • {item.shareCardState}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleToggleShare(item.id)}
                    className="mt-4 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white"
                  >
                    {item.shareCardState === "shared"
                      ? "Make private"
                      : "Mark shared"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <BadgeCheck className="h-6 w-6 text-emerald-950" />
            <h2 className="mt-4 text-2xl font-semibold text-emerald-950">
              For learners
            </h2>
            <p className="mt-4 text-sm leading-7 text-emerald-900">
              Completion rewards help users see that they are actually growing
              through Scripture, not just clicking through features.
            </p>
          </article>
          <article className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <ShieldCheck className="h-6 w-6 text-violet-950" />
            <h2 className="mt-4 text-2xl font-semibold text-violet-950">
              For churches
            </h2>
            <p className="mt-4 text-sm leading-7 text-violet-900">
              Churches and leaders can use certificates for onboarding tracks,
              class completion, and discipleship cohorts.
            </p>
          </article>
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <Trophy className="h-6 w-6 text-amber-950" />
            <h2 className="mt-4 text-2xl font-semibold text-amber-950">
              For retention
            </h2>
            <p className="mt-4 text-sm leading-7 text-amber-900">
              Completion moments pair especially well with XP, badges, guided
              paths, and dashboard celebrations.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Best next step</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-900">
            The strongest version of this feature is automatic certificate
            unlocking when a user finishes a guided path or course, paired with
            a printable and shareable completion card.
          </p>
        </section>
      </main>
    </div>
  );
}
