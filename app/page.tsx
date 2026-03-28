import Link from "next/link";
import VerseOfTheDay from "@/components/VerseOfTheDay";
import HomeHero from "@/components/HomeHero";
import { getCurrentUser } from "@/lib/auth-server";
import {
  BookOpen,
  BrainCircuit,
  Brain,
  Bookmark,
  Flame,
  PenTool,
  ArrowRight,
  CheckCircle,
  Quote,
  Calendar,
  Compass,
  Users,
  Heart,
  Mic,
  NotebookPen,
  Search,
  Shapes,
  Sparkles,
  Target,
  TrendingUp,
  Volume2,
  Waves,
} from "lucide-react";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <HomeHero isSignedIn={Boolean(user)} />

      <VerseOfTheDay />

      <section className="py-16 bg-[#eef4ff] border-y border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-white border border-blue-200 shadow-sm p-8 md:p-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">
                <BrainCircuit className="h-4 w-4" />
                New advanced layer
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl font-bold text-text-primary">
                Open the Command Center
              </h2>
              <p className="mt-4 text-lg leading-8 text-text-secondary">
                A higher-level dashboard for recommendations, system health,
                study activity, and the connected layers you&apos;ve already built.
              </p>
            </div>
            <Link
              href="/command-center"
              className="inline-flex items-center gap-3 rounded-2xl bg-[#1e40af] px-8 py-4 font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              Launch Command Center
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            {[
              {
                title: "Today",
                detail: "A clear daily flow with one reading, one reflection, one prayer, and one challenge.",
                href: "/today",
                icon: NotebookPen,
              },
              {
                title: "Real dashboard",
                detail: "Today’s study, reminders, streaks, and next steps in one home base.",
                href: "/dashboard",
                icon: TrendingUp,
              },
              {
                title: "AI studio",
                detail: "A serious generation layer for study guides, devotionals, sermons, and quizzes.",
                href: "/ai-studio",
                icon: Brain,
              },
              {
                title: "Translation compare",
                detail: "Side-by-side wording across translations for deeper study.",
                href: "/translations",
                icon: Volume2,
              },
              {
                title: "Commentary layer",
                detail: "Trusted commentary summaries alongside AI explanations.",
                href: "/commentaries",
                icon: Quote,
              },
              {
                title: "Voice mode",
                detail: "Scripture audio, spoken Bible questions, and mobile-friendly listening flows.",
                href: "/voice",
                icon: Waves,
              },
              {
                title: "Reading progress",
                detail: "Whole-Bible progress tracking, yearly goals, and book-level milestones.",
                href: "/reading-progress",
                icon: Bookmark,
              },
              {
                title: "Recommendations",
                detail: "Smarter suggestions for what to read, study, review, or pray next.",
                href: "/recommendations",
                icon: Search,
              },
              {
                title: "Images and maps",
                detail: "Visual Scripture art, map previews, and richer geography-based study.",
                href: "/images",
                icon: Shapes,
              },
              {
                title: "Bible gamification",
                detail: "XP, badges, daily quests, guided learning maps, and growth rewards.",
                href: "/gamification",
                icon: Target,
              },
              {
                title: "Fun layer",
                detail: "Surprise studies, memory battles, seasonal challenges, and shareable win cards.",
                href: "/fun",
                icon: Sparkles,
              },
              {
                title: "Verse-by-verse study",
                detail: "Slow down the study flow and explain each verse with context and application.",
                href: "/verse-by-verse",
                icon: BookOpen,
              },
              {
                title: "Certificates",
                detail: "Give guided paths and courses meaningful completion moments and rewards.",
                href: "/certificates",
                icon: CheckCircle,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <Icon className="h-6 w-6 text-[#1e40af]" />
                  <h2 className="mt-4 text-2xl font-bold text-text-primary">{item.title}</h2>
                  <p className="mt-3 text-text-secondary">{item.detail}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-text-primary">Professional Application Layer</h2>
            <p className="mt-4 text-lg text-text-secondary">
              The systems that make the product launch-ready, secure, reliable, and scalable.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Launch readiness",
                detail: "Operational checklist for billing, testing, analytics, and trust.",
                href: "/launch",
                icon: CheckCircle,
              },
              {
                title: "Permissions",
                detail: "Role-based access, team seats, moderation, and entitlements.",
                href: "/permissions",
                icon: Users,
              },
              {
                title: "Personalization",
                detail: "Make the dashboard, mentor, and recommendations adapt to the user.",
                href: "/personalization",
                icon: Sparkles,
              },
              {
                title: "Platform quality",
                detail: "Production hardening through accessibility, testing, observability, and performance.",
                href: "/quality",
                icon: TrendingUp,
              },
              {
                title: "Admin analytics",
                detail: "A portal for retention, content performance, funnel health, and operational visibility.",
                href: "/admin-analytics",
                icon: BrainCircuit,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[2rem] border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <Icon className="h-6 w-6 text-[#1e40af]" />
                  <h3 className="mt-4 text-2xl font-bold text-text-primary">{item.title}</h3>
                  <p className="mt-3 text-text-secondary">{item.detail}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-text-primary">A Richer Knowledge Base</h2>
            <p className="mt-4 text-lg text-text-secondary">
              The strongest version of this app teaches, explains, compares, and guides instead of only linking pages together.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Bible Answers",
                detail: "Big faith questions with key verses, clear summaries, and next passages to study.",
                href: "/questions",
                icon: Search,
              },
              {
                title: "Apologetics",
                detail: "Resurrection, Scripture reliability, suffering, and worldview questions with biblical grounding.",
                href: "/apologetics",
                icon: Heart,
              },
              {
                title: "Topic Paths",
                detail: "Study struggles and themes like anxiety, forgiveness, hope, prayer, and spiritual warfare.",
                href: "/topics",
                icon: Target,
              },
              {
                title: "New believer program",
                detail: "A first discipleship path for the Gospel, prayer, Scripture habits, and Christian community.",
                href: "/new-believers",
                icon: Compass,
              },
              {
                title: "Reading Plans",
                detail: "Structured plans for new believers, Gospel reading, Psalms and Proverbs, and whole-Bible goals.",
                href: "/reading-plans",
                icon: Calendar,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <Icon className="h-6 w-6 text-[#1e40af]" />
                  <h3 className="mt-4 text-2xl font-bold text-text-primary">{item.title}</h3>
                  <p className="mt-3 text-text-secondary">{item.detail}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Everything You Need to Study Smarter
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Powerful tools designed to help you engage deeply with Scripture
              and grow in your faith.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card card-elevated group">
              <div className="p-3 bg-primary rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Bible Reader
              </h3>
              <p className="text-text-secondary mb-4">
                Read God&apos;s Word in 3 translations (WEB, KJV, ASV) with beautiful
                formatting and easy navigation.
              </p>
              <Link
                href="/reading-plans"
                className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
              >
                Explore <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="card card-elevated group">
              <div className="p-3 bg-accent rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Notes & Highlights
              </h3>
              <p className="text-text-secondary mb-4">
                Capture insights, tag important verses, and build a personal
                library of spiritual discoveries.
              </p>
              <p className="text-sm text-text-muted">
                Available when you read passages
              </p>
            </div>

            <div className="card card-elevated group">
              <div className="p-3 bg-secondary rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Bookmark className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Bookmarks
              </h3>
              <p className="text-text-secondary mb-4">
                Save your favorite passages and build a collection of verses
                that speak to your heart.
              </p>
              <p className="text-sm text-text-muted">One click to save</p>
            </div>

            <div className="card card-elevated group">
              <div className="p-3 bg-orange-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Reading Streaks
              </h3>
              <p className="text-text-secondary mb-4">
                Build consistency with daily reading tracking. Watch your streak
                grow as you study God&apos;s Word.
              </p>
              <p className="text-sm text-text-muted">Motivational tracking</p>
            </div>

            <div className="card card-elevated group">
              <div className="p-3 bg-green-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Structured Plans
              </h3>
              <p className="text-text-secondary mb-4">
                Follow 8 curated reading plans: Bible in 365 days, Life of
                Jesus, Paul&apos;s Letters, and more.
              </p>
              <Link
                href="/reading-plans"
                className="text-green-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
              >
                View Plans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="card card-elevated group">
              <div className="p-3 bg-secondary rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Your Dashboard
              </h3>
              <p className="text-text-secondary mb-4">
                Track progress, view stats, manage reading plans, and see your
                spiritual growth.
              </p>
              {user ? (
                <Link
                  href="/account"
                  className="text-secondary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <p className="text-sm text-text-muted">Sign up to access</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#eef8ff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Platform Systems
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              New advanced layers for collaboration, personalization, orchestration,
              Scripture intelligence, and the systems that make the whole product compound.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/collaboration"
              className="card card-elevated group hover:-translate-y-1 transition-transform"
            >
              <Users className="h-6 w-6 text-[#1e40af] mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Collaboration
              </h3>
              <p className="text-sm text-text-secondary">
                Real-time rooms, shared prep, moderation, and church-team workflows.
              </p>
            </Link>

            <Link
              href="/personalization"
              className="card card-elevated group hover:-translate-y-1 transition-transform"
            >
              <Sparkles className="h-6 w-6 text-violet-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Personalization
              </h3>
              <p className="text-sm text-text-secondary">
                Recommendation logic shaped by habits, goals, history, and tradition.
              </p>
            </Link>

            <Link
              href="/orchestration"
              className="card card-elevated group hover:-translate-y-1 transition-transform"
            >
              <BrainCircuit className="h-6 w-6 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">
                AI Workflows
              </h3>
              <p className="text-sm text-text-secondary">
                Guided flows from study to prayer, action, follow-up, and leadership prep.
              </p>
            </Link>

            <Link
              href="/intelligence"
              className="card card-elevated group hover:-translate-y-1 transition-transform"
            >
              <Volume2 className="h-6 w-6 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Bible Intelligence
              </h3>
              <p className="text-sm text-text-secondary">
                Smarter cross-reference, theme, context, and mobile study layers.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Advanced Product Layer
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              The next stage is not just more tools. It is saved passage dashboards,
              publishing, mentor chat, permissions, mobile polish, and trust systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/passage-dashboard" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Shapes className="h-6 w-6 text-[#1e40af] mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Passage Dashboards</h3>
              <p className="text-sm text-text-secondary">
                Save the whole study workspace around a passage, not just one note.
              </p>
            </Link>
            <Link href="/publishing" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Quote className="h-6 w-6 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Publishing Flow</h3>
              <p className="text-sm text-text-secondary">
                Move leader content from draft to review, publish, and share.
              </p>
            </Link>
            <Link href="/mentor-chat" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Brain className="h-6 w-6 text-violet-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Full Mentor Chat</h3>
              <p className="text-sm text-text-secondary">
                Keep a real discipleship thread attached to passage study.
              </p>
            </Link>
            <Link href="/team-access" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Users className="h-6 w-6 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Team Access</h3>
              <p className="text-sm text-text-secondary">
                Add roles, invites, approvals, and safer collaboration for teams.
              </p>
            </Link>
            <Link href="/mobile" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Mic className="h-6 w-6 text-secondary mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Mobile Product</h3>
              <p className="text-sm text-text-secondary">
                Push installability, offline reading, audio, and notification polish.
              </p>
            </Link>
            <Link href="/trust" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <CheckCircle className="h-6 w-6 text-rose-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Trust & Ops</h3>
              <p className="text-sm text-text-secondary">
                Moderation, audit trails, testing, and observability for scale.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#eef8ff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Guided Learning Platform
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              The killer feature is a personalized Bible learning path that guides people
              through Scripture step-by-step instead of leaving them to figure out where to start.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/paths" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <BrainCircuit className="h-6 w-6 text-[#1e40af] mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Study Paths</h3>
              <p className="text-sm text-text-secondary">
                AI-built weekly journeys through theology, gospel, discipleship, and spiritual growth.
              </p>
            </Link>
            <Link href="/study-workspace" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Shapes className="h-6 w-6 text-violet-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Study Workspace</h3>
              <p className="text-sm text-text-secondary">
                A multi-panel environment for Bible text, explanation, notes, and questions.
              </p>
            </Link>
            <Link href="/quiz" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <CheckCircle className="h-6 w-6 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Quiz Mode</h3>
              <p className="text-sm text-text-secondary">
                Generate quick Bible quizzes from passages, paths, and doctrine modules.
              </p>
            </Link>
            <Link href="/courses" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Mic className="h-6 w-6 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Courses</h3>
              <p className="text-sm text-text-secondary">
                Tutor-style theology, apologetics, and doctrine learning tracks.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Guided Growth Paths
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              New tools for prayer, memory, topical study, leaders, and what is
              coming next.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link href="/topics" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Target className="h-6 w-6 text-primary mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Topic Paths</h3>
              <p className="text-sm text-text-secondary">
                Start with anxiety, prayer, hope, forgiveness, or Bible basics.
              </p>
            </Link>

            <Link href="/prayer" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <NotebookPen className="h-6 w-6 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Prayer Journal</h3>
              <p className="text-sm text-text-secondary">
                Save requests, revisit answered prayers, and track God&apos;s faithfulness.
              </p>
            </Link>

            <Link href="/memorize" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Brain className="h-6 w-6 text-violet-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Memory Mode</h3>
              <p className="text-sm text-text-secondary">
                Practice flashcards and verse prompts for consistent retention.
              </p>
            </Link>

            <Link href="/leaders" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Users className="h-6 w-6 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Leader Tools</h3>
              <p className="text-sm text-text-secondary">
                Build studies, youth lessons, sermon starters, and group plans.
              </p>
            </Link>

            <Link href="/beta" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Mic className="h-6 w-6 text-secondary mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">What&apos;s Next</h3>
              <p className="text-sm text-text-secondary">
                Preview voice mode, multilingual study, and shareable study cards.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Deeper Study Layers
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              New tools for discovery, interpretation, family discipleship, and
              long-term spiritual reflection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/search" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Search className="h-6 w-6 text-primary mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Smart Search</h3>
              <p className="text-sm text-text-secondary">
                Search by struggle, emotion, question, or spiritual goal.
              </p>
            </Link>

            <Link href="/study" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Shapes className="h-6 w-6 text-violet-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Templates & Timeline</h3>
              <p className="text-sm text-text-secondary">
                Reuse study formats and revisit your spiritual history.
              </p>
            </Link>

            <Link href="/workspace" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Users className="h-6 w-6 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Team Workspace</h3>
              <p className="text-sm text-text-secondary">
                Plan studies and share resources with church teams.
              </p>
            </Link>

            <Link href="/passage/james-1-2-4" className="card card-elevated group hover:-translate-y-1 transition-transform">
              <Volume2 className="h-6 w-6 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Audio & Family Study</h3>
              <p className="text-sm text-text-secondary">
                Use passage audio, family mode, and verse-by-verse breakdowns.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">How It Works</h2>
            <p className="text-xl text-text-secondary">
              Three simple steps to transform your Bible study experience
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-8 items-start animate-fade-in">
              <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                1
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Search className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold text-text-primary">Search or Start</h3>
                </div>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Search any Bible passage above, or join one of our structured reading plans to guide your journey.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                2
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-6 w-6 text-secondary" />
                  <h3 className="text-2xl font-bold text-text-primary">Study & Reflect</h3>
                </div>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Read Scripture, add notes and highlights, bookmark verses that resonate with you, and reflect on what God is teaching.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex-shrink-0 w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                3
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-bold text-text-primary">Track & Grow</h3>
                </div>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Build your daily reading streak, watch your progress on reading plans, and see your spiritual growth in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="h-16 w-16 text-accent mx-auto mb-8 opacity-60" />
          <p className="text-2xl md:text-3xl font-semibold text-text-primary mb-6 leading-relaxed">
            &quot;Knowing Jesus is the most important thing. This platform helps you
            study His Word deeply, stay consistent, and grow in faith, one
            passage at a time.&quot;
          </p>
          <p className="text-lg text-text-secondary">For personal study, groups, and churches</p>
        </div>
      </section>

      <section className="py-20 bg-gradient-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Deepen Your Faith?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Start your free journey through Scripture today.
          </p>

          {!user && (
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-3 btn btn-secondary text-lg px-10 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              <Heart className="h-6 w-6" />
              Start Studying for Free
              <ArrowRight className="h-6 w-6" />
            </Link>
          )}

          {user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reading-plans"
                className="btn btn-secondary px-8 py-4 shadow-lg hover:shadow-xl"
              >
                Browse Reading Plans
              </Link>
              <Link
                href="/account"
                className="btn btn-ghost px-8 py-4 border-white/30 text-white hover:bg-white/10"
              >
                View Your Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
