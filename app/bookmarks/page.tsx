'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bookmark, BookOpen, Loader2, Search } from 'lucide-react';

interface UserBookmark {
  id: string;
  reference: string;
  category: string | null;
  created_at: string;
}

export default function BookmarksPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const loadBookmarks = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth/signin');
        return;
      }

      try {
        const response = await fetch('/api/bookmarks');
        if (!response.ok) {
          throw new Error('Failed to load bookmarks');
        }

        const data = await response.json();
        setBookmarks(data);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [router, supabase]);

  const filteredBookmarks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return bookmarks.filter((bookmark) => {
      if (!normalizedQuery) return true;

      return (
        bookmark.reference.toLowerCase().includes(normalizedQuery) ||
        bookmark.category?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [bookmarks, query]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1e40af]" />
          <p className="text-gray-600">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-gradient-to-br from-[#1e40af] to-[#0f172a] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Bookmark className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Your Bookmarks</h1>
              <p className="mt-1 text-blue-100">
                Revisit the verses and passages you have saved along the way.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="rounded-3xl border border-[#d4af37]/10 bg-white p-8 shadow-sm">
          <div className="relative mb-8">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookmarked passages..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1e40af] focus:bg-white"
            />
          </div>

          {filteredBookmarks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
              <Bookmark className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h2 className="text-2xl font-semibold text-[#0f172a]">No bookmarks yet</h2>
              <p className="mt-2 text-gray-600">
                Save passages from the reader and they will appear here.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex rounded-2xl bg-[#1e40af] px-5 py-3 font-medium text-white transition hover:bg-[#1e3a8a]"
              >
                Start Studying
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredBookmarks.map((bookmark) => (
                <article
                  key={bookmark.id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/passage/${bookmark.reference.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xl font-semibold text-[#1e40af] hover:text-[#1e3a8a]"
                      >
                        {bookmark.reference}
                      </Link>
                      <p className="mt-2 text-sm text-gray-500">
                        Saved {new Date(bookmark.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Bookmark className="h-5 w-5 text-yellow-500" fill="currentColor" />
                  </div>

                  {bookmark.category && (
                    <p className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-900">
                      {bookmark.category}
                    </p>
                  )}

                  <Link
                    href={`/passage/${bookmark.reference.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-100"
                  >
                    <BookOpen className="h-4 w-4" />
                    Open Passage
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
