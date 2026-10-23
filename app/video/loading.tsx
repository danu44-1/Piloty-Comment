export default function VideoLoading() {
  return (
    <main
      className="mx-auto w-full max-w-[1500px] space-y-7 p-5 sm:p-8"
      aria-busy="true"
      aria-live="polite"
    >
      <section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-3">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-44 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-8 w-28 animate-pulse rounded-full bg-slate-100" />
        </div>

        <p role="status" className="sr-only">
          Loading video library...
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white"
            >
              <div className="aspect-video animate-pulse bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
