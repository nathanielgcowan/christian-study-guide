import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquareMore, PhoneCall } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Christian Study Guide",
  description:
    "Get in touch with Christian Study Guide for ministry partnerships, product questions, and platform support.",
};

const contactReasons = [
  "Church partnership and discipleship workflows",
  "Product questions and feedback",
  "Content collaboration or publishing discussions",
  "Support requests and ministry use cases",
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Contact
            </p>
            <h1 className="mt-6 text-5xl font-bold md:text-6xl">
              Let’s talk about ministry, product needs, and discipleship tools.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              If you are exploring the platform for personal use, church use, or collaboration,
              this is the right place to start the conversation.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-950">Get in touch</h2>
            <div className="mt-6 space-y-4">
              <a
                href="mailto:newtcowan@gmail.com"
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <Mail className="h-5 w-5 text-[#1e40af]" />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Email</p>
                  <p className="text-sm text-slate-600">newtcowan@gmail.com</p>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <MessageSquareMore className="h-5 w-5 text-[#1e40af]" />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Best for</p>
                  <p className="text-sm text-slate-600">
                    Partnerships, questions, feature feedback, and church discussions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <PhoneCall className="h-5 w-5 text-[#1e40af]" />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Response expectation</p>
                  <p className="text-sm text-slate-600">
                    We aim to respond thoughtfully and point you to the right next step.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <h2 className="text-2xl font-semibold text-blue-950">Common reasons people reach out</h2>
            <div className="mt-6 grid gap-3">
              {contactReasons.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-blue-200 bg-white p-4 text-sm leading-7 text-blue-950"
                >
                  {item}
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold text-amber-950">Explore before you email</h2>
              <p className="mt-4 text-base leading-8 text-amber-950">
                If you want to understand the platform first, the About, Products, and Blog pages
                will give you a clearer picture of what we are building and who it is for.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
              >
                About Us
              </Link>
              <Link
                href="/products"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
              >
                Products and Services
              </Link>
              <Link
                href="/blog"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
              >
                Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
