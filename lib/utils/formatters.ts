import type { Comment } from "@/lib/types/moderation";

export function getCommentCounts(comments: Comment[]) {
  return {
    total: comments.length,
    blocked: comments.filter((comment) => comment.status === "Blocked").length,
    pending: comments.filter((comment) => comment.status === "Pending").length,
    allowed: comments.filter((comment) => comment.status === "Allowed").length,
  };
}
