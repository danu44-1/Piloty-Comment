import type { Comment, CommentStatus } from "@/lib/types/moderation";
import CommentRow from "@/components/comments/CommentRow";

export default function CommentTable({ comments, onUpdate }: { comments: Comment[]; onUpdate: (id: number, status: CommentStatus) => void }) {
  return <div className="w-full overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead><tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400"><th className="pb-4 font-semibold">User / Comment</th><th className="pb-4 font-semibold">Reason</th><th className="pb-4 font-semibold">Status</th><th className="pb-4 text-right font-semibold">Action</th></tr></thead><tbody>{comments.map((comment) => <CommentRow key={comment.id} comment={comment} onUpdate={onUpdate} />)}</tbody></table></div>;
}
