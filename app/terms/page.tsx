import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Christian Study Guide",
  description:
    "Read the Terms and Conditions for using Christian Study Guide, including account use, content rights, and platform expectations.",
};

const termsSections = [
  {
    title: "1. Acceptance of terms",
    body:
      "By accessing or using Christian Study Guide, you agree to these Terms and Conditions. If you do not agree, please do not use the platform.",
  },
  {
    title: "2. Platform purpose",
    body:
      "Christian Study Guide is designed to support Bible study, prayer, discipleship, and Christian learning for personal, group, and ministry use.",
  },
  {
    title: "3. Account responsibilities",
    body:
      "If you create an account, you are responsible for safeguarding your login credentials and for activity that occurs under your account.",
  },
  {
    title: "4. Acceptable use",
    body:
      "You agree not to misuse the platform, harass others, post harmful or unlawful content, interfere with service operation, or attempt unauthorized access.",
  },
  {
    title: "5. Content and intellectual property",
    body:
      "Unless otherwise noted, platform content, studies, designs, workflows, and written materials belong to Christian Study Guide. Personal and ministry use is welcome; commercial reuse requires permission.",
  },
  {
    title: "6. Community and shared content",
    body:
      "If you post notes, comments, prayer requests, or shared material, you are responsible for that content and agree not to submit anything unlawful, abusive, or misleading.",
  },
  {
    title: "7. No pastoral, legal, or medical guarantee",
    body:
      "The platform is intended as a study and discipleship resource. It does not replace pastoral care, licensed counseling, medical guidance, or legal advice.",
  },
  {
    title: "8. Availability and changes",
    body:
      "We may update, modify, suspend, or remove features at any time. We may also revise these terms as the platform evolves.",
  },
  {
    title: "9. Limitation of liability",
    body:
      "Christian Study Guide is provided on an as-is and as-available basis. To the fullest extent permitted by law, we disclaim liability for damages arising from use of the platform.",
  },
  {
    title: "10. Contact",
    body:
      "Questions about these terms can be sent to newtcowan@gmail.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <FileText className="h-4 w-4" />
              Terms and Conditions
            </div>
            <h1 className="mt-6 text-5xl font-bold md:text-6xl">
              Clear expectations for using Christian Study Guide.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Last updated: March 28, 2026. These terms explain how the platform may be
              used, what responsibilities come with an account, and how shared content should
              be handled.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            {termsSections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-2xl font-semibold text-slate-950">{section.title}</h2>
                <p className="mt-4 text-base leading-8 text-slate-600">{section.body}</p>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 text-amber-950">
                <ShieldCheck className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">In plain language</h2>
              </div>
              <div className="mt-6 space-y-3 text-sm leading-7 text-amber-950">
                <p>• Use the platform respectfully and lawfully.</p>
                <p>• Keep your account secure.</p>
                <p>• Do not reuse platform content commercially without permission.</p>
                <p>• Shared content should support healthy Christian community, not harm it.</p>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
              <h2 className="text-2xl font-semibold text-blue-950">Need more context?</h2>
              <p className="mt-4 text-sm leading-7 text-blue-950">
                If you want to understand how personal information is handled, the Privacy Policy
                explains what is collected and how it is used.
              </p>
              <Link
                href="/privacy"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-100"
              >
                Read privacy policy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
