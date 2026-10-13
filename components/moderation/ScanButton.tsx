import { useModerationContext } from "@/components/moderation/ModerationProvider";

export default function ScanButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const { scanning, runScan } = useModerationContext();
  return <button onClick={runScan} disabled={scanning} className={`${fullWidth ? "w-full " : ""}rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60`}>{scanning ? "Scanning..." : "Run moderation scan"}</button>;
}
