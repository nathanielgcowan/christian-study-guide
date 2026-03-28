import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, PenSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Christian Study Guide",
  description:
    "Read updates, Bible study insights, discipleship ideas, and product notes from Christian Study Guide.",
};

const posts = [
  {
    title: "Designing a daily Bible habit that people can actually keep",
    excerpt:
      "A look at why structure, continuity, and low-friction next steps matter more than endless feature depth.",
    category: "Product",
    date: "March 28, 2026",
    href: "/about",
  },
  {
    title: "How churches can turn sermon response into discipleship follow-through",
    excerpt:
      "Practical ways to connect preaching, prayer, groups, and weekday action steps inside a digital ministry workflow.",
    category: "Ministry",
    date: "March 21, 2026",
    href: "/products",
  },
  {
    title: "What new believers need most in their first month of following Jesus",
    excerpt:
      "Clarity, language, community, and simple next steps matter more than complexity when someone is just getting started.",
    category: "Discipleship",
    date: "March 14, 2026",
    href: "/new-believers",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Blog
            </p>
            <h1 className="mt-6 text-5xl font-bold md:text-6xl">
              Notes on Bible product design, discipleship, and ministry workflows.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              The blog is where we share product thinking, practical ministry ideas, and lessons
              from building a more connected Christian study experience.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#1e40af]">
                  <span className="rounded-full bg-blue-50 px-3 py-1">{post.category}</span>
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {post.date}
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-semibold text-slate-950">{post.title}</h2>
                <p className="mt-4 text-base leading-8 text-slate-600">{post.excerpt}</p>
                <Link
                  href={post.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
                >
                  Read related page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <PenSquare className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">What you’ll find here</h2>
              </div>
              <div className="mt-6 space-y-3 text-sm leading-7 text-amber-950">
                <p>• Product updates and feature direction</p>
                <p>• Discipleship strategy for individuals and churches</p>
                <p>• Study methodology, content systems, and learning design</p>
                <p>• Reflections on building a serious Christian app with warmth and clarity</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Want to collaborate?</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                If you are interested in ministry partnerships, product feedback, or church use
                cases, the contact page is the best place to start.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
