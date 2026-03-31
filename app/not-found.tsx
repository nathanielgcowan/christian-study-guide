import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Large Icon */}
        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-[#0f172a] text-white">
          <BookOpen className="h-16 w-16 text-[#d4af37]" />
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-bold text-[#0f172a] mb-4 tracking-tighter">
          404
        </h1>

        <h2 className="text-4xl font-semibold text-[#1e40af] mb-6">
          Page Not Found
        </h2>

        <p className="text-xl text-zinc-600 mb-12 max-w-md mx-auto">
          Sorry, the Bible study or page you&apos;re looking for could not be
          found. It may have been moved or doesn&apos;t exist yet.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-gold flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-lg font-semibold"
          >
            <Home className="h-5 w-5" />
            Go to Homepage
          </Link>

          <Link
            href="/studies"
            className="border-2 border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af] hover:text-white flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-lg font-semibold transition"
          >
            <BookOpen className="h-5 w-5" />
            Browse All Studies
          </Link>
        </div>

        {/* Helpful Message */}
        <div className="mt-16 text-sm text-zinc-500">
          <p>Looking for something specific?</p>
          <p className="mt-2">
            Try searching for a study or return to the{" "}
            <Link href="/" className="text-[#1e40af] hover:underline">
              homepage
            </Link>
            .
          </p>
        </div>

        {/* Decorative Element */}
        <div className="mt-20 text-[#d4af37]/30 text-9xl font-light select-none">
          ✝️
        </div>
      </div>
    </div>
  );
}
