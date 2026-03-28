"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  BookMarked,
  Cross,
  Network,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getTheologyTopics, saveTheologyTopic } from "@/lib/persistence";

const THEOLOGY_TOPICS_KEY = "christian-study-guide:theology-topics";

const doctrineTopics = [
  {
    title: "Salvation",
    summary: "Grace, faith, justification, and the new life believers receive in Christ.",
    verses: ["Ephesians 2:8-9", "Romans 5:1", "John 3:16"],
    views: "Broad Christian agreement on salvation by grace, with differences around order, assurance, and sacraments.",
  },
  {
    title: "Trinity",
    summary: "One God in three Persons: Father, Son, and Holy Spirit.",
    verses: ["Matthew 28:19", "John 1:1-14", "2 Corinthians 13:14"],
    views: "Historic orthodoxy affirms one essence and three Persons, while traditions vary in emphasis and language.",
  },
  {
    title: "Heaven",
    summary: "The hope of resurrection, the presence of God, and the renewal of all things.",
    verses: ["Revelation 21:1-4", "John 14:1-3", "Philippians 3:20-21"],
    views: "Traditions differ on intermediate state details, but center hope on resurrection and eternal life with God.",
  },
  {
    title: "Angels",
    summary: "God's messengers and servants in redemptive history.",
    verses: ["Hebrews 1:14", "Luke 1:26-38", "Psalm 91:11"],
    views: "Christian traditions affirm angels as created beings, while differing on how much attention believers should give them.",
  },
  {
    title: "Spiritual Warfare",
    summary: "Resisting evil, standing in Christ, and living alert with truth and prayer.",
    verses: ["Ephesians 6:10-18", "1 Peter 5:8-9", "James 4:7"],
    views: "Traditions differ in tone and practice, but all emphasize Christ's victory, holiness, and discernment.",
  },
];

const doctrineTools = [
  "Anchor every doctrine in key passages before later summaries or systematics.",
  "Show how doctrine shapes prayer, worship, obedience, suffering, and church life.",
  "Explain shared Christian agreement before surfacing denominational differences.",
  "Connect doctrine pages to character studies, timeline moments, and guided paths.",
];

const doctrineTracks = [
  {
    title: "Theology basics",
    detail: "Start with God, Scripture, sin, salvation, Christ, and the Holy Spirit before moving to harder doctrines.",
  },
  {
    title: "Christian life",
    detail: "Study grace, repentance, sanctification, prayer, assurance, and perseverance in a practical sequence.",
  },
  {
    title: "Future hope",
    detail: "Explore resurrection, heaven, judgment, the new creation, and how hope changes daily faithfulness.",
  },
  {
    title: "Spiritual realities",
    detail: "Follow angels, demons, spiritual warfare, authority in Christ, and discernment without sensationalism.",
  },
];

interface SavedTheologyTopic {
  id: string;
  title: string;
  focus: string;
  keyVerse: string;
  traditionView: string;
}

export default function TheologyExplorerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [savedTopics, setSavedTopics] = useState<SavedTheologyTopic[]>([]);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getTheologyTopics();
          setSavedTopics(
            (data as Array<{
              id: string;
              title: string;
              focus: string;
              key_verse: string | null;
              tradition_view: string | null;
            }>).map((item) => ({
              id: item.id,
              title: item.title,
              focus: item.focus,
              keyVerse: item.key_verse || "",
              traditionView: item.tradition_view || "",
            })),
          );
        } else {
          const raw = localStorage.getItem(THEOLOGY_TOPICS_KEY);
          if (raw) setSavedTopics(JSON.parse(raw));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveTopic = async (topic: (typeof doctrineTopics)[number]) => {
    try {
      if (user) {
        const saved = await saveTheologyTopic({
          title: topic.title,
          focus: topic.summary,
          key_verse: topic.verses[0],
          tradition_view: topic.views,
        });
        setSavedTopics((current) => [
          {
            id: saved.id,
            title: saved.title,
            focus: saved.focus,
            keyVerse: saved.key_verse || "",
            traditionView: saved.tradition_view || "",
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            title: topic.title,
            focus: topic.summary,
            keyVerse: topic.verses[0],
            traditionView: topic.views,
          },
          ...savedTopics,
        ];
        setSavedTopics(next);
        localStorage.setItem(THEOLOGY_TOPICS_KEY, JSON.stringify(next));
      }

      setSaveFeedback(`${topic.title} saved`);
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading theology explorer...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Cross className="h-4 w-4" />
              Theology explorer
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Explore doctrine with Scripture, clarity, and perspective.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              Study key Christian doctrines through anchor verses, simple explanations,
              and a respectful overview of denominational differences.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2">
          {doctrineTopics.map((topic) => (
            <article
              key={topic.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-[#0f172a]">{topic.title}</h2>
              <p className="mt-4 leading-7 text-slate-600">{topic.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {topic.verses.map((verse) => (
                  <Link
                    key={verse}
                    href={`/passage/${verse.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-100"
                  >
                    {verse}
                  </Link>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-semibold text-amber-950">Denominational views</p>
                <p className="mt-2 text-sm leading-6 text-amber-900">{topic.views}</p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveTopic(topic)}
                className="mt-6 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save topic
              </button>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Network className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Knowledge graph direction</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              The strongest theology experience links doctrines, people, passages,
              and themes together instead of leaving them as isolated cards.
            </p>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center justify-between gap-4 text-emerald-950">
              <div className="flex items-center gap-3">
                <BookMarked className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Saved topics</h2>
              </div>
              {saveFeedback ? <p className="text-sm font-medium">{saveFeedback}</p> : null}
            </div>
            <div className="mt-6 grid gap-3">
              {savedTopics.length > 0 ? (
                savedTopics.map((topic) => (
                  <article
                    key={topic.id}
                    className="rounded-2xl border border-emerald-200 bg-white p-4"
                  >
                    <p className="font-semibold text-slate-900">{topic.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{topic.keyVerse}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-6 text-emerald-900">
                  Save theology topics to build your doctrine trail.
                </p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/questions"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Open Bible questions
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/apologetics"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
              >
                Open apologetics
                <Shield className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <BookMarked className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Doctrine deep-dive direction</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Anchor doctrine pages in key verses before tradition summaries",
              "Connect every doctrine to people, passages, and storyline moments",
              "Show common Christian ground before denominational distinctions",
              "Turn each topic into a guided study and not just a saved card",
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

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Cross className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">How to study doctrine well</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {doctrineTools.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-7 text-blue-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <Shield className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Suggested doctrine tracks</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {doctrineTracks.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-amber-200 bg-white p-5"
              >
                <h3 className="text-lg font-semibold text-amber-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-amber-900">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
