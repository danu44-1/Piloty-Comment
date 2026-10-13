import type { CommentStatus } from "@/lib/types/moderation";

const styles: Record<CommentStatus, string> = { Blocked: "bg-red-50 text-red-600 border-red-100", Pending: "bg-amber-50 text-amber-600 border-amber-100", Allowed: "bg-emerald-50 text-emerald-600 border-emerald-100" };
export default function StatusBadge({ status }: { status: CommentStatus }) { return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}>{status}</span>; }
