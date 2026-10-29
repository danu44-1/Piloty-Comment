import type { Metadata } from "next";
import Link from "next/link";
import FormDaftar from "@/components/FormDaftar";

export const metadata: Metadata = {
  title: "Daftar | PilotyComment",
  description: "Buat akun demo PilotyComment.",
};

export default function HalamanDaftar() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-5 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl font-black text-white">
            Y
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">PilotyComment</p>
            <p className="text-xs text-slate-400">YouTube Moderator</p>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900">Buat akun</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Buat akun sementara untuk mencoba dashboard moderasi.
        </p>

        <FormDaftar />

        <Link href="/auth/login" className="mt-5 block text-center text-sm text-slate-400 hover:text-red-600">
          Kembali ke halaman masuk
        </Link>
      </section>
    </main>
  );
}
