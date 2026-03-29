"use client";

import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

const AncientWorldMap = dynamic(() => import("@/components/AncientWorldMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
        <div className="h-[520px] animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
      </div>
      <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
        <Sparkles className="h-4 w-4 text-blue-700" />
        Loading the interactive Jesus-era map...
      </div>
    </div>
  ),
});

export default function BibleWorldMapSection() {
  return <AncientWorldMap />;
}
