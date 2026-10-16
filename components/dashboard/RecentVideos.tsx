import Link from "next/link";
import { getFeaturedVideos } from "@/lib/utils/video";

export default function RecentVideos() {
  const videos = getFeaturedVideos(2);

  return (
    <section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">Videos</h3>
          <p className="mt-1 text-xs text-slate-400">Open a video and review its comments</p>
        </div>
        <Link href="/video" className="shrink-0 text-xs font-semibold text-red-600 hover:text-red-700">
          View library →
        </Link>
      </div>
      <div className="space-y-3">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-red-200 hover:bg-red-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-400 text-lg text-white" aria-hidden="true">▶</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-800">{video.title}</span>
              <span className="mt-1 block text-xs text-slate-400">{video.category} · {video.duration}</span>
            </span>
            <span className="text-slate-400" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
