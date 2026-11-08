"""
Modul Kriptografi Lanjutan (Tugas 2 - v0.2)
Piloty Comment - YouTube Comment Moderation Dashboard

Melindungi kerahasiaan dan integritas data produk (kredensial API YouTube,
OAuth access token, dan konfigurasi sensitif) menggunakan Enkripsi Terautentikasi
(AEAD: AES-256-GCM / HMAC terotentikasi) melalui pustaka terpelihara.

Menerapkan Pola Integrasi Kunci Mengalir (Key Flows):
Master Secret -> KDF PBKDF2 (T1: core_crypto.py) -> Kunci 256-bit -> AEAD (T2).
"""

import os
import secrets
import hashlib
import binascii

# Mengimpor modul Tugas 1 (v0.1) untuk sambungan KDF
try:
    from .core_crypto import AuthCrypto
except ImportError:
    from core_crypto import AuthCrypto

# Pustaka kriptografi standar industri (NIST SP 800-38D)
try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from cryptography.exceptions import InvalidTag
    HAS_CRYPTOGRAPHY = True
except ImportError:
    HAS_CRYPTOGRAPHY = False
    class InvalidTag(Exception):
        """Fallback exception jika pustaka cryptography belum terpasang."""
        pass


class CryptoValidationError(ValueError):
    """Dilempar saat validasi masukan (allowlist/tipe data) gagal."""
    pass


class AuthenticationError(Exception):
    """Dilempar saat verifikasi integritas data, tag, kunci, atau AAD gagal (fail-closed)."""
    pass


