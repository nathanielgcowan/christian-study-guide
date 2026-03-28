import { Loader2 } from "lucide-react";

export default function PassageLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="sticky top-0 z-40 bg-gradient-to-br from-[#1e40af] to-[#0f172a] text-white shadow-lg">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="h-9 w-56 animate-pulse rounded-lg bg-white/20" />
          <div className="mt-4 flex gap-3">
            <div className="h-10 w-44 animate-pulse rounded-lg bg-white/15" />
            <div className="h-10 w-40 animate-pulse rounded-lg bg-white/15" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
              <div className="mb-8 flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-9 w-28 animate-pulse rounded-full bg-gray-100"
                  />
                ))}
              </div>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-5 animate-pulse rounded bg-gray-100"
                    style={{ width: `${96 - index * 8}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin text-[#1e40af]" />
              Preparing study tools...
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
