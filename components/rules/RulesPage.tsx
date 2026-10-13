"use client";

import RuleList from "@/components/rules/RuleList";
import KeywordManager from "@/components/rules/KeywordManager";
import { useModerationContext } from "@/components/moderation/ModerationProvider";

export default function RulesPage() {
  const { rules, toggleRule } = useModerationContext();
  return <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8"><div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]"><section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6"><div className="mb-6"><h3 className="font-bold text-slate-900">Protection settings</h3><p className="mt-1 text-sm text-slate-400">Enable the rules you want to apply during a scan.</p></div><RuleList rules={rules} onToggle={toggleRule} /></section><KeywordManager /></div></div>;
}
