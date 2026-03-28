"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CheckCircle, Search } from "lucide-react";

export default function HomeHero({ isSignedIn }: { isSignedIn: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    const slug = query.trim().toLowerCase().replace(/\s+/g, "-");
    router.push(`/passage/${slug}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-primary py-24 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-gradient mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Deepen Your
            <br />
            Faith Journey
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-white/90 md:text-2xl">
            Study the Bible, track your progress, and grow closer to Christ
            with a platform built for discipleship.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mb-12 max-w-2xl animate-scale-in">
          <div className="input-group">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search: John 3:16, Romans 8, Psalm 23..."
              className="w-full rounded-2xl bg-white px-6 py-5 text-lg text-text-primary shadow-xl placeholder-text-muted focus:shadow-glow"
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
          <p className="mt-3 text-center text-sm text-white/70">
            Try: John 3, Romans 8, Psalm 23, Matthew 6:9-13, 1 John 4:7-8
          </p>
        </form>

        {!isSignedIn && (
          <div className="animate-slide-up justify-center gap-4 sm:flex">
            <Link
              href="/auth/signup"
              className="btn btn-secondary px-8 py-4 text-lg shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="h-5 w-5" />
              Start Free
            </Link>
            <Link
              href="/auth/signin"
              className="btn btn-ghost border-white/30 px-8 py-4 text-lg text-white hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
