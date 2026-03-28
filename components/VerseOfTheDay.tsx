import { Heart } from "lucide-react";

type VerseData = {
  reference: string;
  text: string;
  translation: string;
};

const seedVerses: VerseData[] = [
  {
    reference: "John 3:16",
    text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    translation: "WEB",
  },
  {
    reference: "Psalm 23:1",
    text: "Yahweh is my shepherd: I shall lack nothing.",
    translation: "WEB",
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ, who strengthens me.",
    translation: "WEB",
  },
  {
    reference: "Romans 8:28",
    text: "We know that all things work together for good for those who love God, to those who are called according to his purpose.",
    translation: "WEB",
  },
];

function getTodayVerse() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
  );

  return seedVerses[dayOfYear % seedVerses.length];
}

function formatToday() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export default function VerseOfTheDay() {
  const verse = getTodayVerse();

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="rounded-lg bg-accent p-2">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-semibold text-text-primary">Verse of the Day</h2>
          <span className="rounded-full bg-surface-hover px-3 py-1 text-sm text-text-muted">
            {formatToday()}
          </span>
        </div>

        <div className="card card-elevated p-8 text-center shadow-glow md:p-12">
          <div className="mb-8 font-serif text-2xl italic leading-relaxed text-text-primary md:text-3xl">
            "{verse.text}"
          </div>
          <div className="mb-4 text-xl font-semibold text-primary md:text-2xl">
            {verse.reference}
          </div>
          <div className="badge badge-accent inline-flex items-center gap-2">
            <span>{verse.translation} Translation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
