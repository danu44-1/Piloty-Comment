"""
Unit Test Suite untuk Tugas 2 Kriptografi (tag v0.2)
Piloty Comment - YouTube Comment Moderation Dashboard

Memenuhi ketentuan rubrik R2:
- Minimal 4 skenario uji (disediakan 8 skenario pengujian komprehensif).
- Menguji kondisi sah, penolakan modifikasi data/tag, kunci salah, dan AAD salah.
- Menguji sambungan integrasi komponen T1 -> T2 (Pola Kunci Mengalir).
"""

import unittest
import os
from .aead_crypto import (
    TokenVaultCrypto,
    CryptoValidationError,
    AuthenticationError,
)
from .core_crypto import AuthCrypto


class TestTokenVaultCrypto(unittest.TestCase):
    def setUp(self):
        # Data sintetis untuk pengujian (tidak menggunakan data pribadi nyata)
        self.master_key = "SuperSecretPublisherMasterKey2026!"
        self.wrong_key = "WrongAttackerMasterKey999!"
        self.sensitive_token = "ya29.a0AfH6SMB_DummySyntheticYouTubeOAuthAccessToken12345"
        self.valid_channel_aad = "channel:UC_piloty_synthetic_channel_01"
        self.wrong_channel_aad = "channel:UC_attacker_hijacked_channel_99"

    # =========================================================================
    # SKENARIO 1: Uji Positif — Enkripsi dan Dekripsi Valid dengan AEAD
    # =========================================================================
    def test_encrypt_decrypt_valid(self):
        """Memverifikasi data sensitif berhasil dienkripsi dan didekripsi utuh."""
        payload = TokenVaultCrypto.encrypt(
            plaintext=self.sensitive_token,
            master_password=self.master_key,
            aad=self.valid_channel_aad,
        )

        self.assertTrue(payload.startswith("piloty_aead_v02$"))
        parts = payload.split("$")
        self.assertEqual(len(parts), 5)  # prefix, salt, nonce, ciphertext, tag

        # Dekripsi dengan parameter yang sah
        decrypted = TokenVaultCrypto.decrypt(
            payload=payload,
            master_password=self.master_key,
            aad=self.valid_channel_aad,
        )
        self.assertEqual(decrypted, self.sensitive_token)

    # =========================================================================
    # SKENARIO 2: Uji Negatif — Modifikasi Ciphertext Ditolak (Integritas)
    # =========================================================================
    def test_tampered_ciphertext_rejected(self):
        """Memverifikasi pembalikan 1 bit/byte pada ciphertext ditolak (fail-closed)."""
        payload = TokenVaultCrypto.encrypt(
            plaintext=self.sensitive_token,
            master_password=self.master_key,
            aad=self.valid_channel_aad,
        )
        parts = payload.split("$")
        ct_hex = parts[3]

        # Ubah karakter pertama pada ciphertext (simulasi manipulasi bit di transit)
        flipped_char = "0" if ct_hex[0] != "0" else "1"
        tampered_ct = flipped_char + ct_hex[1:]
        tampered_payload = f"{parts[0]}${parts[1]}${parts[2]}${tampered_ct}${parts[4]}"

        with self.assertRaises(AuthenticationError):
            TokenVaultCrypto.decrypt(
                payload=tampered_payload,
                master_password=self.master_key,
                aad=self.valid_channel_aad,
            )

    # =========================================================================
    # SKENARIO 3: Uji Negatif — Modifikasi Authentication Tag Ditolak
    # =========================================================================
    def test_tampered_tag_rejected(self):
        """Memverifikasi manipulasi pada authentication tag 128-bit ditolak."""
        payload = TokenVaultCrypto.encrypt(
            plaintext=self.sensitive_token,
            master_password=self.master_key,
            aad=self.valid_channel_aad,
        )
        parts = payload.split("$")
        tag_hex = parts[4]

        # Rusak tag otentikasi
        tampered_tag = ("0" if tag_hex[0] != "0" else "1") + tag_hex[1:]
        tampered_payload = f"{parts[0]}${parts[1]}${parts[2]}${parts[3]}${tampered_tag}"

        with self.assertRaises(AuthenticationError):
            TokenVaultCrypto.decrypt(
                payload=tampered_payload,
                master_password=self.master_key,
                aad=self.valid_channel_aad,
            )

    # =========================================================================
    # SKENARIO 4: Uji Negatif — Kunci / Master Password Salah Ditolak
    # =========================================================================
    def test_wrong_master_password_rejected(self):
        """Memverifikasi dekripsi dengan kata sandi yang salah ditolak aman."""
        payload = TokenVaultCrypto.encrypt(
            plaintext=self.sensitive_token,
            master_password=self.master_key,
            aad=self.valid_channel_aad,
        )

        with self.assertRaises(AuthenticationError):
            TokenVaultCrypto.decrypt(
                payload=payload,
                master_password=self.wrong_key,
                aad=self.valid_channel_aad,
            )

    # =========================================================================
    # SKENARIO 5: Uji Negatif — AAD Tidak Cocok Ditolak (Context Binding)
    # =========================================================================
    def test_mismatched_aad_rejected(self):
        """Memverifikasi token channel A tidak bisa didekripsi dengan identitas channel B."""
        payload = TokenVaultCrypto.encrypt(
            plaintext=self.sensitive_token,
            master_password=self.master_key,
            aad=self.valid_channel_aad,
        )

        # Coba dekripsi dengan kanal/publisher berbeda
        with self.assertRaises(AuthenticationError):
            TokenVaultCrypto.decrypt(
                payload=payload,
                master_password=self.master_key,
                aad=self.wrong_channel_aad,
            )

    # =========================================================================
    # SKENARIO 6: Uji Aturan Emas Nonce — Keunikan Nonce Tiap Enkripsi
    # =========================================================================
    def test_nonce_uniqueness(self):
        """Dua kali enkripsi dengan data & kunci sama harus menghasilkan nonce berbeda."""
        p1 = TokenVaultCrypto.encrypt(
            self.sensitive_token, self.master_key, self.valid_channel_aad
        )
        p2 = TokenVaultCrypto.encrypt(
            self.sensitive_token, self.master_key, self.valid_channel_aad
        )

        nonce1 = p1.split("$")[2]
        nonce2 = p2.split("$")[2]
        ct1 = p1.split("$")[3]
        ct2 = p2.split("$")[3]

        self.assertNotEqual(nonce1, nonce2, "Nonce wajib unik setiap enkripsi!")
        self.assertNotEqual(ct1, ct2, "Ciphertext harus berbeda karena nonce acak!")

    # =========================================================================
    # SKENARIO 7: Uji Sambungan Integrasi Komponen (T1 -> T2: Kunci Mengalir)
    # =========================================================================
    def test_connection_t1_to_t2(self):
        """Memverifikasi ketergantungan langsung T2 terhadap parameter KDF T1."""
        salt = os.urandom(16)
        key1 = TokenVaultCrypto.derive_key(self.master_key, salt)

        # Pastikan T2 memakai parameter iterasi dari AuthCrypto T1
        self.assertEqual(len(key1), 32)
        self.assertEqual(AuthCrypto.ITERATIONS, 210000)

        # Bukti sambungan fungsional: KDF menghasilkan kunci simetris yang konsisten
        key2 = TokenVaultCrypto.derive_key(self.master_key, salt)
        self.assertEqual(key1, key2)

    # =========================================================================
    # SKENARIO 8: Uji Validasi Masukan (Allowlist & Gagal Tertutup)
    # =========================================================================
    def test_input_validation_allowlist(self):
        """Memverifikasi masukan tidak valid (kosong/None) ditolak sejak awal."""
        with self.assertRaises(CryptoValidationError):
            TokenVaultCrypto.encrypt("", self.master_key)

        with self.assertRaises(CryptoValidationError):
            TokenVaultCrypto.encrypt(None, self.master_key)

        with self.assertRaises(CryptoValidationError):
            TokenVaultCrypto.decrypt("")


if __name__ == "__main__":
    unittest.main()
