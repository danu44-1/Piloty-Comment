-- Ubah relasi Session -> User dari ON DELETE CASCADE menjadi ON DELETE RESTRICT.
-- Akun yang masih memiliki sesi tidak boleh terhapus diam-diam; sesi harus
-- dihapus lebih dulu di dalam transaksi yang sama (lihat lib/data/account.ts).
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
