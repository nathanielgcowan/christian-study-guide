import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog Article Not Found | Christian Study Guide",
    };
  }

  return {
    title: `${post.title} | Christian Study Guide`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-18 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-blue-100">
              <span className="rounded-full bg-white/10 px-3 py-1">{post.category}</span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {post.readingTime}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">{post.excerpt}</p>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-blue-200">
              By {post.author}
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-5xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="space-y-6 text-lg leading-8 text-slate-700">
            {post.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold text-slate-950">{section.heading}</h2>
                <div className="mt-4 space-y-5 text-lg leading-8 text-slate-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-5 space-y-3 text-base leading-7 text-slate-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-[#1e40af]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <div className="space-y-5 text-lg leading-8 text-slate-700">
              {post.closing.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Keep exploring</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              This article connects to a broader part of the app if you want to keep going.
            </p>
            <Link
              href={post.relatedHref}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1e40af] transition hover:text-[#1e3a8a]"
            >
              {post.relatedLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7">
            <h2 className="text-xl font-semibold text-amber-950">More articles</h2>
            <div className="mt-5 space-y-4">
              {getAllBlogPosts()
                .filter((candidate) => candidate.slug !== post.slug)
                .map((candidate) => (
                  <Link
                    key={candidate.slug}
                    href={`/blog/${candidate.slug}`}
                    className="block rounded-2xl border border-amber-200 bg-white px-4 py-4 text-sm transition hover:border-amber-300 hover:bg-amber-100/40"
                  >
                    <p className="font-semibold text-slate-950">{candidate.title}</p>
                    <p className="mt-2 leading-6 text-slate-600">{candidate.excerpt}</p>
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
