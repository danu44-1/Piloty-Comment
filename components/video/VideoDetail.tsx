import Link from "next/link";
import VideoComments from "@/components/video/VideoComments";
import VideoMeta from "@/components/video/VideoMeta";
import VideoPlayer from "@/components/video/VideoPlayer";
import type { Video } from "@/lib/types/video";

export default function VideoDetail({ video }: { video: Video }) {
  return (
    <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">
      <Link
        href="/video"
        className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <span aria-hidden="true" className="mr-2">←</span> Back to video library
      </Link>

      <section className="soft-shadow overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <VideoPlayer video={video} />
        <VideoMeta video={video} />
        <div className="px-5 pb-6 sm:px-7 sm:pb-7">
          <Link
            href="/comments"
            className="inline-flex rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Manage all comments
          </Link>
        </div>
      </section>

      <VideoComments videoId={video.id} />
    </div>
  );
}
