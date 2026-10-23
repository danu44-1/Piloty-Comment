"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function VideoError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Video route error:", error);
  }, [error]);

  const showTechnicalDetails = process.env.NODE_ENV === "development";

  return (
    <main className="mx-auto flex min-h-[420px] w-full max-w-[1500px] items-center p-5 sm:p-8">
      <section
        role="alert"
        className="soft-shadow w-full rounded-2xl border border-red-100 bg-white p-6 sm:p-8"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">
          Video library
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Video content could not be loaded
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Something went wrong while opening the video area. Try again or return
          to the video library.
        </p>

        {showTechnicalDetails && (
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            Development detail: {error.message}
          </p>
        )}
        {error.digest && (
          <p className="mt-3 text-xs text-slate-400">
            Reference code: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/video"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Back to video library
          </Link>
        </div>
      </section>
    </main>
  );
}
