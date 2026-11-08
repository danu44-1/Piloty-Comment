import { authorizeRoute, authorizeAction, UserRole } from "../lib/auth/rbac";
import { buatSalt, hashKataSandi, cocokKataSandi } from "../lib/utils/password";
import { performance } from "node:perf_hooks";

interface TestResult {
  id: string;
  name: string;
  role: UserRole;
  target: string;
  type: "POSITIF" | "NEGATIF";
  expectedStatus: number;
  actualStatus: number;
  passed: boolean;
  reason: string;
}

const results: TestResult[] = [];

function runRouteTest(
  id: string,
  name: string,
  role: UserRole,
  path: string,
  type: "POSITIF" | "NEGATIF",
  expectedStatus: number,
) {
  const decision = authorizeRoute(role, path);
  const passed = decision.statusCode === expectedStatus;
  results.push({
    id,
    name,
    role,
    target: path,
    type,
    expectedStatus,
    actualStatus: decision.statusCode,
    passed,
    reason: decision.reason,
  });
}

function runActionTest(
  id: string,
  name: string,
  role: UserRole,
  action: "UPDATE_EMAIL" | "UPDATE_PASSWORD" | "DELETE_ACCOUNT" | "MANAGE_RULES" | "MODERATE_COMMENT",
  type: "POSITIF" | "NEGATIF",
  expectedStatus: number,
) {
  const decision = authorizeAction(role, action);
  const passed = decision.statusCode === expectedStatus;
  results.push({
    id,
    name,
    role,
    target: `Action:${action}`,
    type,
    expectedStatus,
    actualStatus: decision.statusCode,
    passed,
    reason: decision.reason,
  });
}

console.log("================================================================================");
console.log("   UJI OTORISASI & KONTROL AKSES (RBAC) - TUGAS 2 KEAMANAN SIBER (sec-0.2)   ");
console.log("================================================================================\n");

// --- 6 SKENARIO UJI POSITIF (AKSES SAH DIIZINKAN) ---
runRouteTest("POS-01", "Admin mengakses Dashboard", "ADMIN", "/", "POSITIF", 200);
runRouteTest("POS-02", "Admin mengakses Manajemen Rules", "ADMIN", "/rules", "POSITIF", 200);
runRouteTest("POS-03", "Admin mengakses Pengaturan Akun", "ADMIN", "/settings", "POSITIF", 200);
runRouteTest("POS-04", "Moderator mengakses Dashboard", "MODERATOR", "/", "POSITIF", 200);
runRouteTest("POS-05", "Moderator mengakses Moderasi Komentar", "MODERATOR", "/comments", "POSITIF", 200);
runRouteTest("POS-06", "Pengguna Anonim membuka Halaman Login", "UNAUTHENTICATED", "/auth/login", "POSITIF", 200);

// --- 6 SKENARIO UJI NEGATIF (AKSES TIDAK SAH TERTOLAK) ---
runRouteTest("NEG-01", "Moderator dilarang akses rute Rules", "MODERATOR", "/rules", "NEGATIF", 403);
runRouteTest("NEG-02", "Moderator dilarang akses rute Settings", "MODERATOR", "/settings", "NEGATIF", 403);
runActionTest("NEG-03", "Moderator dilarang mengeksekusi Hapus Akun", "MODERATOR", "DELETE_ACCOUNT", "NEGATIF", 403);
runRouteTest("NEG-04", "Pengguna Anonim dilarang akses Dashboard", "UNAUTHENTICATED", "/", "NEGATIF", 302);
runRouteTest("NEG-05", "Pengguna Anonim dilarang akses Settings", "UNAUTHENTICATED", "/settings", "NEGATIF", 302);
runRouteTest("NEG-06", "Pengguna Anonim dilarang akses Komentar", "UNAUTHENTICATED", "/comments", "NEGATIF", 302);

// Cetak Tabel Hasil Uji Akses
console.table(
  results.map((r) => ({
    ID: r.id,
    Skenario: r.name,
    Peran: r.role,
    Tipe: r.type,
    Ekspektasi: r.expectedStatus,
    Hasil: r.actualStatus,
    Status: r.passed ? "PASSED" : "FAILED",
  })),
);

const totalPositif = results.filter((r) => r.type === "POSITIF").length;
const totalNegatif = results.filter((r) => r.type === "NEGATIF").length;
const totalPassed = results.filter((r) => r.passed).length;

console.log(`\nRingkasan Uji Akses:`);
console.log(`- Total Uji Positif : ${totalPositif}`);
console.log(`- Total Uji Negatif : ${totalNegatif}`);
console.log(`- Rasio Uji Positif : Negatif = ${totalPositif}:${totalNegatif} (SEIMBANG 50:50)`);
console.log(`- Status Keberhasilan: ${totalPassed} / ${results.length} PASSED\n`);

if (totalPositif !== totalNegatif) {
  console.error("FATAL: Rasio uji positif dan negatif tidak seimbang!");
  process.exit(1);
}

// --- VERIFIKASI PENYIMPANAN KATA SANDI (SLOW HASH FUNCTION) ---
console.log("================================================================================");
console.log("   BUKTI VERIFIKASI FUNGSI HASH LAMBAT (SCRYPT KDF - NIST SP 800-63B)          ");
console.log("================================================================================\n");

// Menggunakan data uji sintetis (tanpa kredensial nyata)
const syntheticPassword = "PasswordSintetisUji#2026";
const syntheticPasswordWrong = "PasswordSalahUji#2026";

console.log("[1] Membangkitkan CSPRNG Salt (16 byte)...");
const salt1 = buatSalt();
const salt2 = buatSalt();
console.log(`    Salt 1 (Hex): ${salt1}`);
console.log(`    Salt 2 (Hex): ${salt2}`);
console.log(`    Verifikasi Keunikan Salt: ${salt1 !== salt2 ? "BERHASIL (Unik)" : "GAGAL"}`);

console.log("\n[2] Menghitung Slow Hash dengan scrypt (keylen=64)...");
const t0 = performance.now();
const hash = hashKataSandi(syntheticPassword, salt1);
const t1 = performance.now();
const elapsedMs = (t1 - t0).toFixed(2);
console.log(`    Hash Output (Truncated 32 hex chars): ${hash.substring(0, 32)}...`);
console.log(`    Panjang Hash Total: ${hash.length} karakter heksadesimal (64 bytes)`);
console.log(`    Waktu Komputasi: ${elapsedMs} ms (Membuktikan sifat lambat/memory-hard)`);

console.log("\n[3] Menguji Verifikasi Kata Sandi:");
const validMatch = cocokKataSandi(syntheticPassword, salt1, hash);
console.log(`    - Password Benar: ${validMatch ? "DITERIMA (Valid)" : "DITOLAK"}`);

const wrongMatch = cocokKataSandi(syntheticPasswordWrong, salt1, hash);
console.log(`    - Password Salah: ${!wrongMatch ? "DITOLAK (Closed by Default)" : "LOLOS (Error)"}`);

const wrongSaltMatch = cocokKataSandi(syntheticPassword, salt2, hash);
console.log(`    - Salt Berbeda: ${!wrongSaltMatch ? "DITOLAK (Anti-Rainbow Table)" : "LOLOS (Error)"}`);

const passwordTestsPassed = salt1 !== salt2 && validMatch && !wrongMatch && !wrongSaltMatch;
console.log(`\nStatus Verifikasi Password Hash: ${passwordTestsPassed ? "SEMUA PENGUJIAN LULUS" : "GAGAL"}`);

if (!passwordTestsPassed || totalPassed !== results.length) {
  process.exit(1);
}
