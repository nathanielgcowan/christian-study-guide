"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ProfileResponse = {
  role?: string;
};

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const check = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setSignedIn(false);
          setAllowed(false);
          return;
        }

        setSignedIn(true);

        const response = await fetch("/api/profile");
        if (!response.ok) {
          setAllowed(false);
          return;
        }

        const profile = (await response.json()) as ProfileResponse;
        setAllowed(profile.role === "admin" || profile.role === "super_admin");
      } catch {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-600">Checking admin access...</div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6">
        <div className="max-w-xl rounded-3xl border border-amber-200 bg-white p-10 shadow-sm text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-amber-700" />
          <h1 className="mt-5 text-3xl font-bold text-slate-900">Admin access required</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {signedIn
              ? "Your account is signed in, but it does not currently have an admin role."
              : "Sign in with an admin account to access this area."}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href={signedIn ? "/account" : "/auth/signin"}
              className="rounded-2xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              {signedIn ? "Open account" : "Sign in"}
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
