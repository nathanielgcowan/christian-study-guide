"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Save, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSearchHistory, saveSearchHistory } from "@/lib/persistence";

interface SearchResult {
  title: string;
  type: "Passage" | "Topic" | "Plan" | "Guide";
  description: string;
  href: string;
  tags: string[];
}

interface SearchHistoryItem {
  id: string;
  query: string;
  selected_result: string | null;
  created_at: string;
}

const SEARCH_HISTORY_KEY = "christian-study-guide:search-history";

const searchResults: SearchResult[] = [
  {
    title: "Anxiety and peace",
    type: "Topic",
    description:
      "A guided path for fear, overthinking, and learning to trust God again.",
    href: "/topics",
    tags: ["anxiety", "peace", "fear", "worry"],
  },
  {
    title: "Philippians 4:6-8",
    type: "Passage",
    description:
      "A core passage for worry, prayer, gratitude, and a guarded mind.",
    href: "/passage/philippians-4-6-8",
    tags: ["anxiety", "prayer", "mind", "peace"],
  },
  {
    title: "Prayer habit starter",
    type: "Guide",
    description:
      "A gentle daily rhythm for people who want to pray consistently but feel stuck.",
    href: "/prayer",
    tags: ["prayer", "habit", "discipline", "routine"],
  },
  {
    title: "Life of Jesus plan",
    type: "Plan",
    description:
      "A structured reading plan for people who want to focus on Christ directly.",
    href: "/reading-plans",
    tags: ["jesus", "gospels", "plan", "starter"],
  },
  {
    title: "Hope in suffering",
    type: "Topic",
    description:
      "Passages and reflections for discouragement, waiting, grief, and endurance.",
    href: "/topics",
    tags: ["hope", "suffering", "discouragement", "grief"],
  },
  {
    title: "Verse memorization",
    type: "Guide",
    description:
      "Flashcards and repeatable review for hiding Scripture in your heart.",
    href: "/memorize",
    tags: ["memory", "memorize", "review", "flashcards"],
  },
];

export default function SmartSearchPage() {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getSearchHistory();
          setHistory(data as SearchHistoryItem[]);
        } else {
          const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
          if (raw) {
            setHistory(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [supabase]);

  const filteredResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const activeFilters = selectedFilters.map((filter) => filter.toLowerCase());

    if (!normalized && activeFilters.length === 0) return searchResults;

    return searchResults.filter((result) => {
      const haystack = [
        result.title,
        result.type,
        result.description,
        ...result.tags,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalized || haystack.includes(normalized);
      const matchesFilters =
        activeFilters.length === 0 ||
        activeFilters.every((filter) => haystack.includes(filter));

      return matchesQuery && matchesFilters;
    });
  }, [query, selectedFilters]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    );
  };

  const persistSearch = (selectedResult?: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const persist = async () => {
      try {
        if (user) {
          const saved = await saveSearchHistory(trimmedQuery, selectedResult);
          setHistory((current) => [saved, ...current].slice(0, 20));
        } else {
          const nextHistory = [
            {
              id: `${Date.now()}`,
              query: trimmedQuery,
              selected_result: selectedResult || null,
              created_at: new Date().toISOString(),
            },
            ...history,
          ].slice(0, 20);
          setHistory(nextHistory);
          localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory));
        }

        setSaveFeedback("Search saved");
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
        <div className="text-gray-600">Loading smart search...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
            <Search className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-bold md:text-6xl">Smart Search</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Search by life situation, question, feeling, or spiritual need, not
            just by Bible reference.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try anxiety, forgiveness, prayer habit, grief, new believer..."
            className="w-full rounded-3xl border border-slate-200 bg-white py-5 pl-14 pr-5 text-sm text-slate-900 outline-none transition focus:border-[#1e40af]"
          />
        </div>

        <button
          onClick={() => persistSearch()}
          className={`mb-10 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
            saveFeedback
              ? "bg-emerald-100 text-emerald-900"
              : "bg-[#1e40af] text-white hover:bg-[#1e3a8a]"
          }`}
        >
          <Save className="h-4 w-4" />
          {saveFeedback || "Save search"}
        </button>

        <section className="mb-10 rounded-3xl border border-violet-200 bg-violet-50 p-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-violet-800" />
            <h2 className="text-2xl font-semibold text-violet-950">
              Search ideas
            </h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {["anxiety", "forgiveness", "new believer", "prayer", "hope"].map(
              (idea) => (
                <button
                  key={idea}
                  onClick={() => setQuery(idea)}
                  className="rounded-full border border-violet-300 bg-white px-4 py-2 text-sm font-semibold text-violet-900 transition hover:bg-violet-100"
                >
                  {idea}
                </button>
              ),
            )}
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-center gap-3 text-blue-950">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Stronger search direction</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              "Search by doctrine, emotion, life issue, person, or place",
              "Filter by audience, content type, and tradition",
              "Connect results to notes, maps, courses, and shared studies",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-4 text-sm text-blue-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-amber-900" />
            <h2 className="text-2xl font-semibold text-amber-950">
              Advanced search filters
            </h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {["book", "topic", "audience", "tradition", "saved", "guide"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedFilters.includes(filter)
                      ? "bg-amber-900 text-white"
                      : "bg-white text-amber-950 hover:bg-amber-100"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
          {selectedFilters.length > 0 ? (
            <p className="mt-4 text-sm text-amber-900">
              Filtering by: {selectedFilters.join(", ")}
            </p>
          ) : null}
        </section>

        {history.length > 0 && (
          <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              Recent searches
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setQuery(item.query)}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  {item.query}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-6">
          {filteredResults.map((result) => (
            <article
              key={`${result.type}-${result.title}`}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-900">
                    {result.type}
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">
                    {result.title}
                  </h2>
                </div>
                <Link
                  href={result.href}
                  onClick={() => persistSearch(result.title)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
                >
                  Open
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-4 leading-7 text-slate-600">{result.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <BrainCircuit className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Search that feels intelligent</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Search by theme, doctrine, person, place, or emotional state",
              "Suggest likely next passages and study paths from the query itself",
              "Connect search results to notes, mentor threads, and reading plans",
              "Use prior searches and saved items to rank what helps the user most",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
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
