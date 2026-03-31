'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  BookOpen,
  BrainCircuit,
  Link2,
  Loader2,
  NotebookPen,
  PencilLine,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react';

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

interface NoteFormState {
  reference: string;
  content: string;
  noteType: 'note' | 'highlight' | 'question';
  color: string;
  tags: string;
}

const defaultFormState: NoteFormState = {
  reference: '',
  content: '',
  noteType: 'note',
  color: '#facc15',
  tags: '',
};

const noteTypeOptions = [
  { value: 'note', label: 'Note' },
  { value: 'highlight', label: 'Highlight' },
  { value: 'question', label: 'Question' },
] as const;

export default function NotesPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'note' | 'highlight' | 'question'>(
    'all'
  );
  const [form, setForm] = useState<NoteFormState>(defaultFormState);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

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

        const data = (await response.json()) as UserNote[];
        setNotes(data);
      } catch (error) {
        console.error('Error loading notes:', error);
        setFeedback('We could not load your notes just now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [router, supabase]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return notes.filter((note) => {
      const noteTags = getNoteTags(note);
      const matchesType = filterType === 'all' || note.note_type === filterType;
      const matchesQuery =
        !normalizedQuery ||
        note.reference.toLowerCase().includes(normalizedQuery) ||
        note.content.toLowerCase().includes(normalizedQuery) ||
        noteTags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesType && matchesQuery;
    });
  }, [filterType, notes, query]);

  const noteStats = useMemo(() => {
    const highlightCount = notes.filter((note) => note.note_type === 'highlight').length;
    const questionCount = notes.filter((note) => note.note_type === 'question').length;
    const taggedCount = notes.filter((note) => getNoteTags(note).length > 0).length;

    return [
      { label: 'Total notes', value: String(notes.length) },
      { label: 'Highlights', value: String(highlightCount) },
      { label: 'Questions', value: String(questionCount) },
      { label: 'Tagged notes', value: String(taggedCount) },
    ];
  }, [notes]);

  const clearForm = () => {
    setForm(defaultFormState);
    setEditingNoteId(null);
  };

  const handleEdit = (note: UserNote) => {
    setEditingNoteId(note.id);
    setForm({
      reference: note.reference,
      content: note.content,
      noteType: note.note_type,
      color: note.color || '#facc15',
      tags: getNoteTags(note).join(', '),
    });
    setFeedback(`Editing ${note.reference}.`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback('');

    const payload = {
      reference: form.reference.trim(),
      content: form.content.trim(),
      note_type: form.noteType,
      color: form.color,
      tags: parseTags(form.tags),
    };

    if (!payload.reference || !payload.content) {
      setFeedback('Reference and note content are both required.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/notes', {
        method: editingNoteId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          editingNoteId
            ? {
                id: editingNoteId,
                ...payload,
              }
            : payload
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to save note');
      }

      const savedNote = normalizeNote(result);
      setNotes((currentNotes) =>
        editingNoteId
          ? currentNotes.map((note) => (note.id === editingNoteId ? savedNote : note))
          : [savedNote, ...currentNotes]
      );
      clearForm();
      setFeedback(editingNoteId ? 'Note updated.' : 'New note saved.');
    } catch (error) {
      console.error('Error saving note:', error);
      setFeedback(error instanceof Error ? error.message : 'Unable to save note.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    const confirmed = window.confirm('Delete this note permanently?');
    if (!confirmed) {
      return;
    }

    setDeletingNoteId(noteId);
    setFeedback('');

    try {
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to delete note');
      }

      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));

      if (editingNoteId === noteId) {
        clearForm();
      }

      setFeedback('Note deleted.');
    } catch (error) {
      console.error('Error deleting note:', error);
      setFeedback(error instanceof Error ? error.message : 'Unable to delete note.');
    } finally {
      setDeletingNoteId(null);
    }
  };

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
                Capture insights, questions, and highlights without leaving your study flow.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {noteStats.map((stat) => (
              <article key={stat.label} className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                <p className="text-sm text-blue-100">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 -mt-8">
        <section className="rounded-3xl border border-[#d4af37]/10 bg-white p-8 shadow-sm">
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="flex items-center gap-3 text-slate-900">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#1e40af]">
                  {editingNoteId ? <PencilLine className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">
                    {editingNoteId ? 'Edit note' : 'Create a note'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Save a passage thought, a question to revisit, or a highlight to review later.
                  </p>
                </div>
              </div>

              <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <label className="grid gap-2 text-sm font-medium text-slate-800">
                    Passage reference
                    <input
                      value={form.reference}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, reference: event.target.value }))
                      }
                      placeholder="John 3:16"
                      className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1e40af] focus:bg-white"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-slate-800">
                    Note type
                    <select
                      value={form.noteType}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          noteType: event.target.value as NoteFormState['noteType'],
                        }))
                      }
                      className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1e40af] focus:bg-white"
                    >
                      {noteTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-medium text-slate-800">
                  Note content
                  <textarea
                    value={form.content}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, content: event.target.value }))
                    }
                    placeholder="Write what stood out, what you want to remember, or what you want to ask next."
                    rows={6}
                    className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-[#1e40af] focus:bg-white"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  <label className="grid gap-2 text-sm font-medium text-slate-800">
                    Tags
                    <input
                      value={form.tags}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, tags: event.target.value }))
                      }
                      placeholder="faith, hope, sermon prep"
                      className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1e40af] focus:bg-white"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-slate-800">
                    Accent color
                    <div className="flex h-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <input
                        type="color"
                        value={form.color}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, color: event.target.value }))
                        }
                        className="h-10 w-12 cursor-pointer rounded-lg border border-gray-200 bg-transparent"
                      />
                      <span className="text-sm text-gray-600">{form.color}</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : editingNoteId ? (
                      <>
                        <PencilLine className="h-4 w-4" />
                        Update note
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Save note
                      </>
                    )}
                  </button>

                  {editingNoteId && (
                    <button
                      type="button"
                      onClick={clearForm}
                      className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-gray-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel edit
                    </button>
                  )}

                  {feedback && <p className="text-sm text-slate-600">{feedback}</p>}
                </div>
              </form>
            </div>

            <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-7">
              <div className="flex items-center gap-3 text-blue-950">
                <Tag className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Study structure</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  'Use highlights for verses you want to revisit quickly.',
                  'Use questions for ideas to bring into mentor chat or group study.',
                  'Use tags to cluster notes by doctrine, person, struggle, or sermon series.',
                  'Open a passage directly from any note to keep context close.',
                ].map((item) => (
                  <article
                    key={item}
                    className="rounded-2xl border border-blue-200 bg-white px-4 py-4 text-sm leading-6 text-blue-950"
                  >
                    {item}
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#d4af37]/10 bg-white p-8 shadow-sm">
          <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
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
              <h2 className="text-2xl font-semibold text-[#0f172a]">
                {notes.length === 0 ? 'No notes yet' : 'No notes match this search'}
              </h2>
              <p className="mt-2 text-gray-600">
                {notes.length === 0
                  ? 'Save notes from a passage page or start one above to build your study archive.'
                  : 'Try a different reference, tag, or note type filter.'}
              </p>
              {notes.length === 0 && (
                <Link
                  href="/"
                  className="mt-6 inline-flex rounded-2xl bg-[#1e40af] px-5 py-3 font-medium text-white transition hover:bg-[#1e3a8a]"
                >
                  Start Studying
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredNotes.map((note) => {
                const noteTags = getNoteTags(note);
                const passageHref = `/passage/${note.reference.toLowerCase().replace(/\s+/g, '-')}`;

                return (
                  <article key={note.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getTypeStyles(
                              note.note_type
                            )}`}
                          >
                            {note.note_type}
                          </span>
                          <span
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: note.color || '#facc15' }}
                            aria-label={`Accent color ${note.color || '#facc15'}`}
                          />
                          <Link href={passageHref} className="font-semibold text-[#1e40af] hover:text-[#1e3a8a]">
                            {note.reference}
                          </Link>
                        </div>
                        <p className="text-sm text-gray-500">
                          Saved {new Date(note.created_at).toLocaleString()}
                          {note.updated_at !== note.created_at &&
                            ` • Updated ${new Date(note.updated_at).toLocaleString()}`}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(note)}
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-50"
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(note.id)}
                          disabled={deletingNoteId === note.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {deletingNoteId === note.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </button>
                        <Link
                          href={passageHref}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-100"
                        >
                          <BookOpen className="h-4 w-4" />
                          Open Passage
                        </Link>
                      </div>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">{note.content}</p>

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
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Link2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Advanced note linking</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                'Link notes to passages, theology topics, and mentor threads',
                'Jump from a prayer request to the note that sparked it',
                'See which insights belong to a guided path or study session',
                'Build clusters of notes around a doctrine, person, or life issue',
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

function getNoteTags(note: UserNote) {
  return note.tags || note.note_tags?.map((tag) => tag.tag) || [];
}

function parseTags(rawTags: string) {
  return Array.from(
    new Set(
      rawTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

function normalizeNote(note: UserNote) {
  return {
    ...note,
    tags: getNoteTags(note),
  };
}
