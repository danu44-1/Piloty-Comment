import type { ModerationRule } from "@/lib/types/moderation";
import RuleToggle from "@/components/rules/RuleToggle";

export default function RuleItem({ rule, onToggle }: { rule: ModerationRule; onToggle: (id: string) => void }) { return <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"><div><p className="text-sm font-semibold text-slate-800">{rule.title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{rule.description}</p></div><RuleToggle rule={rule} onToggle={onToggle} /></div>; }
