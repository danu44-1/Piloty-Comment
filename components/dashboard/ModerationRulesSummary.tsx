"use client";

import Link from "next/link";
import Switch from "@/components/ui/Switch";
import { useModerationContext } from "@/components/moderation/ModerationProvider";

export default function ModerationRulesSummary() {
  const { rules, toggleRule } = useModerationContext();
  return <section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><h3 className="font-bold text-slate-900">Moderation rules</h3><p className="mt-1 text-xs text-slate-400">Configure your protection system</p></div><Link href="/rules" className="text-xs font-semibold text-red-600">Configure →</Link></div><div className="space-y-4">{rules.map(rule => <div key={rule.id} className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold text-slate-700">{rule.title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{rule.description}</p></div><Switch enabled={rule.enabled} label={rule.title} onChange={() => toggleRule(rule.id)} /></div>)}</div><div className="mt-6 rounded-xl bg-slate-50 p-4"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><span className="text-red-600">✦</span>How automation works</div><p className="text-xs leading-5 text-slate-500">Enable rules, run a scan, and review the detected comments. The demo updates the comment statuses locally.</p></div></section>;
}
