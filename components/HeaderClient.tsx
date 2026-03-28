"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { LogOut, Menu, User, X, ChevronDown, BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AuthModal = dynamic(() => import("./AuthModal"));

const primaryNavigation = [
  { name: "Today", href: "/today" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Study", href: "/study" },
  { name: "Bible", href: "/bible" },
  { name: "Paths", href: "/paths" },
  { name: "Prayer", href: "/prayer" },
  { name: "Notes", href: "/notes" },
  { name: "Community", href: "/community" },
];

const navigationGroups = [
  {
    title: "Company",
    items: [
      { name: "About Us", href: "/about" },
      { name: "Products", href: "/products" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Explore",
    items: [
      { name: "Command Center", href: "/command-center" },
      { name: "Search", href: "/search" },
      { name: "Topics", href: "/topics" },
      { name: "Theology", href: "/theology" },
      { name: "Questions", href: "/questions" },
      { name: "Maps", href: "/maps" },
      { name: "Bible World", href: "/bible-world" },
      { name: "Images", href: "/images" },
      { name: "Translations", href: "/translations" },
      { name: "Commentaries", href: "/commentaries" },
      { name: "Recommendations", href: "/recommendations" },
      { name: "Voice", href: "/voice" },
      { name: "Apologetics", href: "/apologetics" },
      { name: "Characters", href: "/characters" },
      { name: "Timeline", href: "/timeline" },
    ],
  },
  {
    title: "Learn",
    items: [
      { name: "Courses", href: "/courses" },
      { name: "New Believers", href: "/new-believers" },
      { name: "Quiz", href: "/quiz" },
      { name: "Memorize", href: "/memorize" },
      { name: "Verse by Verse", href: "/verse-by-verse" },
      { name: "Study Workspace", href: "/study-workspace" },
      { name: "Reading Plans", href: "/reading-plans" },
      { name: "Reading Progress", href: "/reading-progress" },
      { name: "Studies", href: "/studies" },
      { name: "Devotionals", href: "/devotionals" },
      { name: "Devotional Library", href: "/devotional-library" },
      { name: "Certificates", href: "/certificates" },
      { name: "Fun", href: "/fun" },
      { name: "Gamification", href: "/gamification" },
    ],
  },
  {
    title: "Build",
    items: [
      { name: "AI Studio", href: "/ai-studio" },
      { name: "Sermon", href: "/sermon" },
      { name: "Publishing", href: "/publishing" },
      { name: "Mentor Chat", href: "/mentor-chat" },
      { name: "Passage Dashboards", href: "/passage-dashboard" },
      { name: "Workspace", href: "/workspace" },
      { name: "Shared Studies", href: "/shared-studies" },
      { name: "Collections", href: "/collections" },
      { name: "Bookmarks", href: "/bookmarks" },
      { name: "Plan Builder", href: "/plan-builder" },
    ],
  },
  {
    title: "Connect",
    items: [
      { name: "Groups", href: "/groups" },
      { name: "Rooms", href: "/rooms" },
      { name: "Collaboration", href: "/collaboration" },
      { name: "Journeys", href: "/journeys" },
      { name: "Leaders", href: "/leaders" },
      { name: "Church Admin", href: "/church-admin" },
      { name: "Team Access", href: "/team-access" },
      { name: "Mobile", href: "/mobile" },
      { name: "Notifications", href: "/notifications" },
      { name: "Profile", href: "/profile" },
      { name: "Account", href: "/account" },
    ],
  },
  {
    title: "Platform",
    items: [
      { name: "Personalization", href: "/personalization" },
      { name: "AI Workflows", href: "/orchestration" },
      { name: "Intelligence", href: "/intelligence" },
      { name: "Quality", href: "/quality" },
      { name: "Trust", href: "/trust" },
      { name: "Subscriptions", href: "/subscriptions" },
      { name: "Launch", href: "/launch" },
      { name: "Permissions", href: "/permissions" },
      { name: "Admin Analytics", href: "/admin-analytics" },
    ],
  },
];

export default function HeaderClient({
  initialSignedIn,
  initialIsAdmin,
}: {
  initialSignedIn: boolean;
  initialIsAdmin: boolean;
}) {
  const [isSignedIn, setIsSignedIn] = useState(initialSignedIn);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      setIsSignedIn(Boolean(session?.user));

      if (session?.user) {
        try {
          const response = await fetch("/api/profile");
          if (response.ok) {
            const profile = (await response.json()) as { role?: string };
            setIsAdmin(profile.role === "admin" || profile.role === "super_admin");
          }
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!moreMenuRef.current?.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const adminOnlyHrefs = new Set(["/admin", "/admin-analytics", "/permissions"]);
  const visiblePrimaryNavigation = primaryNavigation.filter(
    (item) => isAdmin || !adminOnlyHrefs.has(item.href),
  );
  const visibleNavigationGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => isAdmin || !adminOnlyHrefs.has(item.href)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white shadow-sm">
              <BookOpen size={24} />
            </div>
            <div className="hidden min-w-0 sm:block">
              <h1 className="truncate text-xl font-semibold text-text-primary">
                Christian Study Guide
              </h1>
              <p className="text-xs text-text-muted">Grow in faith daily</p>
            </div>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex">
            {visiblePrimaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="whitespace-nowrap text-sm font-medium text-text-secondary transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen((current) => !current)}
                aria-expanded={moreMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-text-secondary transition-colors hover:text-primary"
              >
                More
                <ChevronDown
                  className={`h-4 w-4 transition ${moreMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {moreMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-8 w-[44rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-white p-4 shadow-xl"
                >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {visibleNavigationGroups.map((group) => (
                      <div key={group.title}>
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                          {group.title}
                        </p>
                        <div className="space-y-1">
                          {group.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-primary"
                              onClick={() => setMoreMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            {isSignedIn ? (
              <div className="hidden items-center gap-2 xl:flex">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary transition-colors hover:text-primary"
                >
                  <User size={18} />
                  <span className="font-medium">Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-error transition-colors hover:bg-error/10"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 xl:flex">
                <button
                  onClick={() => {
                    setModalMode("signin");
                    setShowModal(true);
                  }}
                  className="btn btn-ghost px-3 py-2 text-sm"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setModalMode("signup");
                    setShowModal(true);
                  }}
                  className="btn btn-primary px-3 py-2 text-sm"
                >
                  Join Free
                </button>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 transition-colors hover:bg-surface-hover lg:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="animate-slide-up border-t border-border bg-white lg:hidden">
            <div className="space-y-4 px-4 py-4">
              <nav className="space-y-4">
                <div className="space-y-2">
                  <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                    Main
                  </p>
                  {visiblePrimaryNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {visibleNavigationGroups.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                      {group.title}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>

              <div className="border-t border-border pt-4">
                {isSignedIn ? (
                  <div className="space-y-2">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={18} />
                      Account
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-error transition-colors hover:bg-error/10"
                    >
                      <LogOut size={18} />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setModalMode("signin");
                        setShowModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="btn btn-ghost w-full justify-start"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => {
                        setModalMode("signup");
                        setShowModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="btn btn-primary w-full"
                    >
                      Join Free
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialMode={modalMode}
      />
    </header>
  );
}
