import Link from "next/link";
import { Bookmark, FolderHeart, Layers3 } from "lucide-react";

const collections = [
  {
    name: "Anxiety verses",
    description: "A personal folder of Scriptures for peace and trust.",
    verses: ["Philippians 4:6-8", "Matthew 6:25-34", "Psalm 46"],
  },
  {
    name: "Family devotion",
    description: "Passages and prompts saved for home discipleship.",
    verses: ["Deuteronomy 6", "Psalm 23", "John 15"],
  },
  {
    name: "Sermon seeds",
    description: "Starter passages, key ideas, and message frameworks.",
    verses: ["James 1:2-4", "Romans 8", "1 Peter 5:7"],
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <FolderHeart className="h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Verse Collections</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Organize saved verses and study themes into curated folders with a
            stronger purpose than raw bookmarks.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <article
              key={collection.name}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Layers3 className="h-6 w-6 text-violet-700" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {collection.name}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {collection.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {collection.verses.map((verse) => (
                  <Link
                    key={verse}
                    href={`/passage/${verse.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-full bg-violet-50 px-3 py-2 text-sm font-medium text-violet-900 transition hover:bg-violet-100"
                  >
                    {verse}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <Bookmark className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Why collections matter</h2>
          </div>
          <p className="mt-4 leading-7 text-amber-950">
            Collections give bookmarks a purpose. Instead of one flat list, they
            become reusable Scripture sets for prayer, teaching, family life, or
            personal formation.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <FolderHeart className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Collection builder ideas</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Topical folders like forgiveness, suffering, holiness, and hope",
              "Leader folders for sermons, youth lessons, and group discussions",
              "Family folders for weekly devotions and dinner-table questions",
              "Personal folders for answered prayer, mentor takeaways, and memory verses",
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
