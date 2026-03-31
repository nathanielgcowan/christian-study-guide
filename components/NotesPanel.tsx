"use client";

import { useCallback, useEffect, useState } from "react";
import {
  X,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Check,
} from "lucide-react";
import {
  getNotes as fetchNotes,
  saveNote,
  updateNote,
  deleteNote,
} from "../lib/persistence";

interface Note {
  id: string;
  reference?: string;
  content: string;
  note_type: "note" | "highlight" | "question";
  color: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface NotesPanelProps {
  reference: string;
  onClose?: () => void;
}

export default function NotesPanel({ reference, onClose }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"note" | "highlight" | "question">(
    "note",
  );
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "note" | "highlight" | "question"
  >("all");

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const allNotes = await fetchNotes();
      const filteredNotes = (allNotes as Note[]).filter(
        (note) => note.reference === reference,
      );
      setNotes(filteredNotes);
    } catch {
      console.error("Error loading notes");
    } finally {
      setLoading(false);
    }
  }, [reference]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setSaving(true);
      await saveNote(reference, newNote, noteType);
      setNewNote("");
      await loadNotes();
    } catch {
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNote = async (id: string) => {
    if (!editValue.trim()) return;

    try {
      setSaving(true);
      await updateNote(id, editValue);
      setEditingId(null);
      setEditValue("");
      await loadNotes();
    } catch {
      alert("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Delete this note?")) return;

    try {
      await deleteNote(id);
      await loadNotes();
    } catch {
      alert("Failed to delete note");
    }
  };

  const filteredNotes = notes.filter(
    (note) => filterType === "all" || note.note_type === filterType,
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "highlight":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "question":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full flex flex-col max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          Notes & Highlights
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 p-4 border-b overflow-x-auto">
        {(["all", "note", "highlight", "question"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition whitespace-nowrap ${
              filterType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No {filterType !== "all" ? filterType + "s" : "notes"} yet</p>
            <p className="text-sm mt-1">Add your first note below</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border-l-4 ${getTypeColor(
                note.note_type,
              )}`}
              style={{
                borderLeftColor: note.color || "#ffff00",
              }}
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateNote(note.id)}
                      disabled={saving}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition flex items-center justify-center gap-1"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${getTypeColor(note.note_type)}`}
                    >
                      {note.note_type.toUpperCase()}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingId(note.id);
                          setEditValue(note.content);
                        }}
                        className="text-gray-500 hover:text-gray-700 p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-gray-500 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Note Form */}
      <div className="p-4 border-t bg-gray-50">
        <form onSubmit={handleAddNote} className="space-y-3">
          <div className="flex gap-2">
            <select
              value={noteType}
              onChange={(e) =>
                setNoteType(e.target.value as "note" | "highlight" | "question")
              }
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="note">📝 Note</option>
              <option value="highlight">🔆 Highlight</option>
              <option value="question">❓ Question</option>
            </select>
          </div>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note, highlight, or question..."
            className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newNote.trim() || saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Note
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
