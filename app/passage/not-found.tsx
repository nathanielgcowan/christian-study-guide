import Link from "next/link";
import { ArrowLeft, BookOpen, Home } from "lucide-react";

export default function VerseNotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#0f172a]">
          <BookOpen className="h-12 w-12 text-[#d4af37]" />
        </div>

        <h1 className="text-5xl font-bold text-[#0f172a] mb-4">
          Verse Not Found
        </h1>

        <p className="text-zinc-600 mb-10">
          We couldn’t find that Bible reference.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="btn-gold flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-lg font-semibold"
          >
            <Home className="h-5 w-5" />
            Return to Homepage
          </Link>

          <Link
            href="/bible"
            className="border-2 border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af] hover:text-white flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-lg font-semibold transition"
          >
            Browse All Bible Books
          </Link>
        </div>

        <div className="mt-12 text-sm text-zinc-500">
          Try these examples:
          <br />
          John 3:16 • Romans 8:28 • Psalm 23 • Ephesians 2:8-9
        </div>
      </div>
    </div>
  );
}
