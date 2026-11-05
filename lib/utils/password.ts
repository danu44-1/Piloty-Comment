import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function buatSalt() {
  return randomBytes(16).toString("hex");
}

export function hashKataSandi(kataSandi: string, salt: string) {
  return scryptSync(kataSandi, salt, 64).toString("hex");
}

export function cocokKataSandi(
  kataSandi: string,
  salt: string,
  hashTersimpan: string,
) {
  const hashMasukan = Buffer.from(hashKataSandi(kataSandi, salt), "hex");
  const hashDatabase = Buffer.from(hashTersimpan, "hex");

  return (
    hashMasukan.length === hashDatabase.length &&
    timingSafeEqual(hashMasukan, hashDatabase)
  );
}
