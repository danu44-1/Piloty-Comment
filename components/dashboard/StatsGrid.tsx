import StatCard from "@/components/ui/StatCard";
import type { Comment } from "@/lib/types/moderation";

export default function StatsGrid({ comments }: { comments: Comment[] }) {
  const counts = { total: comments.length, blocked: comments.filter(c => c.status === "Blocked").length, pending: comments.filter(c => c.status === "Pending").length, allowed: comments.filter(c => c.status === "Allowed").length };
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total comments" value={counts.total} detail="Comments in this demo" icon="☷" color="slate" /><StatCard label="Blocked comments" value={counts.blocked} detail="Flagged by moderation" icon="⊘" color="red" /><StatCard label="Pending review" value={counts.pending} detail="Waiting for your action" icon="◷" color="amber" /><StatCard label="Approved comments" value={counts.allowed} detail="Passed moderation" icon="✓" color="green" /></div>;
}
