import { classifyComment } from "@/lib/moderation/moderationRules";
import type { Comment, ModerationRule } from "@/lib/types/moderation";

export function scanComments(comments: Comment[], rules: ModerationRule[], keywords: string[]) {
  return comments.map((comment) => {
    if (comment.status === "Blocked") return comment;
    const result = classifyComment(comment.comment, rules, keywords);
    return result.blocked
      ? { ...comment, status: "Blocked" as const, reason: result.reason }
      : comment;
  });
}
