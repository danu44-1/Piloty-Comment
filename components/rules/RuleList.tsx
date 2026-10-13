import type { ModerationRule } from "@/lib/types/moderation";
import RuleItem from "@/components/rules/RuleItem";

export default function RuleList({ rules, onToggle }: { rules: ModerationRule[]; onToggle: (id: string) => void }) { return <div className="space-y-5">{rules.map((rule) => <RuleItem key={rule.id} rule={rule} onToggle={onToggle} />)}</div>; }
