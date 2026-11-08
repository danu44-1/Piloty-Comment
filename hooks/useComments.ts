"use client";

import { useEffect, useMemo, useState } from "react";
import { initialComments } from "@/lib/data/comments";
import { changeCommentStatus } from "@/lib/moderation/commentActions";
import { filterComments } from "@/lib/utils/commentFilters";
import type { Comment, CommentFilter, CommentStatus } from "@/lib/types/moderation";

const STORAGE_KEY = "piloty_persisted_comments";

export function useComments() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [activeFilter, setActiveFilter] = useState<CommentFilter>("All");
  const [search, setSearch] = useState("");

  // Muat data komentar dari localStorage saat mount di klien
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setComments(parsed);
        }
      }
    } catch {
      // Abaikan galat storage
    }
  }, []);

  // Simpan data komentar setiap kali terjadi pembaruan status
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // Abaikan galat storage
    }
  }, [comments]);

  const filteredComments = useMemo(
    () => filterComments(comments, activeFilter, search),
    [comments, activeFilter, search],
  );

  function updateComment(id: number, status: CommentStatus) {
    setComments((current) =>
      current.map((comment) =>
        comment.id === id ? changeCommentStatus(comment, status) : comment,
      ),
    );
  }

  return {
    comments,
    setComments,
    filteredComments,
    activeFilter,
    setActiveFilter,
    search,
    setSearch,
    updateComment,
  };
}
