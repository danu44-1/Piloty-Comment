"use client";

import { useModerationContext } from "@/components/moderation/ModerationProvider";

export default function ModerationToast() {
  const { notice, closeNotice } = useModerationContext();
  if (!notice) return null;
  return <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100%-40px)] items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-xl"><span className="text-red-600">●</span><span>{notice}</span><button onClick={closeNotice} aria-label="Close notification" className="ml-2 text-slate-400 hover:text-slate-700">✕</button></div>;
}
