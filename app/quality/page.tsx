"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Activity,
  Accessibility,
  AlertCircle,
  BadgeCheck,
  Bug,
  Eye,
  Gauge,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getQualityReports, saveQualityReport } from "@/lib/persistence";

const QUALITY_REPORTS_KEY = "christian-study-guide:quality-reports";

interface QualityReport {
  id: string;
  reportType: string;
  status: string;
  summary: string;
}

export default function QualityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [draft, setDraft] = useState({
    reportType: "accessibility",
    status: "planned",
    summary: "",
  });
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session) {
          const data = await getQualityReports();
          setReports(
            (data as Array<{
              id: string;
              report_type: string;
              status: string;
              summary: string;
            }>).map((item) => ({
              id: item.id,
              reportType: item.report_type,
              status: item.status,
              summary: item.summary,
            }))
          );
        } else {
          const raw = localStorage.getItem(QUALITY_REPORTS_KEY);
          if (raw) {
            setReports(JSON.parse(raw));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSaveReport = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.summary.trim()) return;

    try {
      if (user) {
        const saved = await saveQualityReport({
          report_type: draft.reportType,
          status: draft.status,
          summary: draft.summary,
        });
        setReports((current) => [
          {
            id: saved.id,
            reportType: saved.report_type,
            status: saved.status,
            summary: saved.summary,
          },
          ...current,
        ]);
      } else {
        const next = [
          {
            id: `${Date.now()}`,
            reportType: draft.reportType,
            status: draft.status,
            summary: draft.summary,
          },
          ...reports,
        ];
        setReports(next);
        localStorage.setItem(QUALITY_REPORTS_KEY, JSON.stringify(next));
      }

      setDraft((current) => ({ ...current, summary: "" }));
      setSaveFeedback("Quality report saved");
    } catch {
      setSaveFeedback("Save failed");
    } finally {
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Loading platform quality...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <BadgeCheck className="mx-auto h-16 w-16" />
          <h1 className="mt-6 text-5xl font-bold md:text-6xl">Platform Quality</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            Accessibility, testing, observability, and production-readiness systems
            for a healthier, more trustworthy product.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#0f172a]">Quality tracking</h2>
            {saveFeedback ? (
              <p className="text-sm font-medium text-emerald-700">{saveFeedback}</p>
            ) : null}
          </div>
          <form onSubmit={handleSaveReport} className="mt-6 grid gap-4 md:grid-cols-2">
            <select
              value={draft.reportType}
              onChange={(event) =>
                setDraft((current) => ({ ...current, reportType: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="accessibility">Accessibility</option>
              <option value="testing">Testing</option>
              <option value="observability">Observability</option>
              <option value="readiness">Readiness</option>
            </select>
            <select
              value={draft.status}
              onChange={(event) =>
                setDraft((current) => ({ ...current, status: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af]"
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <textarea
              value={draft.summary}
              onChange={(event) =>
                setDraft((current) => ({ ...current, summary: event.target.value }))
              }
              rows={4}
              placeholder="What are you improving or tracking?"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1e40af] md:col-span-2"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534] md:col-span-2"
            >
              Save quality report
            </button>
          </form>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
            <Accessibility className="h-6 w-6 text-blue-950" />
            <h2 className="mt-4 text-2xl font-semibold text-blue-950">Accessibility</h2>
            <p className="mt-4 leading-7 text-blue-900">
              Keyboard flow, contrast, reduced motion, screen-reader polish, and transcripts.
            </p>
          </article>
          <article className="rounded-3xl border border-violet-200 bg-violet-50 p-8">
            <Bug className="h-6 w-6 text-violet-950" />
            <h2 className="mt-4 text-2xl font-semibold text-violet-950">Testing</h2>
            <p className="mt-4 leading-7 text-violet-900">
              Better coverage for passage flows, notes, mentor saves, and premium systems.
            </p>
          </article>
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <Activity className="h-6 w-6 text-amber-950" />
            <h2 className="mt-4 text-2xl font-semibold text-amber-950">Observability</h2>
            <p className="mt-4 leading-7 text-amber-900">
              Error monitoring, usage analytics, and key funnel tracking across the app.
            </p>
          </article>
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
            <Gauge className="h-6 w-6 text-emerald-950" />
            <h2 className="mt-4 text-2xl font-semibold text-emerald-950">Readiness</h2>
            <p className="mt-4 leading-7 text-emerald-900">
              Production checks for reliability, performance, and confidence during growth.
            </p>
          </article>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <Eye className="h-6 w-6 text-[#14532d]" />
              <h2 className="text-2xl font-semibold">Accessibility upgrades</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Improved keyboard navigation",
                "Clearer focus states and labels",
                "Reduced-motion compatibility",
                "Audio transcripts and readable summaries",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-800"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-rose-200 bg-rose-50 p-8">
            <div className="flex items-center gap-3 text-rose-950">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Testing and observability</h2>
            </div>
            <p className="mt-4 leading-7 text-rose-900">
              This is the systems layer for catching regressions faster, understanding
              usage patterns, and keeping advanced features stable as the app grows.
            </p>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Saved reports</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reports.length > 0 ? (
              reports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#14532d]">
                    {report.reportType}
                  </p>
                  <p className="mt-2 text-xs font-medium text-slate-500">{report.status}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{report.summary}</p>
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Save one quality report above to start tracking platform-readiness work.
              </p>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-rose-200 bg-rose-50 p-8">
          <div className="flex items-center gap-3 text-rose-950">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Trust operations</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Moderation queues for shared studies and community content",
              "Audit trails for publishing, billing, and admin actions",
              "Critical-flow test coverage for saves and collaboration",
              "Operational dashboards for errors and regressions",
            ].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-rose-200 bg-white p-5 text-sm font-medium text-rose-950"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-8">
          <h2 className="text-2xl font-semibold text-blue-950">Production hardening checklist</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "End-to-end coverage for auth, notes, mentor, prayer, and persistence flows",
              "Error monitoring and alerting for API routes and client failures",
              "Performance checks on large dashboards and passage pages",
              "Accessibility audits for keyboard, focus, contrast, and reduced motion",
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
            "Error monitoring for API failures, auth edge cases, and payment issues",
            "Analytics funnels for activation, retention, path completion, and premium conversion",
            "Performance budgets for dashboard, passage, and media-heavy pages",
          ].map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <Activity className="h-6 w-6 text-[#1e40af]" />
              <p className="mt-4 text-sm leading-6 text-slate-600">{item}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
