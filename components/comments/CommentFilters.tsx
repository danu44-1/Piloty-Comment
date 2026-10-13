import { commentFilters } from "@/constants/filters";
import type { CommentFilter } from "@/lib/types/moderation";

export default function CommentFilters({ active, onChange }: { active: CommentFilter; onChange: (filter: CommentFilter) => void }) { return <div className="flex flex-wrap gap-2">{commentFilters.map((filter) => <button key={filter} onClick={() => onChange(filter)} className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${active === filter ? "bg-red-600 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{filter}</button>)}</div>; }
