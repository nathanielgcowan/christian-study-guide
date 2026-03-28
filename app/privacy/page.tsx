import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Christian Study Guide",
  description:
    "Read the Privacy Policy for Christian Study Guide, including what data is collected, how it is used, and your available choices.",
};

const privacySections = [
  {
    title: "1. Information we collect",
    body:
      "We may collect account details such as your email address, profile information you choose to provide, study activity, prayer or note content you save, and technical information needed to operate the service.",
  },
  {
    title: "2. How we use information",
    body:
      "We use information to operate the platform, personalize study experiences, save user progress, improve product quality, support security, and respond to questions or support needs.",
  },
  {
    title: "3. Shared and community content",
    body:
      "If you choose to post shared content such as comments, prayer requests, or public profile information, that content may be visible to others depending on the feature and your settings.",
  },
  {
    title: "4. Service providers and infrastructure",
    body:
      "We may rely on third-party providers for hosting, authentication, storage, analytics, and operational tooling. Those providers process data only as needed to support the platform.",
  },
  {
    title: "5. Cookies and authentication",
    body:
      "We use cookies or similar technologies primarily for authentication, session continuity, security, and core platform functionality.",
  },
  {
    title: "6. Data security",
    body:
      "We use reasonable administrative, technical, and organizational safeguards to protect user data. No system can guarantee absolute security, but protecting user trust is important to us.",
  },
  {
    title: "7. Your choices",
    body:
      "You may be able to access, update, export, or delete certain account information through the platform or by contacting us. Public-facing settings can also be adjusted where features allow.",
  },
  {
    title: "8. Children's privacy",
    body:
      "The platform is not intended for children under 13, and we do not knowingly collect personal information from children in that age group.",
  },
  {
    title: "9. Policy updates",
    body:
      "We may revise this Privacy Policy as the platform changes. Material updates will be reflected on this page with a revised effective date.",
  },
  {
    title: "10. Contact",
    body:
      "Questions about privacy can be sent to newtcowan@gmail.com.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#7c2d12] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <Lock className="h-4 w-4" />
              Privacy Policy
            </div>
            <h1 className="mt-6 text-5xl font-bold md:text-6xl">
              How Christian Study Guide handles your information.
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              Last updated: March 28, 2026. This policy explains what information may be
              collected, how it supports the platform, and what choices you have.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            {privacySections.map((section) => (
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
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 text-emerald-950">
                <Shield className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Privacy at a glance</h2>
              </div>
              <div className="mt-6 space-y-3 text-sm leading-7 text-emerald-950">
                <p>• We do not frame the platform around selling user data.</p>
                <p>• Information is used to operate and improve the service.</p>
                <p>• Shared content is only visible when a feature is designed for sharing.</p>
                <p>• You can contact us with questions about access or deletion requests.</p>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
              <h2 className="text-2xl font-semibold text-blue-950">Related legal page</h2>
              <p className="mt-4 text-sm leading-7 text-blue-950">
                The Terms and Conditions explain the rules for using the platform, including
                account use, acceptable behavior, and content rights.
              </p>
              <Link
                href="/terms"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-100"
              >
                Read terms and conditions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
