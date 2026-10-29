"use client";

import Link from "next/link";
import { useActionState } from "react";
import { daftar } from "@/app/auth/signup/actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const kelasKolom =
	"mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-100";

export default function FormDaftar() {
	const [status, aksi, pending] = useActionState(daftar, awal);
	const galat = status.galat;

	return (
		<form action={aksi} className="mt-8 space-y-5">
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-semibold text-slate-700">
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					required
					defaultValue={status.nilai?.email ?? ""}
					className={`${kelasKolom} ${galat?.email ? "border-red-400" : ""}`}
					aria-invalid={Boolean(galat?.email)}
					aria-describedby={galat?.email ? "galat-email" : undefined}
				/>
				{galat?.email?.[0] && (
					<p id="galat-email" className="mt-2 text-sm text-red-700">
						{galat.email[0]}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="kataSandi"
					className="block text-sm font-semibold text-slate-700">
					Kata sandi
				</label>
				<input
					id="kataSandi"
					name="kataSandi"
					type="password"
					autoComplete="new-password"
					required
					minLength={8}
					className={`${kelasKolom} ${galat?.kataSandi ? "border-red-400" : ""}`}
					aria-invalid={Boolean(galat?.kataSandi)}
					aria-describedby={galat?.kataSandi ? "galat-kata-sandi" : undefined}
				/>
				{galat?.kataSandi?.[0] && (
					<p id="galat-kata-sandi" className="mt-2 text-sm text-red-700">
						{galat.kataSandi[0]}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="konfirmasiKataSandi"
					className="block text-sm font-semibold text-slate-700">
					Konfirmasi kata sandi
				</label>
				<input
					id="konfirmasiKataSandi"
					name="konfirmasiKataSandi"
					type="password"
					autoComplete="new-password"
					required
					className={`${kelasKolom} ${galat?.konfirmasiKataSandi ? "border-red-400" : ""}`}
					aria-invalid={Boolean(galat?.konfirmasiKataSandi)}
					aria-describedby={
						galat?.konfirmasiKataSandi ? "galat-konfirmasi" : undefined
					}
				/>
				{galat?.konfirmasiKataSandi?.[0] && (
					<p id="galat-konfirmasi" className="mt-2 text-sm text-red-700">
						{galat.konfirmasiKataSandi[0]}
					</p>
				)}
			</div>

			<button
				type="submit"
				disabled={pending}
				className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
				{pending ? "Membuat akun..." : "Daftar"}
			</button>

			<p
				role="status"
				aria-live="polite"
				className="min-h-5 text-center text-sm text-red-700">
				{status.pesan}
			</p>

			<p className="text-center text-sm text-slate-500">
				Sudah punya akun?{" "}
				<Link
					href="/auth/login"
					className="font-semibold text-red-600 hover:text-red-700">
					Masuk
				</Link>
			</p>
		</form>
	);
}
