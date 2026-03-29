import { Compass, MapPinned, Route } from "lucide-react";
import BibleMapsClient from "@/components/BibleMapsClient";

const maps = [
  {
    title: "Paul's missionary journeys",
    summary: "Trace key cities, churches, and turning points across Acts and the epistles.",
    places: ["Antioch", "Philippi", "Corinth", "Ephesus", "Rome"],
    accent: "from-blue-950 via-indigo-700 to-cyan-400",
  },
  {
    title: "Exodus route",
    summary: "Explore the movement from Egypt through the wilderness toward the promised land.",
    places: ["Egypt", "Red Sea", "Sinai", "Kadesh", "Jericho"],
    accent: "from-amber-950 via-orange-700 to-yellow-300",
  },
  {
    title: "Jesus' ministry map",
    summary: "Follow the major places Jesus taught, healed, and traveled during His earthly ministry.",
    places: ["Nazareth", "Capernaum", "Galilee", "Bethany", "Jerusalem"],
    accent: "from-emerald-950 via-teal-700 to-sky-300",
  },
];

const geographyInsights = [
  "Locations often explain why a journey, miracle, exile, or mission turn mattered.",
  "Maps help readers connect isolated place names into one moving historical story.",
  "Trade routes, seas, wilderness regions, and imperial cities all shape the Bible's setting.",
  "Geography can illuminate themes like exile, pilgrimage, kingdom, mission, and return.",
];

const mapQuestions = [
  "Why does this place matter in the storyline?",
  "Which passages happen here or nearby?",
  "What political, cultural, or covenant setting shaped this moment?",
  "How does movement between places drive the biblical narrative forward?",
];

export default function BibleMapsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#14532d] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <MapPinned className="h-4 w-4" />
              AI Bible maps
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Learn Scripture through movement, geography, and story.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Interactive Bible maps help users see where events happened and why
              location matters in the flow of redemptive history.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <BibleMapsClient maps={maps} />

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <Compass className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Why Bible geography matters</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {geographyInsights.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Route className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Questions every map should answer</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {mapQuestions.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-7 text-blue-950"
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
