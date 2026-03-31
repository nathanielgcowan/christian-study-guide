import { Compass, Landmark, Sparkles } from "lucide-react";
import BibleWorldMapSection from "../../components/BibleWorldMapSection";

export default function BibleWorldPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] pb-16">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Ancient world with MapGL
            </div>
            <h1 className="mt-6 text-5xl font-bold md:text-6xl">
              Explore the land of Jesus through a real interactive map.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Instead of a static image, this page now uses MapLibre GL to
              create a more atmospheric Jesus-era world explorer with historical
              regions, route tracing, and curated locations across Galilee and
              Judea.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Atmosphere modes",
              detail:
                "Switch the map between dawn, midday, and evening to change the feel of the land.",
              icon: Sparkles,
            },
            {
              title: "Historical focus",
              detail:
                "Jump between Galilee, Jerusalem, and the Judean wilderness with curated presets.",
              icon: Compass,
            },
            {
              title: "Jesus-era markers",
              detail:
                "Open location notes for Nazareth, Capernaum, Bethlehem, Bethany, and Jerusalem.",
              icon: Landmark,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <Icon className="h-6 w-6 text-blue-700" />
                <h2 className="mt-4 text-xl font-semibold text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.detail}
                </p>
              </article>
            );
          })}
        </div>

        <BibleWorldMapSection />

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">
            How to use it
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Drag to explore, zoom in to study the Galilee and Jerusalem
            corridors, click markers for Jesus-era notes, and use the preset
            cards to move through the landscape like a guided historical scene.
          </p>
        </div>
      </section>
    </main>
  );
}
