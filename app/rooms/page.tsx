"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, MessagesSquare, NotebookTabs, RadioTower, Users2, Video, Wifi } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getRoomSyncStates, saveRoomSyncState, updateRoomSyncState } from "@/lib/persistence";

const ROOM_SYNC_KEY = "christian-study-guide:room-sync-states";

const rooms = [
  {
    title: "Romans 8 encouragement room",
    type: "Shared study room",
    summary:
      "A passage-centered room with leader prompts, notes, and prayer check-ins.",
  },
  {
    title: "Youth Q&A night",
    type: "Live discussion",
    summary:
      "A harder-questions format with apologetics prompts and follow-up cards.",
  },
  {
    title: "Moms prayer room",
    type: "Prayer circle",
    summary:
      "Shared prayer requests, answered updates, and a weekly devotional prompt.",
  },
];

const liveSyncFeatures = [
  "Real-time participant presence and stage sync",
  "Shared notes and prayer updates in the same room",
  "Leader-controlled prompts and discussion flow",
  "Follow-up summaries after the room closes",
];

interface RoomSyncState {
  id: string;
  roomName: string;
  roomType: string;
  syncStage: string;
  participantCount: number;
}

export default function RoomsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");
  const [syncStates, setSyncStates] = useState<RoomSyncState[]>([]);
  const [draft, setDraft] = useState({
    roomName: "Romans 8 encouragement room",
    roomType: "shared-study-room",
    syncStage: "welcome",
    participantCount: 8,
  });
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getRoomSyncStates();
          setSyncStates(
            (data as Array<{
              id: string;
              room_name: string;
              room_type: string;
              sync_stage: string;
              participant_count: number;
            }>).map((item) => ({
              id: item.id,
              roomName: item.room_name,
              roomType: item.room_type,
              syncStage: item.sync_stage,
              participantCount: item.participant_count,
            })),
          );
        } else {
          const raw = localStorage.getItem(ROOM_SYNC_KEY);
          if (raw) {
            setSyncStates(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveSync = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.roomName.trim()) return;

    if (user) {
      const saved = await saveRoomSyncState({
        room_name: draft.roomName,
        room_type: draft.roomType,
        sync_stage: draft.syncStage,
        participant_count: draft.participantCount,
      });

      setSyncStates((current) => [
        {
          id: saved.id,
          roomName: saved.room_name,
          roomType: saved.room_type,
          syncStage: saved.sync_stage,
          participantCount: saved.participant_count,
        },
        ...current,
      ]);
    } else {
      const nextStates = [
        {
          id: `${Date.now()}`,
          roomName: draft.roomName,
          roomType: draft.roomType,
          syncStage: draft.syncStage,
          participantCount: draft.participantCount,
        },
        ...syncStates,
      ];
      setSyncStates(nextStates);
      localStorage.setItem(ROOM_SYNC_KEY, JSON.stringify(nextStates));
    }

    setSavedMessage("Room sync state saved.");
    window.setTimeout(() => setSavedMessage(""), 2400);
  };

  const handleAdvanceStage = async (id: string) => {
    const nextStates = syncStates.map((state) =>
      state.id === id ? { ...state, syncStage: "discussion" } : state,
    );
    setSyncStates(nextStates);

    if (user) {
      const target = nextStates.find((state) => state.id === id);
      if (target) {
        await updateRoomSyncState({
          id,
          sync_stage: target.syncStage,
          participant_count: target.participantCount,
        });
      }
    } else {
      localStorage.setItem(ROOM_SYNC_KEY, JSON.stringify(nextStates));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading room sync...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Users2 className="h-4 w-4" />
              Shared study rooms
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Real rooms for collaborative study, not just solo screens.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Shared notes, leader prompts, prayer lists, and discussion flows
              in one room experience for churches and groups.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <RadioTower className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Save room sync state</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep a room’s current stage, participant count, and sync mode across devices.
          </p>
          <form onSubmit={handleSaveSync} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={draft.roomName}
              onChange={(event) =>
                setDraft((current) => ({ ...current, roomName: event.target.value }))
              }
              placeholder="Room name"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <select
              value={draft.roomType}
              onChange={(event) =>
                setDraft((current) => ({ ...current, roomType: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="shared-study-room">Shared study room</option>
              <option value="live-discussion">Live discussion</option>
              <option value="prayer-circle">Prayer circle</option>
            </select>
            <select
              value={draft.syncStage}
              onChange={(event) =>
                setDraft((current) => ({ ...current, syncStage: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="welcome">Welcome</option>
              <option value="scripture">Scripture</option>
              <option value="discussion">Discussion</option>
              <option value="prayer">Prayer</option>
            </select>
            <input
              type="number"
              min={1}
              value={draft.participantCount}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  participantCount: Number(event.target.value),
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <div className="md:col-span-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save sync state
              </button>
              {savedMessage ? (
                <p className="text-sm font-medium text-emerald-700">{savedMessage}</p>
              ) : null}
            </div>
          </form>
        </section>

        <section className="mb-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Live notes",
              detail: "Collaborative notes that update during the room, not after it is over.",
              icon: NotebookTabs,
            },
            {
              title: "Synced room state",
              detail: "Everyone moves together from reading to discussion to prayer.",
              icon: Wifi,
            },
            {
              title: "Leader controls",
              detail: "Guide prompts, prayers, and follow-up moments without the room feeling chaotic.",
              icon: RadioTower,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <Icon className="h-6 w-6 text-[#1e40af]" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mb-10 rounded-3xl border border-violet-200 bg-violet-50 p-8">
          <div className="flex items-center gap-3 text-violet-950">
            <Video className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Live collaboration layer</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {liveSyncFeatures.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-violet-200 bg-white p-5 text-sm font-medium text-violet-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {rooms.map((room) => (
            <article
              key={room.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                {room.type}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">
                {room.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{room.summary}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <MessagesSquare className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Room features</h2>
            </div>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-violet-950">
              <li>• Shared passage notes and leader prompts</li>
              <li>• Prayer list threads and answered updates</li>
              <li>• Discussion guides tied to the current room passage</li>
              <li>• Quick links into mentor, apologetics, and family modes</li>
            </ul>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <Video className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Why this matters</h2>
              </div>
              <p className="mt-6 leading-7 text-emerald-950">
                Rooms turn the app from a personal study product into something
                churches and group leaders can actually organize people around.
              </p>
              <Link
                href="/workspace"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-950 transition hover:text-emerald-800"
              >
                Open workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
              <div className="flex items-center gap-3 text-blue-950">
                <Users2 className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Real-time collaboration layer</h2>
              </div>
              <p className="mt-6 leading-7 text-blue-900">
                The next step is presence-aware rooms with shared note streams,
                live leader prompts, and participant updates that move together in real time.
              </p>
              <Link
                href="/collaboration"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-950 transition hover:text-blue-800"
              >
                Open collaboration system
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <RadioTower className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Live room sync</h2>
          </div>
          <p className="mt-4 leading-7 text-slate-600">
            The next room layer is real-time presence, collaborative notes, shared prayer
            updates, and leader-controlled discussion stages so everyone moves through the
            same study moment together.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Live presence and participant status",
              "Shared notes and room prayer feed",
              "Leader-controlled discussion stages",
              "Synchronized prompts and follow-up cards",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-800"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Saved sync states</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {syncStates.length > 0 ? (
              syncStates.map((state) => (
                <article
                  key={state.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{state.roomName}</p>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                      {state.syncStage}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {state.roomType.replace(/-/g, " ")} • {state.participantCount} participants
                  </p>
                  {state.syncStage !== "discussion" ? (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStage(state.id)}
                      className="mt-4 rounded-xl border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
                    >
                      Advance to discussion
                    </button>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Save a room sync state above to keep live-room progress available later.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
