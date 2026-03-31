"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { LogOut, Menu, User, X, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

const primaryNavigation = [
  { name: "Home", href: "/" },
  { name: "Today", href: "/today" },
  { name: "Study", href: "/study" },
  { name: "Bible", href: "/bible" },
  { name: "Paths", href: "/paths" },
  { name: "Prayer", href: "/prayer" },
];

export default function HeaderClient() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let active = true;

    const syncAuthState = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      const signedIn = Boolean(session?.user);
      setIsSignedIn(signedIn);
      setAuthResolved(true);
    };

    void syncAuthState();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!active) {
        return;
      }

      const signedIn = Boolean(session?.user);
      setIsSignedIn(signedIn);
      setAuthResolved(true);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-4">
          <Link
            href="/"
            prefetch={false}
            className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary-dark text-white shadow-sm">
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
            {primaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                prefetch={false}
                className="whitespace-nowrap text-sm font-medium text-text-secondary transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            {authResolved && isSignedIn ? (
              <div className="hidden items-center gap-2 xl:flex">
                <Link
                  href="/account"
                  prefetch={false}
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
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain px-4 py-4">
              <div className="space-y-4 pb-4">
                <nav className="space-y-4">
                  <div className="space-y-2">
                    <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                      Main
                    </p>
                    {primaryNavigation.map((item) => (
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
                </nav>

                <div className="border-t border-border pt-4">
                  {isSignedIn ? (
                    <div className="space-y-2">
                      <Link
                        href="/account"
                        prefetch={false}
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
