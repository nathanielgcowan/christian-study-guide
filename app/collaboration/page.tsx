"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Building2,
  MessageSquareMore,
  ShieldCheck,
  UserRoundPlus,
  Users2,
  Waves,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getCollaborationSettings,
  saveCollaborationSettings,
} from "../../lib/persistence";

const COLLABORATION_SETTINGS_KEY =
  "christian-study-guide:collaboration-settings";

const collaborationLayers = [
  {
    title: "Live room presence",
    description:
      "See who is inside a room, what passage is open, and which discussion block the group is working through right now.",
  },
  {
    title: "Shared note streams",
    description:
      "Leader notes, participant reflections, and prayer requests stay attached to the same study space instead of scattering into separate tools.",
  },
  {
    title: "Collaborative passage prep",
    description:
      "Let teachers, pastors, and volunteers prepare lesson outlines together before a group ever meets.",
  },
];

const infrastructureBlocks = [
  {
    label: "Roles & permissions",
    detail:
      "Owners, leaders, moderators, and participants with clear publishing and moderation boundaries.",
  },
  {
    label: "Invites & onboarding",
    detail:
      "Private room links, church team invites, and guided first-time setup for new members.",
  },
  {
    label: "Shared libraries",
    detail:
      "Reusable prompts, resource boards, family-devotion packs, and lesson kits across teams.",
  },
  {
    label: "Moderation layer",
    detail:
      "Prayer-wall review, room activity controls, and healthier ministry collaboration at scale.",
  },
];

export default function CollaborationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");
  const [settings, setSettings] = useState({
    preferredRoomType: "shared-study-room",
    moderationMode: "guided",
    livePresenceEnabled: true,
    sharedLibraryEnabled: true,
    churchTeamMode: false,
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
          const data = await getCollaborationSettings();
          if (data) {
            setSettings({
              preferredRoomType:
                data.preferred_room_type || "shared-study-room",
              moderationMode: data.moderation_mode || "guided",
              livePresenceEnabled: data.live_presence_enabled ?? true,
              sharedLibraryEnabled: data.shared_library_enabled ?? true,
              churchTeamMode: data.church_team_mode ?? false,
            });
          }
        } else {
          const raw = localStorage.getItem(COLLABORATION_SETTINGS_KEY);
          if (raw) {
            setSettings(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (user) {
      await saveCollaborationSettings({
        preferred_room_type: settings.preferredRoomType,
        moderation_mode: settings.moderationMode,
        live_presence_enabled: settings.livePresenceEnabled,
        shared_library_enabled: settings.sharedLibraryEnabled,
        church_team_mode: settings.churchTeamMode,
      });
    } else {
      localStorage.setItem(
        COLLABORATION_SETTINGS_KEY,
        JSON.stringify(settings),
      );
    }

    setSavedMessage("Collaboration settings saved.");
    window.setTimeout(() => setSavedMessage(""), 2400);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading collaboration settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Waves className="h-4 w-4" />
              Real-time collaboration
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Build the church-team layer, not just solo study pages.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              This is the collaboration system for live rooms, shared prep,
              moderation, invitations, and the workflows ministry teams actually
              need.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Waves className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">
              Save collaboration defaults
            </h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep your preferred room style, moderation posture, and team-mode
            setup consistent across devices.
          </p>
          <form
            onSubmit={handleSave}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <select
              value={settings.preferredRoomType}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  preferredRoomType: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="shared-study-room">Shared study room</option>
              <option value="live-discussion-room">Live discussion room</option>
              <option value="prayer-circle">Prayer circle</option>
            </select>
            <select
              value={settings.moderationMode}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  moderationMode: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="guided">Guided</option>
              <option value="leader-led">Leader-led</option>
              <option value="open">Open</option>
            </select>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
              <span>Enable live presence</span>
              <input
                type="checkbox"
                checked={settings.livePresenceEnabled}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    livePresenceEnabled: event.target.checked,
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
              <span>Use shared libraries</span>
              <input
                type="checkbox"
                checked={settings.sharedLibraryEnabled}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    sharedLibraryEnabled: event.target.checked,
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Church team mode</span>
              <input
                type="checkbox"
                checked={settings.churchTeamMode}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    churchTeamMode: event.target.checked,
                  }))
                }
              />
            </label>
            <div className="md:col-span-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save collaboration settings
              </button>
              {savedMessage ? (
                <p className="text-sm font-medium text-emerald-700">
                  {savedMessage}
                </p>
              ) : null}
            </div>
          </form>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {collaborationLayers.map((layer) => (
            <article
              key={layer.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Users2 className="h-6 w-6 text-[#1e40af]" />
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">
                {layer.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {layer.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <Building2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                Community infrastructure
              </h2>
            </div>
            <div className="mt-6 grid gap-4">
              {infrastructureBlocks.map((block) => (
                <article
                  key={block.label}
                  className="rounded-2xl border border-violet-200 bg-white p-5"
                >
                  <p className="font-semibold text-violet-950">{block.label}</p>
                  <p className="mt-2 text-sm leading-6 text-violet-900">
                    {block.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <MessageSquareMore className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">What this unlocks</h2>
              </div>
              <p className="mt-6 leading-7 text-emerald-950">
                Once rooms become collaborative systems, the app can support
                church rhythms like leader prep, shared prayer follow-up, and
                distributed teaching teams instead of just individual devotion
                time.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <UserRoundPlus className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">
                  Start from existing layers
                </h2>
              </div>
              <div className="mt-6 space-y-3 text-sm leading-6 text-amber-950">
                <p>• Use `Study Rooms` for shared passage flow.</p>
                <p>
                  • Use `Workspace` for team resources and church operations.
                </p>
                <p>
                  • Use `Community` for the wider public prayer and group
                  surface.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/rooms"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
                >
                  Open Study Rooms
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
                >
                  Open Workspace
                  <ShieldCheck className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <ShieldCheck className="h-6 w-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">
              Professional collaboration requirements
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Room roles, moderation powers, and publishing boundaries",
              "Invite controls, approval flows, and seat awareness",
              "Shared libraries with edit vs view access",
              "Audit-friendly activity for leader and admin actions",
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
      </main>
    </div>
  );
}
