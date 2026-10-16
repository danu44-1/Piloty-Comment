import type { Video } from "@/lib/types/video";

export default function VideoMeta({ video }: { video: Video }) {
  return (
    <div className="p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
          {video.category}
        </span>
        <span className="text-xs text-slate-400">Duration: {video.duration}</span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-700">
          Mock data
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{video.title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{video.description}</p>
    </div>
  );
}
