import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckSquare,
  Clock3,
  MessageSquare,
  Mic2,
  NotebookTabs,
  Radio,
  Users2,
  Waves,
  Wifi,
} from "lucide-react";
import { collaborationSystems, familyChurchSystems } from "@/lib/product-expansion";

const groupFeatures = [
  "Shared study rooms",
  "Group notes",
  "Leader questions",
  "Discussion threads",
  "Weekly study plans",
];

const groupRhythms = [
  {
    title: "Opening rhythm",
    detail:
      "Start with one passage, one quick context note, and one question that gets everyone into the text together.",
  },
  {
    title: "Discussion rhythm",
    detail:
      "Move from observation to interpretation to application so the group learns how to study instead of only hearing answers.",
  },
  {
    title: "Prayer rhythm",
    detail:
      "Capture requests during the discussion, link them to the passage theme, and close with guided prayer prompts.",
  },
  {
    title: "Follow-up rhythm",
    detail:
      "After the meeting, share the notes, one action step, and a reminder for the next session so momentum is not lost.",
  },
];

const leaderWorkflow = [
  "Choose the passage and group objective for the week",
  "Prepare 3-5 discussion questions and one prayer focus",
  "Open the room with a reading stage and shared notes",
  "Move the group into reflection, prayer, and response",
  "Send a follow-up summary with next steps after the session",
];

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#14532d] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Users2 className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Group Bible Study Mode</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            Shared rooms, notes, and leader tools for churches, small groups, and classes.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 md:grid-cols-5">
          {groupFeatures.map((feature, index) => (
            <article
              key={feature}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {index === 0 && <Waves className="h-5 w-5 text-[#1e40af]" />}
              {index === 1 && <NotebookTabs className="h-5 w-5 text-violet-700" />}
              {index >= 2 && <MessageSquare className="h-5 w-5 text-emerald-700" />}
              <p className="mt-4 text-sm font-semibold text-slate-900">{feature}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <Radio className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Real collaboration direction</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Live room presence and active participant status",
                "Shared notes that update during discussion",
                "Leader-controlled stage changes for the group flow",
                "Prayer list updates tied to the room topic",
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
              <BellRing className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Leader and member loops</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-emerald-900">
              The best group layer connects study reminders, prep questions, sermon companion notes,
              and follow-up prayer prompts so church use feels coordinated instead of fragmented.
            </p>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Real-time group rooms</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The strongest version of group study is live: synced stages, prayer updates, notes, and discussion prompts.
              </p>
            </div>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Open rooms
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <Radio className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Collaboration systems to add next</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {collaborationSystems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-blue-200 bg-white p-5"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-blue-950">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Live notes",
              detail: "Shared note-taking that updates during discussion instead of after the meeting.",
              icon: NotebookTabs,
            },
            {
              title: "Synced stages",
              detail: "Let leaders move the group from reading to discussion to prayer together.",
              icon: Wifi,
            },
            {
              title: "Leader prompts",
              detail: "Serve discussion cues, prayer moments, and follow-up questions at the right time.",
              icon: Mic2,
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

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <Clock3 className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-semibold">Healthy group rhythms</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {groupRhythms.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-[#1e40af]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <CheckSquare className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Leader workflow that works</h2>
            </div>
            <div className="mt-6 space-y-3">
              {leaderWorkflow.map((item, index) => (
                <article
                  key={item}
                  className="rounded-2xl border border-amber-200 bg-white p-4 text-sm leading-6 text-amber-950"
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
                    {index + 1}
                  </span>
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Users2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Family and church mode</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {familyChurchSystems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-emerald-200 bg-white p-5"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-emerald-950">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-950">
              <NotebookTabs className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Recap and export direction</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-amber-900">
              After a group session, the app can package the room notes into a leader recap,
              prayer follow-up, attendance summary, and printable guide for the next meeting.
            </p>
            <Link
              href="/church-admin"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
            >
              Open church admin
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
