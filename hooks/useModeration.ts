"use client";

import { useCallback, useState } from "react";
import { scanComments } from "@/lib/moderation/scanComments";
import { SCAN_DURATION_MS } from "@/constants/moderation";
import type { Comment, ModerationRule } from "@/lib/types/moderation";

export function useModeration() {
  const [scanning, setScanning] = useState(false);

  const runScan = useCallback((comments: Comment[], rules: ModerationRule[], keywords: string[], onComplete: (comments: Comment[]) => void, onNotice: (message: string) => void) => {
    if (scanning) return;
    setScanning(true);
    onNotice("Scanning comments...");
    window.setTimeout(() => {
      onComplete(scanComments(comments, rules, keywords));
      setScanning(false);
      onNotice("Scan complete. Moderation rules applied.");
    }, SCAN_DURATION_MS);
  }, [scanning]);

  return { scanning, runScan };
}
