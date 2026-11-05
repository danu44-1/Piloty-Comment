"""Simulasi RESTRICT + rollback memakai SQLite (PRAGMA foreign_keys=ON).
Skema meniru model User/Session pada prisma/schema.prisma."""
import sqlite3
db = sqlite3.connect(":memory:", isolation_level=None)  # autocommit; transaksi manual
db.execute("PRAGMA foreign_keys = ON")
db.executescript("""
CREATE TABLE "User"(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, salt TEXT NOT NULL, passwordHash TEXT NOT NULL);
CREATE TABLE "Session"(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL,
  expiresAt TEXT NOT NULL, FOREIGN KEY(userId) REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE);
INSERT INTO "User"(email,salt,passwordHash) VALUES ('uji@piloty.test','s','h'),('lain@piloty.test','s','h');
INSERT INTO "Session"(userId,expiresAt) VALUES (1,'2026-11-07'),(1,'2026-11-08'),(2,'2026-11-07');
""")
def hitung(label):
    u = db.execute('SELECT COUNT(*) FROM "User"').fetchone()[0]
    s = db.execute('SELECT COUNT(*) FROM "Session"').fetchone()[0]
    print(f"[{label}] users={u} sessions={s}")
print("== 0. DATA AWAL =="); hitung("awal")
print("\n== 1. HAPUS USER TANPA TRANSAKSI (RESTRICT) ==")
try:
    db.execute('DELETE FROM "User" WHERE email=?', ("uji@piloty.test",))
except sqlite3.IntegrityError as e:
    print("GALAT:", type(e).__name__, "-", e)
hitung("setelah galat")
print("\n== 2. TRANSAKSI + ROLLBACK ==")
hitung("SEBELUM")
db.execute("BEGIN")
db.execute('DELETE FROM "Session" WHERE userId=1')
db.execute('DELETE FROM "User" WHERE id=1')
hitung("DI DALAM TRANSAKSI")
db.execute("ROLLBACK")
hitung("SESUDAH ROLLBACK")
print("\n== 3. GAGAL DI TENGAH TRANSAKSI ==")
hitung("SEBELUM")
db.execute("BEGIN")
try:
    db.execute('DELETE FROM "Session" WHERE userId=1')
    db.execute('DELETE FROM "User" WHERE id=1')
    db.execute('INSERT INTO "User"(email,salt,passwordHash) VALUES (NULL,\'x\',\'x\')')
    db.execute("COMMIT")
except sqlite3.IntegrityError as e:
    print("GALAT:", e, "-> ROLLBACK")
    db.execute("ROLLBACK")
hitung("SESUDAH ROLLBACK")
print("\n== 4. HAPUS BENAR (sesi dulu, user, COMMIT) ==")
db.execute("BEGIN")
db.execute('DELETE FROM "Session" WHERE userId=1')
db.execute('DELETE FROM "User" WHERE id=1')
db.execute("COMMIT")
hitung("SESUDAH COMMIT")