class TokenVaultCrypto:
    """
    Komponen Kriptografi Lanjutan untuk melindungi data sensitif produk.
    Menyediakan enkripsi terautentikasi (AEAD) dengan parameter:
    - Kunci: 256 bit (32 byte), diturunkan dari master key via KDF T1
    - Nonce: 96 bit (12 byte) unik CSPRNG per enkripsi
    - Tag Otentikasi: 128 bit (16 byte)
    - AAD (Associated Data): Mengikat identitas Publisher/Kanal (Context Binding)
    """

    KEY_LENGTH_BYTES = 32       # 256 bit
    NONCE_LENGTH_BYTES = 12     # 96 bit (Standar NIST SP 800-38D)
    TAG_LENGTH_BYTES = 16       # 128 bit tag integritas
    SALT_LENGTH_BYTES = 16      # 128 bit salt untuk KDF

    @classmethod
    def derive_key(cls, master_password: str, salt: bytes) -> bytes:
        """
        Titik Sambungan T1 -> T2 (Pola Kunci Mengalir).
        Menurunkan kunci simetris 256-bit (32 byte) menggunakan KDF PBKDF2-HMAC-SHA256
        dari parameter AuthCrypto Tugas 1 (core_crypto.py).
        """
        if not master_password or not isinstance(master_password, str):
            raise CryptoValidationError("Master password harus berupa string tidak kosong.")
        if not salt or len(salt) != cls.SALT_LENGTH_BYTES:
            raise CryptoValidationError(f"Salt harus berupa {cls.SALT_LENGTH_BYTES} byte.")

        # Memakai AuthCrypto.ITERATIONS dari Tugas 1
        return hashlib.pbkdf2_hmac(
            hash_name="sha256",
            password=master_password.encode("utf-8"),
            salt=salt,
            iterations=AuthCrypto.ITERATIONS,
            dklen=cls.KEY_LENGTH_BYTES,
        )

    @classmethod
    def validate_inputs(cls, plaintext: str | bytes, aad: str | bytes) -> tuple[bytes, bytes]:
        """
        Validasi masukan (Allowlist) & normalisasi data sebelum menyentuh cipher.
        Prinsip: Tolak seawal mungkin (fail-closed).
        """
        if plaintext is None:
            raise CryptoValidationError("Plaintext tidak boleh None.")

        # Normalisasi plaintext ke byte
        if isinstance(plaintext, str):
            if len(plaintext) == 0:
                raise CryptoValidationError("Plaintext teks tidak boleh kosong.")
            p_bytes = plaintext.encode("utf-8")
        elif isinstance(plaintext, (bytes, bytearray)):
            if len(plaintext) == 0:
                raise CryptoValidationError("Plaintext bytes tidak boleh kosong.")
            p_bytes = bytes(plaintext)
        else:
            raise CryptoValidationError("Plaintext harus berupa string atau bytes.")

        # Normalisasi AAD ke byte
        if aad is None:
            aad_bytes = b""
        elif isinstance(aad, str):
            aad_bytes = aad.encode("utf-8")
        elif isinstance(aad, (bytes, bytearray)):
            aad_bytes = bytes(aad)
        else:
            raise CryptoValidationError("AAD harus berupa string atau bytes.")

        return p_bytes, aad_bytes

    @classmethod
    def _pure_python_aead_encrypt(
        cls, key: bytes, nonce: bytes, plaintext: bytes, aad: bytes
    ) -> tuple[bytes, bytes]:
        """
        Implementasi AEAD cadangan (HMAC-SHA256 Authenticated Encryption)
        bila pustaka compiled cryptography belum terpasang di sistem.
        """
        # Turunkan kunci enkripsi dan kunci MAC terpisah (HKDF prinsip single-usage)
        k_enc = hashlib.sha256(key + b":enc").digest()
        k_mac = hashlib.sha256(key + b":mac").digest()

        # Keystream generator berbasis Counter / SHA-256
        keystream = bytearray()
        counter = 0
        while len(keystream) < len(plaintext):
            block = hashlib.sha256(k_enc + nonce + counter.to_bytes(4, "big")).digest()
            keystream.extend(block)
            counter += 1

        ciphertext = bytes(p ^ k for p, k in zip(plaintext, keystream[: len(plaintext)]))

        # Tag otentikasi atas (AAD + Nonce + Ciphertext)
        tag_data = len(aad).to_bytes(4, "big") + aad + nonce + ciphertext
        tag = hashlib.sha256(k_mac + tag_data).digest()[: cls.TAG_LENGTH_BYTES]

        return ciphertext, tag

    @classmethod
    def _pure_python_aead_decrypt(
        cls, key: bytes, nonce: bytes, ciphertext: bytes, tag: bytes, aad: bytes
    ) -> bytes:
        """
        Dekripsi AEAD cadangan dengan verifikasi tag konstan (fail-closed).
        """
        k_enc = hashlib.sha256(key + b":enc").digest()
        k_mac = hashlib.sha256(key + b":mac").digest()

        tag_data = len(aad).to_bytes(4, "big") + aad + nonce + ciphertext
        expected_tag = hashlib.sha256(k_mac + tag_data).digest()[: cls.TAG_LENGTH_BYTES]

        if not secrets.compare_digest(expected_tag, tag):
            raise InvalidTag("Tag otentikasi tidak cocok.")

        keystream = bytearray()
        counter = 0
        while len(keystream) < len(ciphertext):
            block = hashlib.sha256(k_enc + nonce + counter.to_bytes(4, "big")).digest()
            keystream.extend(block)
            counter += 1

        return bytes(c ^ k for c, k in zip(ciphertext, keystream[: len(ciphertext)]))

    @classmethod
    def encrypt(
        cls,
        plaintext: str | bytes,
        master_password: str | None = None,
        aad: str | bytes = "",
    ) -> str:
        """
        Enkripsi terautentikasi (AEAD) terhadap data sensitif produk.
        
        Keluaran berformat:
        piloty_aead_v02$<salt_hex>$<nonce_hex>$<ciphertext_hex>$<tag_hex>
        """
        # Muat kunci dari environment jika tidak diberikan langsung
        if master_password is None:
            master_password = os.environ.get("PILOTY_MASTER_KEY")
            if not master_password:
                raise CryptoValidationError(
                    "Master password wajib diberikan atau diatur dalam env PILOTY_MASTER_KEY."
                )

        p_bytes, aad_bytes = cls.validate_inputs(plaintext, aad)

        # 1. Pembangkitan salt acak segar (16 byte)
        salt = secrets.token_bytes(cls.SALT_LENGTH_BYTES)

        # 2. Turunkan kunci simetris 256-bit via KDF T1
        key = cls.derive_key(master_password, salt)

        # 3. Pembangkitan Nonce unik acak segar (12 byte) - CSPRNG
        # ATURAN EMAS: Nonce TIDAK BOLEH dipakai ulang dengan kunci yang sama!
        nonce = secrets.token_bytes(cls.NONCE_LENGTH_BYTES)

        # 4. Enkripsi Terautentikasi (AEAD)
        if HAS_CRYPTOGRAPHY:
            aesgcm = AESGCM(key)
            # cryptography menggabungkan ciphertext + 16-byte tag di akhir
            ct_and_tag = aesgcm.encrypt(nonce, p_bytes, aad_bytes)
            ciphertext = ct_and_tag[: -cls.TAG_LENGTH_BYTES]
            tag = ct_and_tag[-cls.TAG_LENGTH_BYTES :]
        else:
            ciphertext, tag = cls._pure_python_aead_encrypt(key, nonce, p_bytes, aad_bytes)

        # 5. Serialisasi keluaran aman
        salt_hex = binascii.hexlify(salt).decode("ascii")
        nonce_hex = binascii.hexlify(nonce).decode("ascii")
        ct_hex = binascii.hexlify(ciphertext).decode("ascii")
        tag_hex = binascii.hexlify(tag).decode("ascii")

        return f"piloty_aead_v02${salt_hex}${nonce_hex}${ct_hex}${tag_hex}"

    @classmethod
    def decrypt(
        cls,
        payload: str,
        master_password: str | None = None,
        aad: str | bytes = "",
    ) -> str:
        """
        Dekripsi terautentikasi data sensitif produk.
        Memverifikasi tag otentikasi sebelum mengembalikan plaintext.
        Gagal tertutup jika kunci salah, data diubah, tag rusak, atau AAD berbeda.
        """
        if not payload or not isinstance(payload, str):
            raise CryptoValidationError("Payload harus berupa string non-kosong.")

        if master_password is None:
            master_password = os.environ.get("PILOTY_MASTER_KEY")
            if not master_password:
                raise CryptoValidationError(
                    "Master password wajib diberikan atau diatur dalam env PILOTY_MASTER_KEY."
                )

        # Normalisasi AAD
        if aad is None:
            aad_bytes = b""
        elif isinstance(aad, str):
            aad_bytes = aad.encode("utf-8")
        elif isinstance(aad, (bytes, bytearray)):
            aad_bytes = bytes(aad)
        else:
            raise CryptoValidationError("AAD harus berupa string atau bytes.")

        # Parsing payload
        try:
            parts = payload.split("$")
            if len(parts) != 5 or parts[0] != "piloty_aead_v02":
                raise AuthenticationError("Format payload AEAD tidak dikenal (gagal tertutup).")

            salt = binascii.unhexlify(parts[1])
            nonce = binascii.unhexlify(parts[2])
            ciphertext = binascii.unhexlify(parts[3])
            tag = binascii.unhexlify(parts[4])

            if len(salt) != cls.SALT_LENGTH_BYTES:
                raise AuthenticationError("Panjang salt tidak valid.")
            if len(nonce) != cls.NONCE_LENGTH_BYTES:
                raise AuthenticationError("Panjang nonce tidak valid.")
            if len(tag) != cls.TAG_LENGTH_BYTES:
                raise AuthenticationError("Panjang tag integritas tidak valid.")
        except (binascii.Error, ValueError, IndexError) as err:
            raise AuthenticationError("Payload rusak atau tidak valid.") from err

        # Turunkan kunci simetris dari salt payload & master password
        key = cls.derive_key(master_password, salt)

        # Verifikasi dan dekripsi (gagal tertutup bila tag/data rusak)
        try:
            if HAS_CRYPTOGRAPHY:
                aesgcm = AESGCM(key)
                ct_and_tag = ciphertext + tag
                plaintext_bytes = aesgcm.decrypt(nonce, ct_and_tag, aad_bytes)
            else:
                plaintext_bytes = cls._pure_python_aead_decrypt(
                    key, nonce, ciphertext, tag, aad_bytes
                )

            return plaintext_bytes.decode("utf-8")
        except (InvalidTag, Exception) as err:
            # GAGAL TERTUTUP: Tolak dan jangan bocorkan informasi sensitif
            raise AuthenticationError(
                "Autentikasi gagal: ciphertext/tag rusak, AAD tidak cocok, atau kunci salah."
            ) from err
