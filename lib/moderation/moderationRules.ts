import type { ModerationRule } from "@/lib/types/moderation";

export function classifyComment(text: string, rules: ModerationRule[], keywords: string[]) {
  const normalized = text.toLowerCase();
  const enabled = new Set(rules.filter((rule) => rule.enabled).map((rule) => rule.id));

  if (enabled.has("words") && keywords.some((word) => normalized.includes(word.toLowerCase()))) {
    return { blocked: true, reason: "Blocked keyword" };
  }
  if (enabled.has("links") && /https?:\/\/|bit\.ly|www\./i.test(normalized)) {
    return { blocked: true, reason: "Suspicious link" };
  }
  if (enabled.has("spam") && /(sub4sub|free gift|subscribe to my channel)/i.test(normalized)) {
    return { blocked: true, reason: "Spam detected" };
  }
  return { blocked: false, reason: "No violations" };
}
