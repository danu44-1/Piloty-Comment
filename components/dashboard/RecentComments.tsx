"use client";

import Link from "next/link";
import CommentTable from "@/components/comments/CommentTable";
import { useModerationContext } from "@/components/moderation/ModerationProvider";

export default function RecentComments() {
  const { comments, updateComment } = useModerationContext();
  return <section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-slate-900">Recent comments</h3><p className="mt-1 text-xs text-slate-400">Review and manage incoming comments</p></div><Link href="/comments" className="text-xs font-semibold text-red-600 hover:text-red-700">View all →</Link></div><CommentTable comments={comments.slice(0, 4)} onUpdate={updateComment} /></section>;
}
