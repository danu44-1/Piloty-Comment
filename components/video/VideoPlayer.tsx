import type { Video } from "@/lib/types/video";

/** Visual placeholder only; v0.1 does not stream real YouTube video data. */
export default function VideoPlayer({ video }: { video: Video }) {
  return (
    <div
      className="relative flex aspect-video max-h-[520px] items-center justify-center overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-orange-400 text-white"
      role="img"
      aria-label={`Demo preview placeholder for ${video.title}`}
    >
      <div className="absolute inset-0 bg-black/10" />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/20 text-2xl shadow-lg backdrop-blur-sm" aria-hidden="true">
        ▶
      </span>
      <span className="absolute bottom-4 left-4 rounded-full bg-black/35 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
        Demo preview · {video.duration}
      </span>
    </div>
  );
}
