"use client";

import { BellRing, CheckCheck, Clock3, MessageSquareMore, Repeat2 } from "lucide-react";

const notifications = [
  {
    title: "Reading plan reminder",
    detail: "You have not opened today’s reading in the Life of Jesus plan yet.",
    tone: "amber",
  },
  {
    title: "Mentor follow-up",
    detail: "How did your anxiety action step from James 1:2-4 go this week?",
    tone: "blue",
  },
  {
    title: "Prayer update prompt",
    detail: "A family guidance prayer request has been active for 7 days. Add an update?",
    tone: "emerald",
  },
  {
    title: "Spaced repetition review",
    detail: "Your Philippians 4:6-7 memory verse is due for review today.",
    tone: "blue",
  },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <BellRing className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Notification Center</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Keep reminders, answered prayer prompts, plan nudges, and mentor
            follow-ups in one organized place.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-5">
          {notifications.map((notification) => (
            <article
              key={notification.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {notification.tone === "amber" && <Clock3 className="h-6 w-6 text-amber-700" />}
                {notification.tone === "blue" && (
                  <MessageSquareMore className="h-6 w-6 text-blue-700" />
                )}
                {notification.tone === "emerald" && (
                  <CheckCheck className="h-6 w-6 text-emerald-700" />
                )}
                <h2 className="text-2xl font-semibold text-[#0f172a]">
                  {notification.title}
                </h2>
              </div>
              <p className="mt-4 leading-7 text-slate-600">{notification.detail}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-center gap-3 text-amber-950">
            <Repeat2 className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Follow-up automation</h2>
          </div>
          <p className="mt-4 leading-7 text-amber-950">
            This is where reminders become smarter: trigger nudges from unfinished plans,
            mentor guidance, prayer updates, workflow runs, and journey milestones instead
            of sending generic notifications.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 text-blue-950">
            <BellRing className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Deeper notifications</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "In-app reminders",
              "Email nudges",
              "Push notifications",
              "Journey and mentor milestone alerts",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-blue-200 bg-white p-5 text-sm font-medium text-blue-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Daily study reminders tied to the dashboard",
            "Memorization review nudges based on spaced repetition",
            "Journey, mentor, and prayer follow-ups triggered by real user progress",
          ].map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <BellRing className="h-6 w-6 text-[#1e40af]" />
              <p className="mt-4 text-sm leading-6 text-slate-600">{item}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Reminder stack worth building</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Daily study reminders",
              "Prayer follow-up nudges",
              "Guided path check-ins",
              "Memory review alerts",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="flex items-center gap-3 text-emerald-950">
            <BellRing className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Automation worth building</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Daily reminders triggered by the Today page instead of generic push copy",
              "Prayer follow-ups when a request has been quiet for a week",
              "Memory prompts based on actual spaced-repetition needs",
              "Guided-path nudges that reopen the next unfinished step",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-medium text-emerald-950"
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
