import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Christian Study Guide",
  description:
    "Learn the mission, values, and story behind Christian Study Guide and how we help people grow in Scripture, prayer, and community.",
};

const pillars = [
  {
    title: "Scripture first",
    detail:
      "We want every tool in the platform to lead people back into the Bible with more confidence, context, and consistency.",
    icon: BookOpen,
  },
  {
    title: "Practical discipleship",
    detail:
      "We build for daily use, not just curiosity: reading, prayer, reflection, memorization, and follow-through.",
    icon: HeartHandshake,
  },
  {
    title: "Clear guidance",
    detail:
      "A growing library of study flows, guided journeys, and explainers helps people know what to do next.",
    icon: Lightbulb,
  },
  {
    title: "Growth in community",
    detail:
      "The platform is designed to support families, mentors, church leaders, and groups alongside personal study.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              About Us
            </p>
            <h1 className="mt-6 text-5xl font-bold md:text-6xl">
              A Bible study platform built to help faith become daily practice.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Christian Study Guide exists to make Scripture engagement clearer, warmer, and
              more consistent for people at every stage of spiritual growth.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-950">Our mission</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              We want to help people move from scattered spiritual intention to a real rhythm of
              reading the Bible, praying honestly, asking better questions, and taking concrete
              next steps of obedience. That means building more than content pages. It means
              building a product that helps someone open the app and know what to do today.
            </p>
            <p className="mt-5 text-base leading-8 text-slate-600">
              The vision is to support personal discipleship, church leadership, group study,
              and new believer growth in one connected experience instead of a collection of
              disconnected tools.
            </p>
          </article>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <h2 className="text-2xl font-semibold text-amber-950">Who we serve</h2>
            <div className="mt-6 grid gap-3">
              {[
                "Individual believers building a daily Bible and prayer rhythm",
                "New believers who need a clear starting path",
                "Small groups and mentors guiding shared discipleship",
                "Church leaders creating studies, journeys, and follow-up rhythms",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-amber-200 bg-white p-4 text-sm leading-7 text-amber-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-slate-950">What shapes the platform</h2>
            <p className="mt-4 text-lg text-slate-600">
              The strongest version of this product is grounded, pastoral, and useful in real life.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <Icon className="h-6 w-6 text-[#1e40af]" />
                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold text-blue-950">Where we are going</h2>
              <p className="mt-4 text-base leading-8 text-blue-950">
                We are building toward a richer discipleship platform with personalized study
                recommendations, better group support, stronger new believer guidance, and more
                connected passage-to-prayer-to-action journeys.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-100"
            >
              View products and services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
