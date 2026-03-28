'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, BrainCircuit, Link2, Loader2, NotebookPen, Search, Tag } from 'lucide-react';

interface NoteTag {
  tag: string;
}

interface UserNote {
  id: string;
  reference: string;
  content: string;
  note_type: 'note' | 'highlight' | 'question';
  color: string;
  created_at: string;
  updated_at: string;
  note_tags?: NoteTag[];
  tags?: string[];
}

export default function NotesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'note' | 'highlight' | 'question'>(
    'all'
  );

  useEffect(() => {
    const loadNotes = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth/signin');
        return;
      }

      try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
          throw new Error('Failed to load notes');
        }

        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [router, supabase]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesType = filterType === 'all' || note.note_type === filterType;
      const noteTags = note.tags || note.note_tags?.map((tag) => tag.tag) || [];
      const matchesQuery =
        !normalizedQuery ||
        note.reference.toLowerCase().includes(normalizedQuery) ||
        note.content.toLowerCase().includes(normalizedQuery) ||
        noteTags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesType && matchesQuery;
    });
  }, [filterType, notes, query]);

  const getTypeStyles = (type: UserNote['note_type']) => {
    switch (type) {
      case 'highlight':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'question':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1e40af]" />
          <p className="text-gray-600">Loading your notes...</p>
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
              <NotebookPen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Your Notes</h1>
              <p className="mt-1 text-blue-100">
                See every saved insight, mentor response, and study note in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="rounded-3xl border border-[#d4af37]/10 bg-white p-8 shadow-sm">
          <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes, passages, or tags..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1e40af] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(['all', 'note', 'highlight', 'question'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filterType === type
                      ? 'bg-[#1e40af] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
              <NotebookPen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h2 className="text-2xl font-semibold text-[#0f172a]">No notes yet</h2>
              <p className="mt-2 text-gray-600">
                Save notes from a passage page or from the Christian AI Mentor to see
                them here.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex rounded-2xl bg-[#1e40af] px-5 py-3 font-medium text-white transition hover:bg-[#1e3a8a]"
              >
                Start Studying
              </Link>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredNotes.map((note) => {
                const noteTags = note.tags || note.note_tags?.map((tag) => tag.tag) || [];

                return (
                  <article
                    key={note.id}
                    className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getTypeStyles(
                              note.note_type
                            )}`}
                          >
                            {note.note_type}
                          </span>
                          <Link
                            href={`/passage/${note.reference.toLowerCase().replace(/\s+/g, '-')}`}
                            className="font-semibold text-[#1e40af] hover:text-[#1e3a8a]"
                          >
                            {note.reference}
                          </Link>
                        </div>
                        <p className="text-sm text-gray-500">
                          Saved {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href={`/passage/${note.reference.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-100"
                      >
                        <BookOpen className="h-4 w-4" />
                        Open Passage
                      </Link>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
                      {note.content}
                    </p>

                    {noteTags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {noteTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Link2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Advanced note linking</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Link notes to passages, theology topics, and mentor threads",
                "Jump from a prayer request to the note that sparked it",
                "See which insights belong to a guided path or study session",
                "Build clusters of notes around a doctrine, person, or life issue",
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

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <BrainCircuit className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">A real knowledge layer</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-emerald-900">
              Once notes connect to theology, reading plans, mentor threads, and prayers,
              the app starts behaving like a personal Bible study graph instead of a stack of separate tools.
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}
