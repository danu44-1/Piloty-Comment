import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FormMasuk from "@/components/FormMasuk";
import { bacaSesi } from "@/lib/scheme/session";

export const metadata: Metadata = {
  title: "Masuk | PilotyComment",
  description: "Masuk ke dashboard moderasi komentar.",
};

export default async function HalamanMasuk({
  searchParams,
}: {
  searchParams: Promise<{ terdaftar?: string }>;
}) {
  const sesi = await bacaSesi();
  if (sesi) redirect("/");
  const params = await searchParams;

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

        <h1 className="text-3xl font-black tracking-tight text-slate-900">Selamat datang</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Masuk untuk membuka dashboard moderasi komentar Anda.
        </p>

        <FormMasuk
          pesanAwal={
            params.terdaftar === "1"
              ? "Akun berhasil dibuat. Silakan masuk."
              : undefined
          }
        />
      </section>
    </main>
  );
}
