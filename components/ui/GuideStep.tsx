export default function GuideStep({ number, title, description }: { number: string; title: string; description: string }) {
  return <div className="flex gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xs font-bold text-red-600">{number}</div><div><h4 className="text-sm font-semibold text-slate-800">{title}</h4><p className="mt-1 text-xs leading-5 text-slate-400">{description}</p></div></div>;
}
