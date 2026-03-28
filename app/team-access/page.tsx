"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Building2,
  KeyRound,
  MailPlus,
  ShieldCheck,
  Users2,
  Workflow,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getTeamAccessSettings,
  getTeamInvites,
  saveTeamAccessSettings,
  saveTeamInvite,
} from "@/lib/persistence";

const TEAM_ACCESS_SETTINGS_KEY = "christian-study-guide:team-access-settings";
const TEAM_INVITES_KEY = "christian-study-guide:team-invites";

const roles = [
  "Owner: billing, policy, and church-wide controls",
  "Editor: study drafting, publishing, and content updates",
  "Moderator: comments, room conduct, and approval queues",
  "Member: shared studies, rooms, and collaboration access",
];

const inviteFlows = [
  {
    title: "Email invites",
    detail: "Add a leader, volunteer, or team member directly into the right workspace context.",
  },
  {
    title: "Room-specific access",
    detail: "Keep discussion rooms private while letting the wider church reuse published resources.",
  },
  {
    title: "Permission bundles",
    detail: "Apply presets like youth team, teaching team, or pastoral staff instead of configuring from scratch.",
  },
];

interface TeamInvite {
  id: string;
  teamName: string;
  inviteEmail: string;
  role: string;
  status: string;
}

export default function TeamAccessPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [inviteFeedback, setInviteFeedback] = useState("");
  const [settings, setSettings] = useState({
    teamName: "Ministry Team",
    defaultRole: "member",
    inviteMode: "email",
    approvalRequired: true,
    seatLimit: 5,
  });
  const [inviteDraft, setInviteDraft] = useState({
    inviteEmail: "",
    role: "member",
  });
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const [settingsData, invitesData] = await Promise.all([
            getTeamAccessSettings(),
            getTeamInvites(),
          ]);

          if (settingsData) {
            setSettings({
              teamName: settingsData.team_name || "Ministry Team",
              defaultRole: settingsData.default_role || "member",
              inviteMode: settingsData.invite_mode || "email",
              approvalRequired: settingsData.approval_required ?? true,
              seatLimit: settingsData.seat_limit || 5,
            });
          }

          setInvites(
            (invitesData as Array<{
              id: string;
              team_name: string;
              invite_email: string;
              role: string;
              status: string;
            }>).map((item) => ({
              id: item.id,
              teamName: item.team_name,
              inviteEmail: item.invite_email,
              role: item.role,
              status: item.status,
            })),
          );
        } else {
          const rawSettings = localStorage.getItem(TEAM_ACCESS_SETTINGS_KEY);
          const rawInvites = localStorage.getItem(TEAM_INVITES_KEY);
          if (rawSettings) setSettings(JSON.parse(rawSettings));
          if (rawInvites) setInvites(JSON.parse(rawInvites));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (user) {
        await saveTeamAccessSettings({
          team_name: settings.teamName,
          default_role: settings.defaultRole,
          invite_mode: settings.inviteMode,
          approval_required: settings.approvalRequired,
          seat_limit: settings.seatLimit,
        });
      } else {
        localStorage.setItem(TEAM_ACCESS_SETTINGS_KEY, JSON.stringify(settings));
      }
      setSaveFeedback("Team access settings saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inviteDraft.inviteEmail.trim()) return;

    try {
      if (user) {
        const saved = await saveTeamInvite({
          team_name: settings.teamName,
          invite_email: inviteDraft.inviteEmail,
          role: inviteDraft.role,
        });

        setInvites((current) => [
          {
            id: saved.id,
            teamName: saved.team_name,
            inviteEmail: saved.invite_email,
            role: saved.role,
            status: saved.status,
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            teamName: settings.teamName,
            inviteEmail: inviteDraft.inviteEmail,
            role: inviteDraft.role,
            status: "pending",
          },
          ...invites,
        ];
        setInvites(next);
        localStorage.setItem(TEAM_INVITES_KEY, JSON.stringify(next));
      }

      setInviteDraft({ inviteEmail: "", role: "member" });
      setInviteFeedback("Invite saved");
    } catch {
      setInviteFeedback("Save failed");
    } finally {
      setTimeout(() => setInviteFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading team access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#14532d] via-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Team permissions and invites
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Make collaboration safe enough for real ministry teams.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              Owners, editors, moderators, and members need distinct access so
              rooms, publishing, and church admin tools can scale responsibly.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <KeyRound className="h-6 w-6 text-[#14532d]" />
              <h2 className="text-2xl font-semibold">Role model</h2>
            </div>
            <div className="mt-6 space-y-4">
              {roles.map((role) => (
                <article
                  key={role}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-800"
                >
                  {role}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <MailPlus className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Invite flows</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {inviteFlows.map((flow) => (
                <article
                  key={flow.title}
                  className="rounded-2xl border border-blue-200 bg-white p-5"
                >
                  <h3 className="text-lg font-semibold text-blue-950">{flow.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-blue-900">{flow.detail}</p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <Building2 className="h-6 w-6 text-violet-950" />
            <h2 className="mt-4 text-2xl font-semibold text-violet-950">Church-wide access</h2>
            <p className="mt-4 leading-7 text-violet-900">
              Separate church admin controls from room-level and study-level permissions.
            </p>
          </article>
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <Users2 className="h-6 w-6 text-amber-950" />
            <h2 className="mt-4 text-2xl font-semibold text-amber-950">Team seat model</h2>
            <p className="mt-4 leading-7 text-amber-900">
              Tie access tiers to subscriptions without making the collaboration layer confusing.
            </p>
          </article>
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <Workflow className="h-6 w-6 text-emerald-950" />
            <h2 className="mt-4 text-2xl font-semibold text-emerald-950">Approval paths</h2>
            <p className="mt-4 leading-7 text-emerald-900">
              Route publishing, moderation, and shared-resource changes through clear review flows.
            </p>
          </article>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#0f172a]">Team settings</h2>
              {saveFeedback ? (
                <p className="text-sm font-medium text-emerald-700">{saveFeedback}</p>
              ) : null}
            </div>
            <form onSubmit={handleSaveSettings} className="mt-6 grid gap-4">
              <input
                value={settings.teamName}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, teamName: event.target.value }))
                }
                placeholder="Team name"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
              />
              <select
                value={settings.defaultRole}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    defaultRole: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
              >
                <option value="member">Member</option>
                <option value="editor">Editor</option>
                <option value="moderator">Moderator</option>
                <option value="owner">Owner</option>
              </select>
              <select
                value={settings.inviteMode}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    inviteMode: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
              >
                <option value="email">Email invites</option>
                <option value="link">Private links</option>
                <option value="approval">Approval queue</option>
              </select>
              <input
                type="number"
                min={1}
                value={settings.seatLimit}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    seatLimit: Number(event.target.value),
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
              />
              <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                <span>Approval required</span>
                <input
                  type="checkbox"
                  checked={settings.approvalRequired}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      approvalRequired: event.target.checked,
                    }))
                  }
                />
              </label>
              <button
                type="submit"
                className="rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Save team settings
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#0f172a]">Invite a teammate</h2>
              {inviteFeedback ? (
                <p className="text-sm font-medium text-emerald-700">{inviteFeedback}</p>
              ) : null}
            </div>
            <form onSubmit={handleInvite} className="mt-6 grid gap-4">
              <input
                value={inviteDraft.inviteEmail}
                onChange={(event) =>
                  setInviteDraft((current) => ({
                    ...current,
                    inviteEmail: event.target.value,
                  }))
                }
                placeholder="leader@example.com"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
              />
              <select
                value={inviteDraft.role}
                onChange={(event) =>
                  setInviteDraft((current) => ({ ...current, role: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
              >
                <option value="member">Member</option>
                <option value="editor">Editor</option>
                <option value="moderator">Moderator</option>
                <option value="owner">Owner</option>
              </select>
              <button
                type="submit"
                className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save invite
              </button>
            </form>

            <div className="mt-6 grid gap-3">
              {invites.length > 0 ? (
                invites.map((invite) => (
                  <article
                    key={invite.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="font-semibold text-slate-900">{invite.inviteEmail}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {invite.teamName} • {invite.role} • {invite.status}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Save an invite to start building a real team roster.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
