import VideoCard from "@/components/video/VideoCard";
import type { Video } from "@/lib/types/video";

export default function VideoGrid({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <p className="font-semibold text-slate-700">No videos available</p>
        <p className="mt-1 text-sm text-slate-400">Videos will appear here when they are added.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => <VideoCard key={video.id} video={video} />)}
    </div>
  );
}
