import Link from "next/link";
import { ArrowRight, Compass, ImageIcon, MapPinned, Sparkles, Sunrise, Waypoints } from "lucide-react";

const visualStories = [
  {
    title: "Psalm 23",
    description: "A visual meditation on the Shepherd, peace, and the nearness of God.",
    href: "/passage/psalm-23",
    accent: "from-emerald-900 via-emerald-700 to-lime-500",
    icon: Sunrise,
    verse: "The Lord is my shepherd",
  },
  {
    title: "James 1:2-4",
    description: "A Scripture art card for trials, endurance, and mature faith.",
    href: "/passage/james-1-2-4",
    accent: "from-violet-900 via-fuchsia-700 to-amber-300",
    icon: Sparkles,
    verse: "Trials produce steadfastness",
  },
  {
    title: "Resurrection Hope",
    description: "A shareable visual around the empty tomb and the promise of new life.",
    href: "/passage/john-20-1-18",
    accent: "from-sky-950 via-blue-700 to-amber-400",
    icon: ImageIcon,
    verse: "He is risen",
  },
];

const mapGallery = [
  {
    title: "Paul's missionary journeys",
    accent: "from-blue-950 via-indigo-700 to-cyan-400",
    icon: Waypoints,
    label: "Cities, churches, epistles",
  },
  {
    title: "Exodus route",
    accent: "from-amber-950 via-orange-700 to-yellow-300",
    icon: Compass,
    label: "Wilderness, law, deliverance",
  },
  {
    title: "Jesus' ministry map",
    accent: "from-emerald-950 via-teal-700 to-sky-300",
    icon: MapPinned,
    label: "Galilee to Jerusalem",
  },
];

export default function ImagesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <ImageIcon className="h-4 w-4" />
              Visual Bible gallery
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Add images, maps, and visual study layers to the Scripture experience.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              These visuals make the app feel more alive: shareable Scripture art,
              map previews, and image-driven entry points into passages.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section>
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Sparkles className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-3xl font-semibold">Scripture images</h2>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {visualStories.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className={`relative aspect-[4/3] bg-gradient-to-br ${item.accent}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.3),transparent_45%)]" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                        Scripture visual
                      </div>
                      <item.icon className="h-9 w-9 text-white/90" />
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                        {item.verse}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-100">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
                  >
                    Study this passage
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <MapPinned className="h-6 w-6 text-[#14532d]" />
            <h2 className="text-3xl font-semibold">Map previews</h2>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {mapGallery.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className={`relative aspect-[4/3] bg-gradient-to-br ${item.accent}`}>
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,transparent_35%,rgba(15,23,42,0.28)_100%)]" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                        Map layer
                      </div>
                      <item.icon className="h-9 w-9 text-white/90" />
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                        {item.label}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <Link
                    href="/maps"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
                  >
                    Open Bible maps
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
