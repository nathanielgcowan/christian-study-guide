export default function BibleWorldLoading() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] pb-16">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#14532d] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-4xl">
            <div className="h-9 w-52 animate-pulse rounded-full bg-white/15" />
            <div className="mt-6 h-16 max-w-3xl animate-pulse rounded-2xl bg-white/10" />
            <div className="mt-6 h-24 max-w-2xl animate-pulse rounded-2xl bg-white/10" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-6 w-6 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-7 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-20 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-[520px] animate-pulse rounded-[1.5rem] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
        </div>
      </section>
    </main>
  );
}
