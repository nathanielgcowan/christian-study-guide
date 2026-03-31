"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Plus,
  FileText,
  FolderKanban,
  LayoutPanelTop,
  MicVocal,
  ShieldCheck,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getWorkspaceCollaborators,
  getWorkspaceResources,
  saveWorkspaceCollaborator,
  saveWorkspaceResource,
} from "../../lib/persistence";

const WORKSPACE_STORAGE_KEY = "christian-study-guide:workspace-resources";
const ACTIVITY_STORAGE_KEY = "christian-study-guide:activity-timeline";
const COLLAB_STORAGE_KEY = "christian-study-guide:workspace-collaborators";

interface WorkspaceBoard {
  id: string;
  title: string;
  summary: string;
  resourceType: string;
}

interface WorkspaceCollaborator {
  id: string;
  workspaceResourceId: string;
  collaboratorName: string;
  collaboratorRole: string;
}

const initialWorkspaceBoards: WorkspaceBoard[] = [
  {
    id: "board-1",
    title: "Sunday teaching board",
    summary:
      "Collect sermon starters, prayer prompts, and family-devotion follow-up for one weekly teaching cycle.",
    resourceType: "teaching-board",
  },
  {
    id: "board-2",
    title: "Youth series planning",
    summary:
      "Keep discussion questions, illustrations, and passage links together for a student ministry series.",
    resourceType: "series-plan",
  },
  {
    id: "board-3",
    title: "Small-group leader library",
    summary:
      "Reuse saved study sessions and turn them into a shared archive for multiple leaders.",
    resourceType: "resource-library",
  },
];

