import VideoGrid from "@/components/video/VideoGrid";
import { getVideos } from "@/lib/utils/video";

export default function VideoPage() {
  const videos = getVideos();

  return (
    <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">
      <section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">Content</p>
            <h1 className="mt-2 text-xl font-bold text-slate-900">Video Library</h1>
            <p className="mt-1 text-sm text-slate-500">
              Select a video to view its details and manage its demo comments.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
            {videos.length} demo videos
          </span>
        </div>
        <VideoGrid videos={videos} />
      </section>
    </div>
  );
}
