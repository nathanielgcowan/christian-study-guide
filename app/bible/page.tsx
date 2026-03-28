"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Loader2, Search, Trophy } from "lucide-react";
import { BIBLE_CANON, TOTAL_BIBLE_CHAPTERS } from "@/lib/bible-canon";

type PassageResponse = {
  reference: string;
  text: string;
  translation_id?: string;
};

const BIBLE_READER_POSITION_KEY = "christian-study-guide:bible-reader-position";

export default function BiblePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookName, setSelectedBookName] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [quickReference, setQuickReference] = useState("");
  const [passage, setPassage] = useState<PassageResponse | null>(null);
  const [loadingPassage, setLoadingPassage] = useState(true);
  const [passageError, setPassageError] = useState("");

  const filteredBooks = BIBLE_CANON.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedBook =
    BIBLE_CANON.find((book) => book.name === selectedBookName) ?? BIBLE_CANON[0];

  const chapterOptions = useMemo(
    () => Array.from({ length: selectedBook.chapters }, (_, index) => index + 1),
    [selectedBook.chapters],
  );

  const chapterIndex = useMemo(() => {
    const bookIndex = BIBLE_CANON.findIndex((book) => book.name === selectedBook.name);
    return (
      BIBLE_CANON.slice(0, bookIndex).reduce((total, book) => total + book.chapters, 0) +
      selectedChapter
    );
  }, [selectedBook.name, selectedChapter]);

  useEffect(() => {
    const saved = localStorage.getItem(BIBLE_READER_POSITION_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { book?: string; chapter?: number };
      if (parsed.book && BIBLE_CANON.some((book) => book.name === parsed.book)) {
        setSelectedBookName(parsed.book);
      }
      if (parsed.chapter && parsed.chapter > 0) {
        setSelectedChapter(parsed.chapter);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(
      BIBLE_READER_POSITION_KEY,
      JSON.stringify({ book: selectedBook.name, chapter: selectedChapter }),
    );
  }, [selectedBook.name, selectedChapter]);

  useEffect(() => {
    let cancelled = false;

    const loadPassage = async () => {
      setLoadingPassage(true);
      setPassageError("");

      try {
        const reference = `${selectedBook.name} ${selectedChapter}`;
        const response = await fetch(
          `https://bible-api.com/${encodeURIComponent(reference)}?translation=web`,
        );

        if (!response.ok) {
          throw new Error("Failed to load chapter");
        }

        const data = (await response.json()) as PassageResponse;
        if (!cancelled) {
          setPassage(data);
        }
      } catch {
        if (!cancelled) {
          setPassage(null);
          setPassageError("This chapter could not be loaded right now.");
        }
      } finally {
        if (!cancelled) {
          setLoadingPassage(false);
        }
      }
    };

    void loadPassage();

    return () => {
      cancelled = true;
    };
  }, [selectedBook.name, selectedChapter]);

  const handlePickBook = (bookName: string) => {
    setSelectedBookName(bookName);
    setSelectedChapter(1);
  };

  const handleNextChapter = () => {
    if (selectedChapter < selectedBook.chapters) {
      setSelectedChapter((current) => current + 1);
      return;
    }

    const currentBookIndex = BIBLE_CANON.findIndex((book) => book.name === selectedBook.name);
    const nextBook = BIBLE_CANON[currentBookIndex + 1];
    if (nextBook) {
      setSelectedBookName(nextBook.name);
      setSelectedChapter(1);
    }
  };

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter((current) => current - 1);
      return;
    }

    const currentBookIndex = BIBLE_CANON.findIndex((book) => book.name === selectedBook.name);
    const previousBook = BIBLE_CANON[currentBookIndex - 1];
    if (previousBook) {
      setSelectedBookName(previousBook.name);
      setSelectedChapter(previousBook.chapters);
    }
  };

  const jumpToReference = (value: string) => {
    const normalized = value.trim().replace(/\s+/g, " ");
    const chapterMatch = normalized.match(/^(.*?)(\d+)(?::\d+)?$/);
    if (!chapterMatch) return;

    const candidateBook = chapterMatch[1].trim();
    const chapter = Number(chapterMatch[2]);
    const matchingBook = BIBLE_CANON.find(
      (book) => book.name.toLowerCase() === candidateBook.toLowerCase(),
    );

    if (!matchingBook || chapter < 1 || chapter > matchingBook.chapters) return;

    setSelectedBookName(matchingBook.name);
    setSelectedChapter(chapter);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <BookOpen className="mx-auto mb-6 h-16 w-16 text-[#d4af37]" />
          <h1 className="text-5xl font-bold md:text-6xl">The Holy Bible</h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-blue-100">
            Read from Genesis to Revelation, chapter by chapter, with a continuous
            Bible reader built for the whole canon.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-8">
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">
                <Search className="h-6 w-6" />
              </div>
              <input
                type="text"
                placeholder="Search for a book..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-white py-5 pl-16 pr-6 text-lg shadow-sm focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold text-[#0f172a]">Books of the Bible</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Pick any book, then keep reading forward chapter by chapter.
                  </p>
                </div>
                <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">
                  {TOTAL_BIBLE_CHAPTERS} chapters
                </div>
              </div>

              <div className="mt-6 max-h-[28rem] overflow-y-auto pr-2">
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredBooks.map((book) => (
                    <button
                      key={book.name}
                      type="button"
                      onClick={() => handlePickBook(book.name)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selectedBook.name === book.name
                          ? "border-[#1e40af] bg-blue-50"
                          : "border-zinc-200 bg-white hover:border-[#d4af37]"
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#d4af37]">
                        {book.testament} Testament
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-[#0f172a]">
                        {book.name}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-600">{book.chapters} chapters</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-8">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#d4af37]">
                    Front-to-back reader
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#0f172a]">
                    {selectedBook.name} {selectedChapter}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    Chapter {chapterIndex} of {TOTAL_BIBLE_CHAPTERS}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedBook.name}
                    onChange={(e) => handlePickBook(e.target.value)}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1e40af]"
                  >
                    {BIBLE_CANON.map((book) => (
                      <option key={book.name} value={book.name}>
                        {book.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(Number(e.target.value))}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1e40af]"
                  >
                    {chapterOptions.map((chapter) => (
                      <option key={chapter} value={chapter}>
                        Chapter {chapter}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePreviousChapter}
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={selectedBook.name === "Genesis" && selectedChapter === 1}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous chapter
                </button>
                <button
                  type="button"
                  onClick={handleNextChapter}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={selectedBook.name === "Revelation" && selectedChapter === 22}
                >
                  Next chapter
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 rounded-3xl border border-zinc-100 bg-zinc-50 p-8">
                {loadingPassage ? (
                  <div className="flex items-center gap-3 text-zinc-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading chapter...
                  </div>
                ) : passageError ? (
                  <p className="text-sm font-medium text-red-600">{passageError}</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#1e40af]">
                      {passage?.translation_id?.toUpperCase() || "WEB"} Translation
                    </p>
                    <div className="mt-5 whitespace-pre-wrap text-lg leading-9 text-[#0f172a]">
                      {passage?.text}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-semibold text-[#0f172a]">Quick Verse Lookup</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-medium">Enter a Bible Reference</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g. John 3:16"
                      value={quickReference}
                      onChange={(e) => setQuickReference(e.target.value)}
                      className="flex-1 rounded-2xl border border-zinc-200 px-6 py-4 focus:border-[#d4af37] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => jumpToReference(quickReference)}
                      className="rounded-2xl bg-[#d4af37] px-10 py-4 font-semibold text-[#0f172a] transition hover:bg-[#c9a66b]"
                    >
                      Go
                    </button>
                  </div>
                </div>

                <div className="pt-10 text-sm text-zinc-600">
                  Try these examples:
                  <br />
                  {["John 3:16", "Psalm 23:1", "Philippians 4:13"].map((reference, index) => (
                    <span key={reference}>
                      {index > 0 ? ", " : ""}
                      <button
                        type="button"
                        className="text-[#1e40af] hover:underline"
                        onClick={() => {
                          setQuickReference(reference);
                          jumpToReference(reference);
                        }}
                      >
                        {reference}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-20 text-center">
          <p className="mx-auto max-w-2xl text-2xl italic text-[#1e40af]">
            “Your word is a lamp to my feet and a light to my path.”
          </p>
          <p className="mt-3 text-sm text-zinc-500">— Psalm 119:105</p>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <CheckCircle2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Whole-Bible progress tracking</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Track book-by-book and chapter-by-chapter completion",
                "Show yearly read-through goals and remaining chapters",
                "Mark Old Testament, New Testament, and whole-Bible milestones",
                "Bring progress back into the dashboard and Today flow",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <Trophy className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Long-term reading layer</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-amber-950">
              The Bible reader becomes much more motivating once users can see books completed,
              chapters remaining, and their place inside a yearly read-through.
            </p>
            <Link
              href="/reading-progress"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
            >
              Open reading progress
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </div>
    </div>
  );
}
