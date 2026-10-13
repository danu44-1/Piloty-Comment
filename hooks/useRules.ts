"use client";

import { useState } from "react";
import { initialRules } from "@/lib/data/rules";

export function useRules() {
  const [rules, setRules] = useState(initialRules);
  function toggleRule(id: string) {
    setRules((current) => current.map((rule) => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule));
  }
  return { rules, setRules, toggleRule };
}
