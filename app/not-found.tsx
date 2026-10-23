import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[420px] w-full max-w-[1500px] items-center p-5 sm:p-8">
      <section className="soft-shadow w-full rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">
          PilotyComment
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          The page you requested does not exist in PilotyComment.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Back to overview
          </Link>
          <Link
            href="/video"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Open video library
          </Link>
        </div>
      </section>
    </main>
  );
}
