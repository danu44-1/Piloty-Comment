import type { ModerationRule } from "@/lib/types/moderation";

export const initialRules: ModerationRule[] = [
  { id: "spam", title: "Spam detection", description: "Detect repetitive comments and promotional spam.", enabled: true },
  { id: "links", title: "Suspicious links", description: "Flag comments containing suspicious URLs.", enabled: true },
  { id: "words", title: "Blocked keywords", description: "Block comments containing restricted words.", enabled: true },
  { id: "review", title: "Manual review", description: "Send uncertain comments for manual moderation.", enabled: true },
];
