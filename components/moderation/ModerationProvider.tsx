"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useComments } from "@/hooks/useComments";
import { useRules } from "@/hooks/useRules";
import { useModeration } from "@/hooks/useModeration";
import { useToast } from "@/hooks/useToast";
import { initialBlockedWords } from "@/lib/data/keywords";
import { isDuplicateKeyword, normalizeKeyword } from "@/lib/validation";
import type { CommentStatus } from "@/lib/types/moderation";

const ModerationContext = createContext<ReturnType<typeof useModerationState> | null>(null);

function useModerationState() {
  const commentsState = useComments();
  const rulesState = useRules();
  const moderation = useModeration();
  const toast = useToast();
  const [keywords, setKeywords] = useState(initialBlockedWords);

  const counts = useMemo(() => ({
    total: commentsState.comments.length,
    blocked: commentsState.comments.filter((c) => c.status === "Blocked").length,
    pending: commentsState.comments.filter((c) => c.status === "Pending").length,
    allowed: commentsState.comments.filter((c) => c.status === "Allowed").length,
  }), [commentsState.comments]);

  function updateComment(id: number, status: CommentStatus) {
    commentsState.updateComment(id, status);
    toast.showNotice(status === "Blocked" ? "Comment blocked successfully." : status === "Allowed" ? "Comment approved successfully." : "Comment moved to pending review.");
  }

  function addKeyword(value: string) {
    const normalized = normalizeKeyword(value);
    if (!normalized) return false;
    if (isDuplicateKeyword(keywords, normalized)) {
      toast.showNotice("This keyword already exists.");
      return false;
    }
    setKeywords((current) => [...current, normalized]);
    toast.showNotice(`Keyword "${normalized}" added.`);
    return true;
  }

  function runScan() {
    moderation.runScan(commentsState.comments, rulesState.rules, keywords, commentsState.setComments, toast.showNotice);
  }

  return {
    ...commentsState,
    ...rulesState,
    ...moderation,
    ...toast,
    counts,
    keywords,
    updateComment,
    addKeyword,
    runScan,
  };
}

export function ModerationProvider({ children }: { children: ReactNode }) {
  const value = useModerationState();
  return <ModerationContext.Provider value={value}>{children}</ModerationContext.Provider>;
}

export function useModerationContext() {
  const context = useContext(ModerationContext);
  if (!context) throw new Error("useModerationContext must be used inside ModerationProvider");
  return context;
}
