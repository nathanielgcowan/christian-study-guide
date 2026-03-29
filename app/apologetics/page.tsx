import Link from "next/link";
import { ArrowRight, BadgeHelp, BookOpen, Shield, Sparkles } from "lucide-react";

const topics = [
  {
    title: "Evidence for the resurrection",
    summary: "Historical claims, empty tomb arguments, eyewitness testimony, and the rise of the early church.",
    verses: ["1 Corinthians 15", "Luke 24", "John 20"],
  },
  {
    title: "Reliability of the Bible",
    summary: "Transmission, manuscript confidence, fulfilled prophecy, and the Bible's unified message.",
    verses: ["2 Timothy 3:16", "2 Peter 1:20-21", "Psalm 19"],
  },
  {
    title: "Existence of God",
    summary: "Creation, moral reasoning, meaning, contingency, and the biblical witness to God's self-revelation.",
    verses: ["Romans 1:20", "Psalm 19", "Acts 17"],
  },
  {
    title: "Problem of evil",
    summary: "Suffering, human rebellion, divine justice, hope, and the cross of Christ.",
    verses: ["Job 38-42", "Romans 8", "Habakkuk 1-3"],
  },
];

const apologeticsPrinciples = [
  "Start with Scripture before arguments, and let the Bible frame the question.",
  "Use historical reasoning and evidence as supports, not replacements, for revelation.",
  "Answer objections with patience, clarity, and humility rather than trying to win a fight.",
  "Connect apologetics to discipleship so truth leads to worship, trust, and obedience.",
];

const commonObjections = [
  {
    title: "Can we trust the resurrection accounts?",
    detail: "Compare the Gospel witnesses, Paul's early testimony in 1 Corinthians 15, and the transformation of frightened disciples into public witnesses.",
  },
  {
    title: "If God is good, why is there suffering?",
    detail: "Bring together creation, fall, lament, the cross, resurrection hope, and the promise that evil will not have the last word.",
  },
  {
    title: "Is the Bible just a human book?",
    detail: "Explore the Bible's unified storyline, prophetic texture, manuscript reliability, and Christ-centered coherence across centuries.",
  },
  {
    title: "Is faith irrational?",
    detail: "Show that biblical faith is trust grounded in God's character, Christ's work, and the truthfulness of revelation, not blind wishing.",
  },
];

export default function ApologeticsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#7c2d12] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Christian apologetics mode
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Answer hard questions with confidence and humility.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              This mode helps users engage evidence, suffering, doubt, and worldview questions
              with biblical and historical grounding.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2">
          {topics.map((topic) => (
            <article
              key={topic.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <BadgeHelp className="h-6 w-6 text-[#7c2d12]" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {topic.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{topic.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {topic.verses.map((verse) => (
                  <Link
                    key={verse}
                    href={`/passage/${verse.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
                  >
                    {verse}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">How this should feel</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              Strong apologetics content should combine key verses, historical context,
              common objections, and a tone that is truthful without becoming combative.
            </p>
          </div>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <BookOpen className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Best companion mode</h2>
            </div>
            <Link
              href="/questions"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Open Bible questions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <Shield className="h-6 w-6 text-[#7c2d12]" />
            <h2 className="text-2xl font-semibold">Core apologetics principles</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {apologeticsPrinciples.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <BadgeHelp className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Common objections to explore</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {commonObjections.map((item) => (
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
