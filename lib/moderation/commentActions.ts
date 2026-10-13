import type { Comment, CommentStatus } from "@/lib/types/moderation";

export function changeCommentStatus(comment: Comment, status: CommentStatus): Comment {
  return {
    ...comment,
    status,
    reason:
      status === "Blocked"
        ? "Blocked manually"
        : status === "Allowed"
          ? "Approved manually"
          : "Needs review",
  };
}
