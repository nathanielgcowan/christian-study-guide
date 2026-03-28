"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Database, Languages, Scale, SplitSquareVertical, TableProperties } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getTranslationCompareStates,
  saveTranslationCompareState,
} from "@/lib/persistence";

const TRANSLATION_COMPARE_STATES_KEY = "christian-study-guide:translation-compare-states";

const comparisonRows = [
  {
    verse: "John 3:16",
    esv: "For God so loved the world, that he gave his only Son...",
    niv: "For God so loved the world that he gave his one and only Son...",
    kjv: "For God so loved the world, that he gave his only begotten Son...",
  },
  {
    verse: "Romans 5:1",
    esv: "Therefore, since we have been justified by faith...",
    niv: "Therefore, since we have been justified through faith...",
    kjv: "Therefore being justified by faith...",
  },
];

interface SavedTranslationCompareState {
  id: string;
  reference: string;
  primaryTranslation: string;
  secondaryTranslation: string;
  tertiaryTranslation: string;
  notes: string;
}

export default function TranslationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedStates, setSavedStates] = useState<SavedTranslationCompareState[]>([]);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getTranslationCompareStates();
          setSavedStates(
            (data as Array<{
              id: string;
              reference: string;
              primary_translation: string;
              secondary_translation: string;
              tertiary_translation: string;
              notes: string | null;
            }>).map((item) => ({
              id: item.id,
              reference: item.reference,
              primaryTranslation: item.primary_translation,
              secondaryTranslation: item.secondary_translation,
              tertiaryTranslation: item.tertiary_translation,
              notes: item.notes || "",
            })),
          );
        } else {
          const raw = localStorage.getItem(TRANSLATION_COMPARE_STATES_KEY);
          if (raw) setSavedStates(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveState = async () => {
    const payload = {
      reference: "John 3:16",
      primary_translation: "ESV",
      secondary_translation: "NIV",
      tertiary_translation: "KJV",
      notes: "Useful for comparing readability and doctrinal phrasing in evangelistic passages.",
    };

    try {
      if (user) {
        const saved = await saveTranslationCompareState(payload);
        setSavedStates((current) => [
          {
            id: saved.id,
            reference: saved.reference,
            primaryTranslation: saved.primary_translation,
            secondaryTranslation: saved.secondary_translation,
            tertiaryTranslation: saved.tertiary_translation,
            notes: saved.notes || "",
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            reference: payload.reference,
            primaryTranslation: payload.primary_translation,
            secondaryTranslation: payload.secondary_translation,
            tertiaryTranslation: payload.tertiary_translation,
            notes: payload.notes,
          },
          ...savedStates,
        ];
        setSavedStates(next);
        localStorage.setItem(TRANSLATION_COMPARE_STATES_KEY, JSON.stringify(next));
      }

      setSaveFeedback("Comparison saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      window.setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading translation compare...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <Languages className="h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Translation Comparison</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Compare wording, tone, and translation philosophy side by side so users can study with more clarity.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <TableProperties className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Side-by-side verse view</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Verse</th>
                  <th className="px-6 py-4 font-semibold">ESV</th>
                  <th className="px-6 py-4 font-semibold">NIV</th>
                  <th className="px-6 py-4 font-semibold">KJV</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.verse} className="border-t border-slate-200 align-top">
                    <td className="px-6 py-5 font-semibold text-slate-900">{row.verse}</td>
                    <td className="px-6 py-5 leading-6 text-slate-600">{row.esv}</td>
                    <td className="px-6 py-5 leading-6 text-slate-600">{row.niv}</td>
                    <td className="px-6 py-5 leading-6 text-slate-600">{row.kjv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <SplitSquareVertical className="h-6 w-6 text-violet-900" />
            <h2 className="mt-4 text-2xl font-semibold text-violet-950">Study depth</h2>
            <p className="mt-4 text-sm leading-6 text-violet-900">
              Useful for seeing where wording changes affect tone, precision, or readability.
            </p>
          </article>
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <Scale className="h-6 w-6 text-emerald-900" />
            <h2 className="mt-4 text-2xl font-semibold text-emerald-950">Translation philosophy</h2>
            <p className="mt-4 text-sm leading-6 text-emerald-900">
              Surface formal versus dynamic translation choices so beginners understand the differences.
            </p>
          </article>
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <Languages className="h-6 w-6 text-amber-900" />
            <h2 className="mt-4 text-2xl font-semibold text-amber-950">Best next step</h2>
            <p className="mt-4 text-sm leading-6 text-amber-900">
              Connect this to the passage page so users can compare translations without leaving their study flow.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="flex items-center gap-3 text-emerald-950">
            <Database className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Real-data comparison direction</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Bring in structured translation metadata instead of relying on fixed sample rows.",
              "Show why wording differs, not just that it differs.",
              "Connect comparison notes back to passage study, doctrine, and memorization flows.",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm leading-6 text-emerald-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">Saved comparisons</h2>
            <button
              type="button"
              onClick={handleSaveState}
              className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Save comparison
            </button>
          </div>
          {saveFeedback ? (
            <p className="mt-3 text-sm font-semibold text-emerald-700">{saveFeedback}</p>
          ) : null}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {savedStates.length > 0 ? (
              savedStates.map((state) => (
                <article
                  key={state.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{state.reference}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {state.primaryTranslation} • {state.secondaryTranslation} • {state.tertiaryTranslation}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{state.notes}</p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                Save translation compare states so preferred verse comparisons carry across devices.
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Translation depth worth adding</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Explain why wording changes matter in study, doctrine, and memorization",
              "Compare readability, literalness, and emphasis in one place",
              "Let users jump from a comparison row straight into the passage page",
              "Tie translation notes into commentary and cross-reference panels",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700"
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
