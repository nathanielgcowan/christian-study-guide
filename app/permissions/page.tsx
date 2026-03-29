import AdminGate from "@/components/AdminGate";

import { Building2, KeyRound, ShieldCheck, UserCog } from "lucide-react";

const roles = [
  {
    title: "Owner",
    description: "Controls billing, team settings, church workspace visibility, and admin-level publishing.",
  },
  {
    title: "Editor",
    description: "Can create studies, save resources, draft publishing flows, and manage shared content.",
  },
  {
    title: "Leader",
    description: "Can run rooms, publish leader notes, assign plans, and moderate discussions.",
  },
  {
    title: "Viewer",
    description: "Can read shared studies, join rooms, and interact within the limits of the team workspace.",
  },
];

const securityBlocks = [
  "Role-based route protection across leader, church, and admin pages",
  "Entitlement checks for premium and church-only features",
  "Invite approval flow and seat management",
  "Audit history for publishing, moderation, and billing-sensitive actions",
];

export default function PermissionsPage() {
  return (
    <AdminGate>
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Permissions and access
            </div>
            <h1 className="text-5xl font-bold md:text-6xl">
              Professional products need clean roles, entitlements, and access rules.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              This is the layer that keeps church teams, premium features, leaders,
              and admins organized and secure as the app grows.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <article
              key={role.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <UserCog className="h-6 w-6 text-[#1e40af]" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{role.title}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">{role.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <KeyRound className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Security and gating</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {securityBlocks.map((item) => (
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
              <Building2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Church-team fit</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-emerald-900">
              The same permission system should cover church dashboards, leader publishing,
              team workspaces, study rooms, and premium seats without a separate access model for each.
            </p>
          </aside>
        </section>
      </main>
    </div>
    </AdminGate>
  );
}
