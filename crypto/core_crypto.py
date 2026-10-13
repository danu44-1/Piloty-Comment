import os
import secrets
import hashlib
import binascii

class AuthCrypto:
    """
    Komponen kriptografi dasar untuk Piloty Comment.
    Menangani pembuatan dan verifikasi hash kata sandi menggunakan KDF yang aman (PBKDF2).
    Tidak menggunakan sandi klasik dan menggunakan CSPRNG untuk salt.
    """
    
    # Konfigurasi keamanan
    ALGORITHM = 'sha256'
    ITERATIONS = 210000  # Standar OWASP yang disarankan untuk PBKDF2-HMAC-SHA256
    SALT_LENGTH = 16     # 16 bytes = 128 bits

    @classmethod
    def hash_password(cls, password: str) -> str:
        """
        Melakukan hashing pada password plaintext dengan salt acak yang aman.
        
        Masukan: password (string)
        Keluaran: string dengan format 'algorithm:iterations$salt_hex$hash_hex'
        """
        if not password or not isinstance(password, str):
            raise ValueError("Kata sandi harus berupa teks dan tidak boleh kosong.")

        # Pembangkitan nilai acak menggunakan CSPRNG dari library 'secrets'
        salt = secrets.token_bytes(cls.SALT_LENGTH)
        
        # Proses Key Derivation Function (KDF)
        pwd_hash = hashlib.pbkdf2_hmac(
            hash_name=cls.ALGORITHM,
            password=password.encode('utf-8'),
            salt=salt,
            iterations=cls.ITERATIONS
        )
        
        # Representasi data heksadesimal
        salt_hex = binascii.hexlify(salt).decode('ascii')
        hash_hex = binascii.hexlify(pwd_hash).decode('ascii')
        
        # Mengembalikan format string gabungan
        return f"pbkdf2:{cls.ALGORITHM}:{cls.ITERATIONS}${salt_hex}${hash_hex}"

    @classmethod
    def verify_password(cls, password: str, hashed_string: str) -> bool:
        """
        Memverifikasi password plaintext terhadap string hash yang disimpan.
        
        Masukan: password (string), hashed_string (string)
        Keluaran: True jika cocok, False jika tidak cocok.
        """
        if not password or not hashed_string:
            return False
            
        try:
            # Memecah string representasi data
            header, salt_hex, hash_hex = hashed_string.split('$')
            algo_info, iterations_str = header.rsplit(':', 1)
            algo = algo_info.split(':')[1]
            iterations = int(iterations_str)
            
            salt = binascii.unhexlify(salt_hex)
            stored_hash = binascii.unhexlify(hash_hex)
            
            # Memproses ulang dengan parameter yang sama
            new_hash = hashlib.pbkdf2_hmac(
                hash_name=algo,
                password=password.encode('utf-8'),
                salt=salt,
                iterations=iterations
            )
            
            # Membandingkan hash secara aman (constant-time comparison) untuk mitigasi timing attack
            return secrets.compare_digest(new_hash, stored_hash)
            
        except (ValueError, IndexError, binascii.Error):
            # Jika format tidak sesuai, verifikasi otomatis gagal
            return False