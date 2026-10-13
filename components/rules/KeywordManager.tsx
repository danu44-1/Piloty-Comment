"use client";

import { FormEvent, useState } from "react";
import ScanButton from "@/components/moderation/ScanButton";
import { useModerationContext } from "@/components/moderation/ModerationProvider";

export default function KeywordManager() {
  const { keywords, addKeyword } = useModerationContext();
  const [input, setInput] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (addKeyword(input)) setInput(""); }
  return <section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6"><div className="mb-5"><h3 className="font-bold text-slate-900">Blocked keywords</h3><p className="mt-1 text-sm leading-6 text-slate-400">Comments containing these words will be blocked when the keyword rule is enabled.</p></div><div className="mb-4 flex flex-wrap gap-2">{keywords.map((word) => <span key={word} className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{word}</span>)}</div><form onSubmit={submit} className="flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Add keyword..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-red-400" /><button type="submit" className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">Add</button></form><div className="mt-5"><ScanButton fullWidth /></div><p className="mt-3 text-xs leading-5 text-slate-400">This demo uses local sample data. No YouTube comments are modified.</p></section>;
}
