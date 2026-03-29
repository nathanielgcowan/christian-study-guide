import Link from "next/link";
import { ArrowRight, CalendarRange, Church, Crown, Route, ScrollText } from "lucide-react";

const timelineStages = [
  "Creation and fall",
  "Patriarchs and covenant",
  "Kings and prophets",
  "Life, death, and resurrection of Jesus",
  "Early church and mission",
];

const storylineMoments = [
  {
    title: "Storyline mode",
    detail: "Follow the Bible as one unfolding story instead of isolated events.",
  },
  {
    title: "People and prophets",
    detail: "See where characters, kings, and prophets fit into the larger narrative.",
  },
  {
    title: "Passage placement",
    detail: "Learn where the chapter you are reading sits in redemptive history.",
  },
];

const timelineAnchors = [
  {
    era: "Primeval history",
    summary: "Creation, fall, flood, and Babel establish the need for redemption before Israel ever appears.",
  },
  {
    era: "Patriarchs",
    summary: "Abraham, Isaac, Jacob, and Joseph carry covenant promises forward toward nationhood and blessing.",
  },
  {
    era: "Exodus to kingdom",
    summary: "Moses, Sinai, conquest, judges, and kings shape Israel's worship, law, land, and longing for a faithful king.",
  },
  {
    era: "Prophets to Christ",
    summary: "Exile, return, silence, incarnation, cross, and resurrection bring the storyline to its center in Jesus.",
  },
  {
    era: "Church to new creation",
    summary: "The gospel goes to the nations through the church while history moves toward resurrection and renewal.",
  },
];

const timelineQuestions = [
  "Where does this passage sit in the larger Bible story?",
  "What covenant or promise is active at this moment?",
  "Which leaders, prophets, or kings are shaping the context?",
  "How does this part of the story point forward to Christ?",
];

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#7c2d12] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <CalendarRange className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">AI Bible Timeline</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-orange-50">
            Trace the biblical story from Genesis to Revelation through events, prophets, kings, and Christ.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-5">
          {timelineStages.map((stage, index) => (
            <article
              key={stage}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {index === 0 && <ScrollText className="h-5 w-5 text-[#1e40af]" />}
              {index === 1 && <Crown className="h-5 w-5 text-amber-700" />}
              {index >= 2 && <Church className="h-5 w-5 text-emerald-700" />}
              <p className="mt-4 text-sm font-semibold text-slate-900">{stage}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Route className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Bible storyline mode</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {storylineMoments.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-blue-200 bg-white p-5"
                >
                  <h3 className="text-base font-semibold text-blue-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-blue-900">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <h2 className="text-2xl font-semibold text-amber-950">Best next connections</h2>
            <p className="mt-4 text-sm leading-7 text-amber-950">
              Timeline study becomes much stronger when every event can open a passage,
              a character page, and a doctrine page from the same moment in the story.
            </p>
            <Link
              href="/characters"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
            >
              Open characters
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <ScrollText className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Timeline anchors</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {timelineAnchors.map((item) => (
              <article
                key={item.era}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.era}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="flex items-center gap-3 text-emerald-950">
            <Church className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Questions a good timeline should answer</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {timelineQuestions.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm leading-7 text-emerald-950"
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
