import type { Comment } from "@/lib/types/moderation";

export const initialComments: Comment[] = [
  { id: 1, name: "Crypto Promo", avatar: "C", comment: "FREE GIFT! Claim your reward at bit.ly/free...", time: "2 minutes ago", status: "Blocked", reason: "Suspicious link" },
  { id: 2, name: "Alex Morgan", avatar: "A", comment: "Great explanation! This really helped me.", time: "5 minutes ago", status: "Allowed", reason: "No violations" },
  { id: 3, name: "Gaming World", avatar: "G", comment: "Subscribe to my channel!!! SUB4SUB!!!", time: "8 minutes ago", status: "Blocked", reason: "Spam detected" },
  { id: 4, name: "Sarah Lee", avatar: "S", comment: "Could you explain the second step again?", time: "12 minutes ago", status: "Pending", reason: "Needs review" },
  { id: 5, name: "Unknown User", avatar: "U", comment: "You are an idiot. This video is trash.", time: "18 minutes ago", status: "Blocked", reason: "Inappropriate language" },
];
