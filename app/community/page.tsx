"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckSquare,
  Heart,
  Lightbulb,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";

interface PrayerRequest {
  id: number;
  name: string;
  title: string;
  prayer: string;
  time: string;
  likes: number;
  prayed: boolean;
}

interface StudyGroup {
  id: number;
  name: string;
  focus: string;
  schedule: string;
  summary: string;
}

interface GroupFollowUp {
  id: number;
  group: string;
  action: string;
  owner: string;
  done: boolean;
}

const initialPrayerRequests: PrayerRequest[] = [
  {
    id: 1,
    name: "Sarah M.",
    title: "Healing for my mother",
    prayer:
      "Please pray for my mom who is battling cancer. She’s been feeling very weak lately. We trust God for complete healing.",
    time: "2 hours ago",
    likes: 24,
    prayed: false,
  },
  {
    id: 2,
    name: "David K.",
    title: "Strength in my marriage",
    prayer:
      "My wife and I are going through a difficult season. Pray that God would restore love, patience, and unity in our home.",
    time: "Yesterday",
    likes: 18,
    prayed: true,
  },
  {
    id: 3,
    name: "Rachel T.",
    title: "Anxiety and fear",
    prayer:
      "I’ve been struggling with severe anxiety. I know God is with me but I need His peace to guard my heart and mind.",
    time: "3 days ago",
    likes: 31,
    prayed: false,
  },
];

const studyGroups: StudyGroup[] = [
  {
    id: 1,
    name: "Young Adults in James",
    focus: "Faith under pressure, accountability, and prayer",
    schedule: "Tuesdays at 7:00 PM",
    summary:
      "A guided 6-week small group using the passage tools, mentor prompts, and discussion questions together.",
  },
  {
    id: 2,
    name: "Moms Morning Psalm Circle",
    focus: "Prayer, encouragement, and honest reflection",
    schedule: "Fridays at 6:30 AM",
    summary:
      "A short weekly rhythm built around a psalm, one devotional prompt, and a shared prayer check-in.",
  },
  {
    id: 3,
    name: "Student Scripture Lab",
    focus: "Verse memory, Bible basics, and topic-based study",
    schedule: "Sundays after youth service",
    summary:
      "A youth-friendly study room for memorization prompts, reflection questions, and practical next steps.",
  },
];

const communityGuidelines = [
  "Share requests honestly, but protect private details when they involve other people.",
  "Respond with encouragement, Scripture, and prayer rather than debate or quick fixes.",
  "Keep group discussion anchored to the passage and the actual need in front of you.",
  "Use follow-up and answered-prayer updates so people know they were truly cared for.",
];

const discipleshipLoops = [
  "Prayer request -> Scripture encouragement -> follow-up check-in",
  "Weekly group study -> shared notes -> next-step accountability",
  "Sermon companion -> small-group discussion -> prayer response",
];

