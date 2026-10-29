"use client";

import { useModerationContext } from "@/components/moderation/ModerationProvider";
import { keluar } from "@/app/auth/login/actions";

export default function Header({ title, tab }: { title: string; tab: string }) {
	const { scanning, runScan } = useModerationContext();
	return (
		<header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
			<div>
				<div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
					<span>Workspace</span>
					<span>/</span>
					<span className="text-red-600">{tab}</span>
				</div>
				<h2 className="text-xl font-bold tracking-tight text-slate-900">
					{title}
				</h2>
			</div>
			<div className="flex items-center gap-3">
				<div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 sm:flex">
					<span className="h-2 w-2 rounded-full bg-emerald-500" />
					Demo mode
				</div>
				<button
					onClick={runScan}
					disabled={scanning}
					className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:opacity-60">
					{scanning ? "Scanning..." : "↻ Run scan"}
				</button>
				<form action={keluar}>
					<button
						type="submit"
						className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600">
						Keluar
					</button>
				</form>
			</div>
		</header>
	);
}
