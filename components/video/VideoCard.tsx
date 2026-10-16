import Link from "next/link";
import type { Video } from "@/lib/types/video";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
      aria-label={`View details for ${video.title}`}
    >
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-orange-400 text-5xl text-white">
        <span aria-hidden="true">▶</span>
        <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white">
          {video.duration}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600">
          Demo preview
        </span>
      </div>
      <div className="p-5">
        <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
          {video.category}
        </span>
        <h2 className="mt-3 font-bold text-slate-900 transition group-hover:text-red-600">
          {video.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{video.description}</p>
        <span className="mt-4 inline-flex text-xs font-semibold text-red-600">
          View details <span aria-hidden="true" className="ml-1">→</span>
        </span>
      </div>
    </Link>
  );
}
