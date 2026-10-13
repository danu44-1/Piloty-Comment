import Switch from "@/components/ui/Switch";
import type { ModerationRule } from "@/lib/types/moderation";

export default function RuleToggle({ rule, onToggle }: { rule: ModerationRule; onToggle: (id: string) => void }) { return <Switch enabled={rule.enabled} label={rule.title} onChange={() => onToggle(rule.id)} />; }