export default function WorkspacePage() {
  const [boards, setBoards] = useState<WorkspaceBoard[]>(
    initialWorkspaceBoards,
  );
  const [draft, setDraft] = useState({
    title: "",
    summary: "",
    resourceType: "study-board",
  });
  const [collaboratorDraft, setCollaboratorDraft] = useState({
    workspaceResourceId: "",
    collaboratorName: "",
    collaboratorRole: "member",
  });
  const [collaborators, setCollaborators] = useState<WorkspaceCollaborator[]>(
    [],
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const loadResources = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getWorkspaceResources();
          setBoards(
            (
              data as Array<{
                id: string;
                title: string;
                summary: string;
                resource_type: string;
              }>
            ).map((item) => ({
              id: item.id,
              title: item.title,
              summary: item.summary,
              resourceType: item.resource_type,
            })),
          );
          const primaryResourceId =
            (data as Array<{ id: string }>)[0]?.id ?? "";
          setCollaboratorDraft((current) => ({
            ...current,
            workspaceResourceId: primaryResourceId,
          }));
          if (primaryResourceId) {
            const collaboratorData =
              await getWorkspaceCollaborators(primaryResourceId);
            setCollaborators(
              (
                collaboratorData as Array<{
                  id: string;
                  workspace_resource_id: string;
                  collaborator_name: string;
                  collaborator_role: string;
                }>
              ).map((item) => ({
                id: item.id,
                workspaceResourceId: item.workspace_resource_id,
                collaboratorName: item.collaborator_name,
                collaboratorRole: item.collaborator_role,
              })),
            );
          }
        } else {
          const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
          if (raw) {
            const parsedBoards = JSON.parse(raw) as WorkspaceBoard[];
            setBoards(parsedBoards);
            setCollaboratorDraft((current) => ({
              ...current,
              workspaceResourceId: parsedBoards[0]?.id || "",
            }));
          }
          const rawCollaborators = localStorage.getItem(COLLAB_STORAGE_KEY);
          if (rawCollaborators) {
            setCollaborators(JSON.parse(rawCollaborators));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [supabase]);

  const handleAddResource = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.summary.trim()) return;

    const persist = async () => {
      if (user) {
        const saved = await saveWorkspaceResource(
          draft.title,
          draft.resourceType,
          draft.summary,
        );
        setBoards((current) => [
          {
            id: saved.id,
            title: saved.title,
            summary: saved.summary,
            resourceType: saved.resource_type,
          },
          ...current,
        ]);
      } else {
        const nextBoards = [
          {
            id: `${Date.now()}`,
            title: draft.title,
            summary: draft.summary,
            resourceType: draft.resourceType,
          },
          ...boards,
        ];
        setBoards(nextBoards);
        localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(nextBoards));
        const existingActivity = JSON.parse(
          localStorage.getItem(ACTIVITY_STORAGE_KEY) || "[]",
        ) as Array<Record<string, unknown>>;
        localStorage.setItem(
          ACTIVITY_STORAGE_KEY,
          JSON.stringify(
            [
              {
                id: `workspace-${Date.now()}`,
                event_type: "workspace_resource_created",
                reference: null,
                metadata: {
                  title: draft.title,
                  resource_type: draft.resourceType,
                },
                created_at: new Date().toISOString(),
              },
              ...existingActivity,
            ].slice(0, 30),
          ),
        );
      }

      setDraft({ title: "", summary: "", resourceType: "study-board" });
    };

    persist();
  };

  const handleAddCollaborator = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !collaboratorDraft.workspaceResourceId ||
      !collaboratorDraft.collaboratorName.trim()
    ) {
      return;
    }

    const persist = async () => {
      if (user) {
        const saved = await saveWorkspaceCollaborator(
          collaboratorDraft.workspaceResourceId,
          collaboratorDraft.collaboratorName,
          collaboratorDraft.collaboratorRole,
        );
        setCollaborators((current) => [
          {
            id: saved.id,
            workspaceResourceId: saved.workspace_resource_id,
            collaboratorName: saved.collaborator_name,
            collaboratorRole: saved.collaborator_role,
          },
          ...current,
        ]);
      } else {
        const nextCollaborators = [
          {
            id: `${Date.now()}`,
            workspaceResourceId: collaboratorDraft.workspaceResourceId,
            collaboratorName: collaboratorDraft.collaboratorName,
            collaboratorRole: collaboratorDraft.collaboratorRole,
          },
          ...collaborators,
        ];
        setCollaborators(nextCollaborators);
        localStorage.setItem(
          COLLAB_STORAGE_KEY,
          JSON.stringify(nextCollaborators),
        );
      }

      setCollaboratorDraft((current) => ({
        ...current,
        collaboratorName: "",
        collaboratorRole: "member",
      }));
    };

    persist();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading your workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Church team workspace
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              A planning space for ministries, not just individuals.
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-50">
              This is the shared-work layer: reusable study boards, team notes,
              and planning flows for churches, youth ministries, and volunteer
              leaders.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">
            Save a workspace resource
          </h2>
          <form
            onSubmit={handleAddResource}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Resource title"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <select
              value={draft.resourceType}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  resourceType: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="study-board">Study board</option>
              <option value="teaching-board">Teaching board</option>
              <option value="resource-library">Resource library</option>
            </select>
            <button
              type="submit"
              className="rounded-2xl bg-[#1e40af] px-5 py-3 font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Save resource
            </button>
            <textarea
              value={draft.summary}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  summary: event.target.value,
                }))
              }
              placeholder="What is this workspace resource for?"
              rows={3}
              className="md:col-span-3 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
          </form>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {boards.map((board) => (
            <article
              key={board.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                <FolderKanban className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0f172a]">
                {board.title}
              </h2>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {board.resourceType.replace(/-/g, " ")}
              </p>
              <p className="mt-4 leading-7 text-slate-600">{board.summary}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <LayoutPanelTop className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">
                What a workspace can hold
              </h2>
            </div>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-blue-950">
              <li>• Shared lesson drafts and sermon starter outlines</li>
              <li>• Passage pages saved for a whole ministry team</li>
              <li>• Prayer requests connected to class or group sessions</li>
              <li>• Follow-up assignments for leaders and volunteers</li>
            </ul>
          </div>

          <aside className="rounded-3xl border border-[#d4af37]/20 bg-[#fffaf0] p-8">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <FileText className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Current bridge</h2>
            </div>
            <p className="mt-4 leading-7 text-slate-700">
              Today, leaders can already use saved study sessions, passage
              sharing, sermon tools, and community pages together. This
              workspace page makes that premium direction visible.
            </p>
            <Link
              href="/leaders"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
            >
              Open leader tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-12 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <ShieldCheck className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Church dashboard layer</h2>
          </div>
          <p className="mt-4 leading-7 text-amber-950">
            This is where ministry admins can monitor active rooms, shared
            resources, team planning velocity, and teaching pipelines across a
            whole church team.
          </p>
        </section>

        <section className="mt-12 rounded-3xl border border-violet-200 bg-violet-50 p-8">
          <div className="flex items-center gap-3 text-violet-950">
            <MicVocal className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">
              Sermon and lesson workspace
            </h2>
          </div>
          <p className="mt-4 leading-7 text-violet-950">
            This is the premium leader studio for outline drafts, illustrations,
            handouts, exports, team comments, and teaching prep workflows in one
            place.
          </p>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-[#0f172a]">
            <Users className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Workspace collaborators</h2>
          </div>

          <form
            onSubmit={handleAddCollaborator}
            className="mt-6 grid gap-4 md:grid-cols-4"
          >
            <select
              value={collaboratorDraft.workspaceResourceId}
              onChange={(event) =>
                setCollaboratorDraft((current) => ({
                  ...current,
                  workspaceResourceId: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="">Choose resource</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>
            <input
              value={collaboratorDraft.collaboratorName}
              onChange={(event) =>
                setCollaboratorDraft((current) => ({
                  ...current,
                  collaboratorName: event.target.value,
                }))
              }
              placeholder="Collaborator name"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            />
            <select
              value={collaboratorDraft.collaboratorRole}
              onChange={(event) =>
                setCollaboratorDraft((current) => ({
                  ...current,
                  collaboratorRole: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="member">Member</option>
              <option value="editor">Editor</option>
              <option value="leader">Leader</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              <Plus className="h-4 w-4" />
              Add collaborator
            </button>
          </form>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {collaborators.map((collaborator) => {
              const resource = boards.find(
                (board) => board.id === collaborator.workspaceResourceId,
              );
              return (
                <article
                  key={collaborator.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-semibold text-slate-950">
                    {collaborator.collaboratorName}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {collaborator.collaboratorRole}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Working on{" "}
                    {resource?.title || "selected workspace resource"}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
