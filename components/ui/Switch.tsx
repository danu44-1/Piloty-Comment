export default function Switch({ enabled, label, onChange }: { enabled: boolean; label: string; onChange: () => void }) {
  return <button type="button" aria-label={`Toggle ${label}`} aria-pressed={enabled} onClick={onChange} className="relative inline-flex h-6 w-[42px] shrink-0 items-center rounded-full transition" style={{ background: enabled ? "#dc2626" : "#cbd5e1" }}><span className="absolute left-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform" style={{ transform: enabled ? "translateX(18px)" : "translateX(0)" }} /></button>;
}
