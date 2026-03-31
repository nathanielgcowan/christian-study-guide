import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Map } from "lucide-react";
import { siteMapSections } from "../../lib/site-map";

export const metadata: Metadata = {
  title: "Sitemap | Christian Study Guide",
  description:
    "Browse the major pages and study areas available across Christian Study Guide.",
};

export default function SiteMapPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <Map className="h-4 w-4" />
              Website Sitemap
            </div>
            <h1 className="mt-6 text-5xl font-bold md:text-6xl">
              A simple map of the platform.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              The header stays focused on the most important paths. This page
              collects the wider set of destinations in one place so the site
              remains easy to explore.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10 rounded-3xl border border-blue-200 bg-blue-50 p-6 text-blue-950">
          <div className="flex items-start gap-3">
            <Compass className="mt-1 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">
              Looking for a faster route? Start with `Today`, `Study`, `Bible`,
              `Paths`, or `Prayer` in the main navigation, then use this sitemap
              for deeper exploration.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {siteMapSections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-slate-950">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {section.description}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-950"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
