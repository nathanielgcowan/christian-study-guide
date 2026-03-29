'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Shield, Target } from 'lucide-react';

const topics = [
  {
    name: 'Anxiety',
    description: 'Scriptures for peace, trust, and renewing the mind.',
    passages: ['Philippians 4:6-8', 'Matthew 6:25-34', '1 Peter 5:7'],
  },
  {
    name: 'Forgiveness',
    description: 'A path through grace, mercy, and reconciliation.',
    passages: ['Colossians 3:13', 'Ephesians 4:31-32', 'Matthew 18:21-35'],
  },
  {
    name: 'Hope',
    description: 'Verses for suffering, waiting, and confidence in God.',
    passages: ['Romans 8:18-39', 'Isaiah 40:28-31', 'Lamentations 3:21-24'],
  },
  {
    name: 'Prayer',
    description: 'Passages that shape a deeper, steadier prayer life.',
    passages: ['Luke 11:1-4', 'Psalm 5:3', '1 Thessalonians 5:16-18'],
  },
  {
    name: 'New Believer',
    description: 'A starter Scripture path for faith foundations.',
    passages: ['John 3', 'Ephesians 2:1-10', 'Romans 5'],
    href: '/new-believers',
  },
  {
    name: 'Spiritual Warfare',
    description: 'Passages for standing firm, resisting evil, and walking in Christ\'s victory.',
    passages: ['Ephesians 6:10-18', 'James 4:7', '1 Peter 5:8-9'],
  },
];

const topicUseCases = [
  "Start with a current struggle like anxiety, fear, or grief.",
  "Follow a Scripture path through a doctrine like grace, salvation, or prayer.",
  "Use topics as a small-group or mentoring starting point.",
  "Turn a topic into a custom reading plan, mentor prompt, or memorization set.",
];

export default function TopicsPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return topics;
    return topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(normalizedQuery) ||
        topic.description.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  const getTopicHref = (topic: (typeof topics)[number]) =>
    topic.href ?? `/passage/${topic.passages[0].toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Bible Topic Explorer</h1>
              <p className="mt-1 text-blue-100">
                Start with a struggle or theme and follow a guided path through Scripture.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <h2 className="text-2xl font-semibold text-blue-950">Theology Explorer</h2>
            <p className="mt-4 leading-7 text-blue-900">
              Explore salvation, Trinity, heaven, angels, and spiritual warfare with
              key verses, explanations, and denominational views.
            </p>
            <Link
              href="/theology"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Open theology explorer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <h2 className="text-2xl font-semibold text-amber-950">Apologetics Mode</h2>
            <p className="mt-4 leading-7 text-amber-900">
              Add a layer for resurrection, reliability of Scripture, existence of God,
              and the problem of evil.
            </p>
            <Link
              href="/apologetics"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-amber-300 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
            >
              Open apologetics mode
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <div className="relative mb-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics like anxiety, forgiveness, hope..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1e40af]"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((topic) => (
            <article
              key={topic.name}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-[#0f172a]">{topic.name}</h2>
              <p className="mt-3 text-gray-600">{topic.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {topic.passages.map((passage) => (
                  <Link
                    key={passage}
                    href={`/passage/${passage.toLowerCase().replace(/\s+/g, '-')}`}
                    className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-100"
                  >
                    {passage}
                  </Link>
                ))}
              </div>
              <Link
                href={getTopicHref(topic)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] hover:text-[#1e3a8a]"
              >
                Start Topic Path
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <Shield className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Best ways to use topic study</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {topicUseCases.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
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
