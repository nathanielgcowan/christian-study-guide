import Link from "next/link";
import { ArrowRight, Crown, Heart, Milestone, ScrollText, Shield, UserRound } from "lucide-react";

const characters = [
  "David",
  "Moses",
  "Abraham",
  "Peter",
  "Paul",
];

const deepDiveLayers = [
  "Biography and calling",
  "Key life events and turning points",
  "Anchor passages and lessons learned",
  "Timeline placement and doctrine connections",
];

const characterProfiles = [
  {
    name: "David",
    focus: "Kingship, repentance, worship, covenant hope, and the tension between calling and failure.",
  },
  {
    name: "Moses",
    focus: "Deliverance, mediation, law, leadership pressure, and God's holiness and mercy.",
  },
  {
    name: "Abraham",
    focus: "Promise, faith, waiting, testing, and the beginnings of covenant history.",
  },
  {
    name: "Peter",
    focus: "Discipleship, weakness, restoration, bold witness, and growth through failure.",
  },
  {
    name: "Paul",
    focus: "Mission, theology, suffering, church planting, and gospel clarity among the nations.",
  },
];

const characterQuestions = [
  "What does this person reveal about God's character and redemptive plan?",
  "What strengths and weaknesses stand out honestly in their life?",
  "Which passages best summarize their calling, conflict, and legacy?",
  "How does their story connect to Christ and the wider biblical storyline?",
];

export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] via-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <UserRound className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Bible Character Explorer</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            Explore biographies, key events, major verses, and lessons from the people of Scripture.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-5">
          {characters.map((character, index) => (
            <article
              key={character}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {index === 0 && <Crown className="h-5 w-5 text-amber-700" />}
              {index === 1 && <Shield className="h-5 w-5 text-[#1e40af]" />}
              {index >= 2 && <Heart className="h-5 w-5 text-emerald-700" />}
              <p className="mt-4 text-sm font-semibold text-slate-900">{character}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <ScrollText className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Character deep dives</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {deepDiveLayers.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-medium text-emerald-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Milestone className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Why this matters</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-blue-900">
              People remember stories before systems. Character pages help users attach
              faith, suffering, leadership, repentance, and mission to real people in the text.
            </p>
            <Link
              href="/timeline"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Open timeline
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <UserRound className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Character profile directions</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {characterProfiles.map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.focus}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-violet-200 bg-violet-50 p-8">
          <div className="flex items-center gap-3 text-violet-950">
            <Milestone className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Questions worth asking about every person</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {characterQuestions.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-violet-200 bg-white p-5 text-sm leading-7 text-violet-950"
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
