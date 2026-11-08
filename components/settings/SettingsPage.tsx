"use client";

import { useActionState, useState } from "react";
import type { AkunPublik } from "@/lib/data/account";
import type { Sesi, InfoSesi } from "@/lib/scheme/session";
import type { StatusForm } from "@/lib/status-form";
import {
  perbaruiEmail,
  perbaruiKataSandi,
  perpanjangSesiAction,
  hapusAkunPengguna,
  akhiriSesiTertentuAction,
} from "@/app/settings/actions";

const awal: StatusForm = {};
const inputClass =
  "mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-100";

export default function SettingsPage({
  akun,
  sesiAktif,
  daftarSesi,
}: {
  akun: AkunPublik | null;
  sesiAktif: Sesi;
  daftarSesi: InfoSesi[];
}) {
  const [statusEmail, aksiEmail, pendingEmail] = useActionState(perbaruiEmail, awal);
  const [statusSandi, aksiSandi, pendingSandi] = useActionState(perbaruiKataSandi, awal);
  const [statusHapus, aksiHapus, pendingHapus] = useActionState(hapusAkunPengguna, awal);

  const [pesanSesi, setPesanSesi] = useState<string | null>(null);
  const [pendingPerpanjang, setPendingPerpanjang] = useState(false);

  async function handlePerpanjangSesi() {
    setPesanSesi(null);
    setPendingPerpanjang(true);
    try {
      const res = await perpanjangSesiAction();
      if (res.pesan) {
        setPesanSesi(res.pesan);
      }
    } finally {
      setPendingPerpanjang(false);
    }
  }

  const galatEmail = statusEmail.galat;
  const galatSandi = statusSandi.galat;
  const galatHapus = statusHapus.galat;

  const tglDibuat = akun?.createdAt ? new Date(akun.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) : "-";

  const tglDiperbarui = akun?.updatedAt ? new Date(akun.updatedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) : "-";

  const tglKedaluwarsa = sesiAktif.kedaluwarsa ? new Date(sesiAktif.kedaluwarsa).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) : "-";

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-5 sm:p-8">
      {/* Overview Profil Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 text-2xl font-bold text-white shadow-md shadow-red-100">
              {akun?.email?.charAt(0).toUpperCase() || "P"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{akun?.email || sesiAktif.email}</h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-200">
                  Publisher Terverifikasi
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400 font-mono">
                UUID: {akun?.uuid || sesiAktif.uuid || "N/A"}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-400">Akun Dibuat</p>
            <p className="text-xs font-semibold text-slate-700">{tglDibuat}</p>
            <p className="mt-1 text-xs text-slate-400">Pembaruan Terakhir</p>
            <p className="text-xs font-semibold text-slate-700">{tglDiperbarui}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
        {/* Form 1: Ubah Email (CRUD User - Update) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">Ubah Alamat Email</h3>
            <p className="mt-1 text-xs text-slate-400">
              Perbarui alamat email akun Anda. Memerlukan verifikasi kata sandi saat ini.
            </p>
          </div>

          {statusEmail.sukses && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700">
              ✓ {statusEmail.pesan}
            </div>
          )}

          <form action={aksiEmail} className="space-y-4">
            <div>
              <label htmlFor="emailBaru" className="block text-xs font-semibold text-slate-700">
                Alamat Email Baru
              </label>
              <input
                id="emailBaru"
                name="emailBaru"
                type="email"
                defaultValue={statusEmail.nilai?.emailBaru ?? ""}
                placeholder="nama@domain.com"
                required
                className={`${inputClass} ${galatEmail?.emailBaru ? "border-red-400 focus:border-red-400" : ""}`}
                aria-invalid={Boolean(galatEmail?.emailBaru)}
                aria-describedby={galatEmail?.emailBaru ? "galat-email-baru" : undefined}
              />
              {galatEmail?.emailBaru?.[0] && (
                <p id="galat-email-baru" className="mt-1 text-xs text-red-600">
                  {galatEmail.emailBaru[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="kataSandiSaatIniEmail" className="block text-xs font-semibold text-slate-700">
                Kata Sandi Saat Ini (Verifikasi Keamanan)
              </label>
              <input
                id="kataSandiSaatIniEmail"
                name="kataSandiSaatIni"
                type="password"
                placeholder="••••••••"
                required
                className={`${inputClass} ${galatEmail?.kataSandiSaatIni ? "border-red-400 focus:border-red-400" : ""}`}
                aria-invalid={Boolean(galatEmail?.kataSandiSaatIni)}
                aria-describedby={galatEmail?.kataSandiSaatIni ? "galat-sandi-email" : undefined}
              />
              {galatEmail?.kataSandiSaatIni?.[0] && (
                <p id="galat-sandi-email" className="mt-1 text-xs text-red-600">
                  {galatEmail.kataSandiSaatIni[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pendingEmail}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              {pendingEmail ? "Menyimpan..." : "Simpan Perubahan Email"}
            </button>
          </form>
        </section>

        {/* Form 2: Ubah Kata Sandi (CRUD User - Update) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">Ubah Kata Sandi</h3>
            <p className="mt-1 text-xs text-slate-400">
              Kata sandi di-hash menggunakan algoritma KDF <code className="font-mono text-red-600">scrypt</code> dengan salt acak 16 byte.
            </p>
          </div>

          {statusSandi.sukses && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700">
              ✓ {statusSandi.pesan}
            </div>
          )}

          <form action={aksiSandi} className="space-y-4">
            <div>
              <label htmlFor="kataSandiLama" className="block text-xs font-semibold text-slate-700">
                Kata Sandi Lama
              </label>
              <input
                id="kataSandiLama"
                name="kataSandiLama"
                type="password"
                placeholder="••••••••"
                required
                className={`${inputClass} ${galatSandi?.kataSandiLama ? "border-red-400" : ""}`}
                aria-invalid={Boolean(galatSandi?.kataSandiLama)}
                aria-describedby={galatSandi?.kataSandiLama ? "galat-sandi-lama" : undefined}
              />
              {galatSandi?.kataSandiLama?.[0] && (
                <p id="galat-sandi-lama" className="mt-1 text-xs text-red-600">
                  {galatSandi.kataSandiLama[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="kataSandiBaru" className="block text-xs font-semibold text-slate-700">
                  Kata Sandi Baru (min. 8 karakter)
                </label>
                <input
                  id="kataSandiBaru"
                  name="kataSandiBaru"
                  type="password"
                  placeholder="••••••••"
                  required
                  className={`${inputClass} ${galatSandi?.kataSandiBaru ? "border-red-400" : ""}`}
                  aria-invalid={Boolean(galatSandi?.kataSandiBaru)}
                  aria-describedby={galatSandi?.kataSandiBaru ? "galat-sandi-baru" : undefined}
                />
                {galatSandi?.kataSandiBaru?.[0] && (
                  <p id="galat-sandi-baru" className="mt-1 text-xs text-red-600">
                    {galatSandi.kataSandiBaru[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="konfirmasiKataSandiBaru" className="block text-xs font-semibold text-slate-700">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  id="konfirmasiKataSandiBaru"
                  name="konfirmasiKataSandiBaru"
                  type="password"
                  placeholder="••••••••"
                  required
                  className={`${inputClass} ${galatSandi?.konfirmasiKataSandiBaru ? "border-red-400" : ""}`}
                  aria-invalid={Boolean(galatSandi?.konfirmasiKataSandiBaru)}
                  aria-describedby={galatSandi?.konfirmasiKataSandiBaru ? "galat-konfirm-baru" : undefined}
                />
                {galatSandi?.konfirmasiKataSandiBaru?.[0] && (
                  <p id="galat-konfirm-baru" className="mt-1 text-xs text-red-600">
                    {galatSandi.konfirmasiKataSandiBaru[0]}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={pendingSandi}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              {pendingSandi ? "Memperbarui..." : "Perbarui Kata Sandi"}
            </button>
          </form>
        </section>
      </div>

      {/* Sesi & Relasi Data: CRUD Session (Read, Update, Delete) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-slate-900">Manajemen Sesi Autentikasi (Entitas Session)</h3>
            <p className="mt-1 text-xs text-slate-400">
              Mengelola relasi <code className="font-mono text-red-600">User 1 — * Session</code> pada PostgreSQL dengan token UUID acak CSPRNG.
            </p>
          </div>
          <button
            onClick={handlePerpanjangSesi}
            disabled={pendingPerpanjang}
            className="self-start rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60 sm:self-auto"
          >
            {pendingPerpanjang ? "Memperbarui Sesi..." : "↻ Perpanjang Masa Aktif Sesi (+8 Jam)"}
          </button>
        </div>

        {pesanSesi && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
            ✓ {pesanSesi}
          </div>
        )}

        <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-semibold text-slate-600">Sesi Aktif Saat Ini: </span>
              <span className="font-mono text-slate-800">{sesiAktif.uuid || "Aktif"}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Batas Kedaluwarsa: </span>
              <span className="font-medium text-slate-800">{tglKedaluwarsa}</span>
            </div>
          </div>
        </div>

        {/* Tabel Relasi Sesi (Read & Delete Session) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="pb-3 font-semibold">ID</th>
                <th className="pb-3 font-semibold">UUID Sesi</th>
                <th className="pb-3 font-semibold">Waktu Dibuat</th>
                <th className="pb-3 font-semibold">Kedaluwarsa</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {daftarSesi.map((s) => {
                const adalahSesiSekarang = s.uuid === sesiAktif.uuid;
                const kedaluwarsaStr = new Date(s.expiresAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const dibuatStr = new Date(s.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="py-3 font-mono font-medium text-slate-700">{s.id}</td>
                    <td className="py-3 font-mono text-slate-500">{s.uuid.slice(0, 18)}...</td>
                    <td className="py-3 text-slate-500">{dibuatStr}</td>
                    <td className="py-3 text-slate-500">{kedaluwarsaStr}</td>
                    <td className="py-3">
                      {adalahSesiSekarang ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-700">
                          Sesi Ini
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600">
                          Sesi Lain
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <form action={akhiriSesiTertentuAction} className="inline">
                        <input type="hidden" name="sessionId" value={s.id} />
                        <button
                          type="submit"
                          className="font-medium text-red-600 transition hover:text-red-700 hover:underline"
                        >
                          {adalahSesiSekarang ? "Keluar" : "Akhiri"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Zona Bahaya: Hapus Akun Pengguna (CRUD User - Delete via Transaksi Atomik) */}
      <section className="rounded-2xl border border-red-200 bg-red-50/40 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="font-bold text-red-900">Zona Bahaya: Hapus Akun Pengguna</h3>
          <p className="mt-1 text-xs text-red-700 leading-relaxed">
            Menghapus akun Anda akan memicu penghapusan atomik dalam transaksi database PostgreSQL (<code className="font-mono font-semibold">$transaction</code>).
            Seluruh data sesi terkait akan dibersihkan terlebih dahulu untuk memenuhi aturan integritas referensial <code className="font-mono font-semibold">onDelete: Restrict</code>.
          </p>
        </div>

        <form action={aksiHapus} className="mt-5 space-y-4 max-w-xl">
          <div>
            <label htmlFor="kataSandiKonfirmasi" className="block text-xs font-semibold text-slate-700">
              Konfirmasi Kata Sandi Anda
            </label>
            <input
              id="kataSandiKonfirmasi"
              name="kataSandiKonfirmasi"
              type="password"
              placeholder="••••••••"
              required
              className={`${inputClass} ${galatHapus?.kataSandiKonfirmasi ? "border-red-400" : ""}`}
              aria-invalid={Boolean(galatHapus?.kataSandiKonfirmasi)}
              aria-describedby={galatHapus?.kataSandiKonfirmasi ? "galat-sandi-hapus" : undefined}
            />
            {galatHapus?.kataSandiKonfirmasi?.[0] && (
              <p id="galat-sandi-hapus" className="mt-1 text-xs text-red-600">
                {galatHapus.kataSandiKonfirmasi[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="teksKonfirmasi" className="block text-xs font-semibold text-slate-700">
              Ketik <span className="font-mono font-bold text-red-700">HAPUS AKUN</span> untuk mengonfirmasi:
            </label>
            <input
              id="teksKonfirmasi"
              name="teksKonfirmasi"
              type="text"
              placeholder="HAPUS AKUN"
              required
              className={`${inputClass} ${galatHapus?.teksKonfirmasi ? "border-red-400" : ""}`}
              aria-invalid={Boolean(galatHapus?.teksKonfirmasi)}
              aria-describedby={galatHapus?.teksKonfirmasi ? "galat-teks-hapus" : undefined}
            />
            {galatHapus?.teksKonfirmasi?.[0] && (
              <p id="galat-teks-hapus" className="mt-1 text-xs text-red-600">
                {galatHapus.teksKonfirmasi[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={pendingHapus}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-200 transition hover:bg-red-700 disabled:opacity-60"
          >
            {pendingHapus ? "Menghapus Akun..." : "Hapus Akun dan Semua Sesi Terkait"}
          </button>
        </form>
      </section>
    </div>
  );
}
