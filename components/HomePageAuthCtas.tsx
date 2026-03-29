"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function HomePageAuthCtas({
  section,
}: {
  section: "dashboard-card" | "footer";
}) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsSignedIn(Boolean(session?.user));
      setAuthResolved(true);
    };

    void syncSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsSignedIn(Boolean(session?.user));
      setAuthResolved(true);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  if (!authResolved) {
    return null;
  }

  if (section === "dashboard-card") {
    if (isSignedIn) {
      return (
        <Link
          href="/account"
          className="text-secondary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
        >
          Go to Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      );
    }

    return <p className="text-sm text-text-muted">Sign up to access</p>;
  }

  if (isSignedIn) {
    return (
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
    );
  }

  return (
    <Link
      href="/auth/signup"
      className="inline-flex items-center gap-3 btn btn-secondary text-lg px-10 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
    >
      <Heart className="h-6 w-6" />
      Start Studying for Free
      <ArrowRight className="h-6 w-6" />
    </Link>
  );
}
