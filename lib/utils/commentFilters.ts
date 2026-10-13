import type { Comment, CommentFilter } from "@/lib/types/moderation";

export function filterComments(comments: Comment[], filter: CommentFilter, search: string) {
  const query = search.trim().toLowerCase();
  return comments.filter((comment) => {
    const statusMatch = filter === "All" || comment.status === filter;
    const searchMatch = !query || comment.name.toLowerCase().includes(query) || comment.comment.toLowerCase().includes(query);
    return statusMatch && searchMatch;
  });
}
