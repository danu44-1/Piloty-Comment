"use client";

import { useMemo } from "react";
import CommentTable from "@/components/comments/CommentTable";
import CommentSearch from "@/components/comments/CommentSearch";
import CommentFilters from "@/components/comments/CommentFilters";
import EmptyState from "@/components/ui/EmptyState";
import { useModerationContext } from "@/components/moderation/ModerationProvider";

export default function CommentsPage({ videoId }: { videoId?: string }) {
  const {
    filteredComments,
    activeFilter,
    setActiveFilter,
    search,
    setSearch,
    updateComment,
  } = useModerationContext();

  const visibleComments = useMemo(
    () => videoId
      ? filteredComments.filter((comment) => comment.videoId === videoId)
      : filteredComments,
    [filteredComments, videoId],
  );

  return (
    <div className={videoId ? "" : "mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8"}>
      <section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-slate-900">
              {videoId ? "Comments for this video" : "All comments"}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Search, filter, and manage {videoId ? "comments linked to this demo video" : "all comments"}.
            </p>
          </div>
          <CommentSearch value={search} onChange={setSearch} />
        </div>
        <div className="mb-5">
          <CommentFilters active={activeFilter} onChange={setActiveFilter} />
        </div>
        <CommentTable comments={visibleComments} onUpdate={updateComment} />
        {visibleComments.length === 0 && (
          <EmptyState message={videoId ? "No comments match this video and filter." : "No comments found."} />
        )}
      </section>
    </div>
  );
}
