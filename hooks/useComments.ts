"use client";

import { useMemo, useState } from "react";
import { initialComments } from "@/lib/data/comments";
import { changeCommentStatus } from "@/lib/moderation/commentActions";
import { filterComments } from "@/lib/utils/commentFilters";
import type { CommentFilter, CommentStatus } from "@/lib/types/moderation";

export function useComments() {
  const [comments, setComments] = useState(initialComments);
  const [activeFilter, setActiveFilter] = useState<CommentFilter>("All");
  const [search, setSearch] = useState("");
  const filteredComments = useMemo(() => filterComments(comments, activeFilter, search), [comments, activeFilter, search]);

  function updateComment(id: number, status: CommentStatus) {
    setComments((current) => current.map((comment) => comment.id === id ? changeCommentStatus(comment, status) : comment));
  }

  return { comments, setComments, filteredComments, activeFilter, setActiveFilter, search, setSearch, updateComment };
}
