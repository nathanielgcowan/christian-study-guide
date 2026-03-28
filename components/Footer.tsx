import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-8 w-8 text-[#d4af37]" />
              <span className="text-2xl font-bold">Christian Study Guide</span>
            </div>
            <p className="text-zinc-400 max-w-xs">
              Free Bible studies and devotionals to help you grow closer to
              Christ, one day at a time.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm text-zinc-500">
              Made with <Heart className="h-4 w-4 text-red-500" /> for the glory
              of God
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[#d4af37]">
              Explore
            </h3>
            <div className="space-y-3 text-zinc-400">
              <Link
                href="/today"
                className="block hover:text-white transition"
              >
                Today
              </Link>
              <Link
                href="/dashboard"
                className="block hover:text-white transition"
              >
                Dashboard
              </Link>
              <Link
                href="/voice"
                className="block hover:text-white transition"
              >
                Voice Mode
              </Link>
              <Link
                href="/gamification"
                className="block hover:text-white transition"
              >
                Gamification
              </Link>
              <Link
                href="/fun"
                className="block hover:text-white transition"
              >
                Fun Layer
              </Link>
              <Link
                href="/verse-by-verse"
                className="block hover:text-white transition"
              >
                Verse by Verse
              </Link>
              <Link
                href="/certificates"
                className="block hover:text-white transition"
              >
                Certificates
              </Link>
              <Link
                href="/launch"
                className="block hover:text-white transition"
              >
                Launch Readiness
              </Link>
              <Link
                href="/studies"
                className="block hover:text-white transition"
              >
                Bible Studies
              </Link>
              <Link
                href="/devotionals"
                className="block hover:text-white transition"
              >
                Daily Devotionals
              </Link>
              <Link
                href="/topics"
                className="block hover:text-white transition"
              >
                Topic Explorer
              </Link>
              <Link
                href="/search"
                className="block hover:text-white transition"
              >
                Smart Search
              </Link>
              <Link
                href="/recommendations"
                className="block hover:text-white transition"
              >
                Recommendations
              </Link>
              <Link
                href="/ai-studio"
                className="block hover:text-white transition"
              >
                AI Studio
              </Link>
              <Link
                href="/images"
                className="block hover:text-white transition"
              >
                Images and Maps
              </Link>
              <Link
                href="/plan-builder"
                className="block hover:text-white transition"
              >
                Plan Builder
              </Link>
              <Link
                href="/reading-progress"
                className="block hover:text-white transition"
              >
                Reading Progress
              </Link>
              <Link
                href="/rooms"
                className="block hover:text-white transition"
              >
                Study Rooms
              </Link>
              <Link
                href="/translations"
                className="block hover:text-white transition"
              >
                Translation Compare
              </Link>
              <Link
                href="/commentaries"
                className="block hover:text-white transition"
              >
                Commentary Layer
              </Link>
              <Link
                href="/permissions"
                className="block hover:text-white transition"
              >
                Permissions
              </Link>
              <Link
                href="/admin-analytics"
                className="block hover:text-white transition"
              >
                Admin Analytics
              </Link>
              <Link
                href="/collaboration"
                className="block hover:text-white transition"
              >
                Collaboration
              </Link>
              <Link
                href="/journeys"
                className="block hover:text-white transition"
              >
                Journeys
              </Link>
              <Link
                href="/church-admin"
                className="block hover:text-white transition"
              >
                Church Admin
              </Link>
              <Link
                href="/paths"
                className="block hover:text-white transition"
              >
                Guided Paths
              </Link>
              <Link
                href="/new-believers"
                className="block hover:text-white transition"
              >
                New Believers
              </Link>
              <Link
                href="/quiz"
                className="block hover:text-white transition"
              >
                Bible Quiz
              </Link>
              <Link
                href="/sermon"
                className="block hover:text-white transition"
              >
                Sermon Builder
              </Link>
              <Link
                href="/courses"
                className="block hover:text-white transition"
              >
                Theology Courses
              </Link>
              <Link
                href="/groups"
                className="block hover:text-white transition"
              >
                Group Studies
              </Link>
              <Link
                href="/timeline"
                className="block hover:text-white transition"
              >
                Bible Timeline
              </Link>
              <Link
                href="/characters"
                className="block hover:text-white transition"
              >
                Character Explorer
              </Link>
              <Link
                href="/shared-studies"
                className="block hover:text-white transition"
              >
                Shared Studies
              </Link>
              <Link
                href="/publishing"
                className="block hover:text-white transition"
              >
                Publishing Flow
              </Link>
              <Link
                href="/mentor-chat"
                className="block hover:text-white transition"
              >
                Mentor Chat
              </Link>
              <Link
                href="/passage-dashboard"
                className="block hover:text-white transition"
              >
                Passage Dashboards
              </Link>
              <Link
                href="/devotional-library"
                className="block hover:text-white transition"
              >
                Devotional Library
              </Link>
              <Link
                href="/personalization"
                className="block hover:text-white transition"
              >
                Personalization
              </Link>
              <Link
                href="/orchestration"
                className="block hover:text-white transition"
              >
                AI Workflows
              </Link>
              <Link
                href="/intelligence"
                className="block hover:text-white transition"
              >
                Bible Intelligence
              </Link>
              <Link
                href="/theology"
                className="block hover:text-white transition"
              >
                Theology Explorer
              </Link>
              <Link
                href="/questions"
                className="block hover:text-white transition"
              >
                Bible Questions
              </Link>
              <Link
                href="/maps"
                className="block hover:text-white transition"
              >
                Bible Maps
              </Link>
              <Link
                href="/apologetics"
                className="block hover:text-white transition"
              >
                Apologetics Mode
              </Link>
              <Link
                href="/study-workspace"
                className="block hover:text-white transition"
              >
                Study Workspace
              </Link>
              <Link
                href="/memorize"
                className="block hover:text-white transition"
              >
                Verse Memorization
              </Link>
              <Link href="/bible" className="block hover:text-white transition">
                Bible Explorer
              </Link>
              <Link
                href="/community"
                className="block hover:text-white transition"
              >
                Community
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-5 text-[#d4af37]">
              Company
            </h3>
            <div className="space-y-3 text-zinc-400">
              <Link
                href="/about"
                className="block hover:text-white transition"
              >
                About Us
              </Link>
              <Link
                href="/products"
                className="block hover:text-white transition"
              >
                Products & Services
              </Link>
              <Link
                href="/blog"
                className="block hover:text-white transition"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="block hover:text-white transition"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[#d4af37]">
              Resources
            </h3>
            <div className="space-y-3 text-zinc-400">
              <Link
                href="/account"
                className="block hover:text-white transition"
              >
                My Account
              </Link>
              <Link
                href="/prayer"
                className="block hover:text-white transition"
              >
                Prayer Journal
              </Link>
              <Link
                href="/leaders"
                className="block hover:text-white transition"
              >
                Leader Tools
              </Link>
              <Link
                href="/goals"
                className="block hover:text-white transition"
              >
                Goal Tracking
              </Link>
              <Link
                href="/collections"
                className="block hover:text-white transition"
              >
                Verse Collections
              </Link>
              <Link
                href="/exports"
                className="block hover:text-white transition"
              >
                Export Suite
              </Link>
              <Link
                href="/insights"
                className="block hover:text-white transition"
              >
                Insights Timeline
              </Link>
              <Link
                href="/notifications"
                className="block hover:text-white transition"
              >
                Notifications
              </Link>
              <Link
                href="/admin"
                className="block hover:text-white transition"
              >
                Admin CMS
              </Link>
              <Link
                href="/workspace"
                className="block hover:text-white transition"
              >
                Team Workspace
              </Link>
              <Link
                href="/team-access"
                className="block hover:text-white transition"
              >
                Team Access
              </Link>
              <Link
                href="/subscriptions"
                className="block hover:text-white transition"
              >
                Subscriptions
              </Link>
              <Link
                href="/mobile"
                className="block hover:text-white transition"
              >
                Mobile Product
              </Link>
              <Link
                href="/quality"
                className="block hover:text-white transition"
              >
                Platform Quality
              </Link>
              <Link
                href="/trust"
                className="block hover:text-white transition"
              >
                Trust & Ops
              </Link>
              <Link
                href="/profile"
                className="block hover:text-white transition"
              >
                Public Profile
              </Link>
              <Link
                href="/onboarding"
                className="block hover:text-white transition"
              >
                Guided Start
              </Link>
              <Link href="/terms" className="block hover:text-white transition">
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="block hover:text-white transition"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[#d4af37]">
              Connect
            </h3>
            <div className="space-y-3 text-zinc-400">
              <p className="text-sm">Growing together in faith</p>
              <p className="text-sm">newtcowan@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 text-center text-xs text-zinc-500">
          <p>
            This website is a ministry resource. All Scripture is taken from
            public domain or properly licensed translations.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-xs">
            <Link href="/terms" className="hover:text-[#d4af37] transition">
              Terms and Conditions
            </Link>
            <Link href="/privacy" className="hover:text-[#d4af37] transition">
              Privacy Policy
            </Link>
          </div>
          <div className="mt-6">
            © {currentYear} FaithPath Studies. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