export default function CommunityPage() {
  const [prayerRequests, setPrayerRequests] = useState(initialPrayerRequests);
  const [newPrayer, setNewPrayer] = useState({ title: "", prayer: "" });
  const [showForm, setShowForm] = useState(false);
  const [groupAgenda, setGroupAgenda] = useState({
    weekOf: "",
    passage: "",
    discussion: "",
    followUp: "",
  });
  const [followUps, setFollowUps] = useState<GroupFollowUp[]>([
    {
      id: 1,
      group: "Young Adults in James",
      action: "Text the two members who missed this week and ask how to pray for them.",
      owner: "Leader",
      done: false,
    },
    {
      id: 2,
      group: "Moms Morning Psalm Circle",
      action: "Share one answered-prayer update in Friday morning group chat.",
      owner: "Host",
      done: true,
    },
  ]);

  const handlePray = (id: number) => {
    setPrayerRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, likes: request.likes + 1, prayed: true }
          : request,
      ),
    );
  };

  const handleSubmitPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.title || !newPrayer.prayer) return;

    const newRequest: PrayerRequest = {
      id: Date.now(),
      name: "You",
      title: newPrayer.title,
      prayer: newPrayer.prayer,
      time: "Just now",
      likes: 1,
      prayed: true,
    };

    setPrayerRequests([newRequest, ...prayerRequests]);
    setNewPrayer({ title: "", prayer: "" });
    setShowForm(false);
  };

  const addFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupAgenda.passage || !groupAgenda.followUp) return;

    setFollowUps((current) => [
      {
        id: Date.now(),
        group: groupAgenda.passage,
        action: groupAgenda.followUp,
        owner: "Leader",
        done: false,
      },
      ...current,
    ]);

    setGroupAgenda({
      weekOf: "",
      passage: "",
      discussion: "",
      followUp: "",
    });
  };

  const toggleFollowUp = (id: number) => {
    setFollowUps((current) =>
      current.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <Users className="mb-6 h-16 w-16 text-[#d4af37]" />
            <h1 className="text-5xl font-bold md:text-6xl">Community</h1>
            <p className="mt-6 text-xl leading-8 text-blue-100">
              Pray together, encourage one another, and build small-group
              rhythms that turn Bible study into shared discipleship.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-blue-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-[#0f172a]">
                  Small group rooms
                </h2>
                <p className="mt-2 text-slate-600">
                  A simple picture of where group study tools can grow next.
                </p>
              </div>
              <Link
                href="/leaders"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Leader tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4">
              {studyGroups.map((group) => (
                <article
                  key={group.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-[#0f172a]">
                      {group.name}
                    </h3>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      <Calendar className="h-3 w-3" />
                      {group.schedule}
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#1e40af]">
                    {group.focus}
                  </p>
                  <p className="mt-3 leading-7 text-slate-600">
                    {group.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-[#d4af37]/20 bg-[#fffaf0] p-8">
            <h2 className="text-2xl font-semibold text-[#0f172a]">
              What group rooms can include
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <li>• Shared passage prompts and discussion questions</li>
              <li>• Weekly prayer check-ins and answered prayer updates</li>
              <li>• Group notes and saved study links for leaders</li>
              <li>• Mentor-guided follow-up for students and new believers</li>
            </ul>
            <Link
              href="/study"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
            >
              Open the study hub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-16">
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold text-[#0f172a]">
              Prayer wall
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-2xl bg-[#d4af37] px-6 py-3 font-semibold text-[#0f172a] transition hover:bg-[#c9a66b]"
            >
              Share a prayer request
            </button>
          </div>

          {showForm && (
            <div className="mb-10 rounded-3xl border border-[#d4af37]/20 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-[#0f172a]">
                Share your prayer request
              </h3>
              <form onSubmit={handleSubmitPrayer} className="mt-6 space-y-4">
                <input
                  type="text"
                  value={newPrayer.title}
                  onChange={(e) =>
                    setNewPrayer({ ...newPrayer, title: e.target.value })
                  }
                  placeholder="What would you like prayer for?"
                  className="w-full rounded-2xl border border-zinc-200 px-5 py-4 outline-none transition focus:border-[#d4af37]"
                  required
                />
                <textarea
                  value={newPrayer.prayer}
                  onChange={(e) =>
                    setNewPrayer({ ...newPrayer, prayer: e.target.value })
                  }
                  placeholder="Share more details"
                  rows={5}
                  className="w-full rounded-2xl border border-zinc-200 px-5 py-4 outline-none transition focus:border-[#d4af37]"
                  required
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#0f172a] px-6 py-3 font-semibold text-white transition hover:bg-[#1f2937]"
                  >
                    <Send className="h-4 w-4" />
                    Share request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-2xl border border-zinc-300 px-6 py-3 font-medium text-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-6">
            {prayerRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#1e40af]">{request.name}</p>
                    <p className="text-sm text-zinc-500">{request.time}</p>
                  </div>
                  <button
                    onClick={() => handlePray(request.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      request.prayed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${request.prayed ? "fill-current" : ""}`}
                    />
                    {request.likes}
                  </button>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-[#0f172a]">
                  {request.title}
                </h3>
                <p className="mt-4 leading-8 text-slate-700">{request.prayer}</p>

                <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
                  <MessageCircle className="h-5 w-5" />
                  <span>Encourage this person with prayer and presence</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <div className="flex items-center gap-3 text-blue-950">
              <CheckSquare className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Leader agenda and follow-up</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-blue-950">
              Plan one passage, one discussion direction, and one pastoral follow-up so group
              discipleship keeps going after the meeting ends.
            </p>
            <form onSubmit={addFollowUp} className="mt-6 grid gap-4">
              <input
                value={groupAgenda.weekOf}
                onChange={(e) =>
                  setGroupAgenda((current) => ({ ...current, weekOf: e.target.value }))
                }
                placeholder="Week of April 3"
                className="rounded-2xl border border-blue-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              />
              <input
                value={groupAgenda.passage}
                onChange={(e) =>
                  setGroupAgenda((current) => ({ ...current, passage: e.target.value }))
                }
                placeholder="Group name or passage focus"
                className="rounded-2xl border border-blue-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              />
              <textarea
                value={groupAgenda.discussion}
                onChange={(e) =>
                  setGroupAgenda((current) => ({ ...current, discussion: e.target.value }))
                }
                rows={3}
                placeholder="Main discussion direction or care need"
                className="rounded-2xl border border-blue-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              />
              <textarea
                value={groupAgenda.followUp}
                onChange={(e) =>
                  setGroupAgenda((current) => ({ ...current, followUp: e.target.value }))
                }
                rows={3}
                placeholder="Who needs follow-up, prayer, or encouragement this week?"
                className="rounded-2xl border border-blue-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              />
              <button
                type="submit"
                className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Save follow-up plan
              </button>
            </form>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <div className="flex items-center gap-3 text-emerald-950">
              <Heart className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Follow-up queue</h2>
            </div>
            <div className="mt-6 space-y-3">
              {followUps.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleFollowUp(item.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    item.done
                      ? "border-emerald-300 bg-white text-emerald-950"
                      : "border-emerald-200 bg-white text-slate-700 hover:bg-emerald-100"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {item.group} • {item.owner}
                  </p>
                  <p className="mt-2 text-sm leading-6">{item.action}</p>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <div className="flex items-center gap-3 text-violet-950">
              <MessageCircle className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Shared study comments</h2>
            </div>
            <p className="mt-4 leading-7 text-violet-900">
              Shared public study pages can support comments, feedback, and follow-up
              discussion for groups reviewing the same passage together.
            </p>
            <Link
              href="/shared-studies"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-950 transition hover:text-violet-800"
            >
              Open shared studies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <aside className="rounded-3xl border border-rose-200 bg-rose-50 p-8">
            <div className="flex items-center gap-3 text-rose-950">
              <Heart className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Moderation tools</h2>
            </div>
            <p className="mt-4 leading-7 text-rose-900">
              Community growth gets healthier with reporting, approvals, moderation queues,
              and clearer escalation tools across prayers, comments, and shared content.
            </p>
          </aside>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <CheckSquare className="h-6 w-6 text-[#1e40af]" />
              <h2 className="text-2xl font-semibold">Healthy community practices</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {communityGuidelines.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <Heart className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Discipleship loops</h2>
              </div>
              <div className="mt-6 space-y-3">
                {discipleshipLoops.map((item) => (
                  <article
                    key={item}
                    className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm leading-6 text-emerald-950"
                  >
                    {item}
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <Lightbulb className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Best use of this space</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-amber-950">
                Community is strongest when it supports real local discipleship: small groups,
                prayer follow-up, sermon response, and care around the Word, not just isolated posts.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
