"use client";

import { useEffect, useState } from "react";
import { initialRules } from "@/lib/data/rules";
import type { ModerationRule } from "@/lib/types/moderation";

const STORAGE_KEY = "piloty_persisted_rules";

export function useRules() {
  const [rules, setRules] = useState<ModerationRule[]>(initialRules);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRules(parsed);
        }
      }
    } catch {
      // Abaikan galat storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    } catch {
      // Abaikan galat storage
    }
  }, [rules]);

  function toggleRule(id: string) {
    setRules((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
  }

  return { rules, setRules, toggleRule };
}
