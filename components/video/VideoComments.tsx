import CommentsPage from "@/components/comments/CommentsPage";

export default function VideoComments({ videoId }: { videoId: string }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Video comments</h2>
        <p className="mt-1 text-sm text-slate-500">
          Review comments associated with this video using the existing moderation controls.
        </p>
      </div>
      <CommentsPage videoId={videoId} />
    </section>
  );
}
