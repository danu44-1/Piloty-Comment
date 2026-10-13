import unittest
from .core_crypto import AuthCrypto

class TestAuthCrypto(unittest.TestCase):
    
    def setUp(self):
        # Data sintetis untuk pengujian
        self.dummy_password = "SuperSecurePublisherPassword123!"
        self.wrong_password = "WrongPassword456"

    # SKENARIO 1: Uji Positif - Pembuatan Hash berhasil dan formatnya valid
    def test_hash_format(self):
        hashed = AuthCrypto.hash_password(self.dummy_password)
        self.assertTrue(hashed.startswith("pbkdf2:sha256:210000$"))
        parts = hashed.split('$')
        self.assertEqual(len(parts), 3) # Header, Salt, Hash
        self.assertNotEqual(self.dummy_password, hashed) # Bukan plaintext

    # SKENARIO 2: Uji Positif - Verifikasi kata sandi benar mengembalikan True
    def test_verify_correct_password(self):
        hashed = AuthCrypto.hash_password(self.dummy_password)
        is_valid = AuthCrypto.verify_password(self.dummy_password, hashed)
        self.assertTrue(is_valid)

    # SKENARIO 3: Uji Positif - Salt unik (dua kata sandi identik memiliki hash berbeda)
    def test_salt_uniqueness(self):
        hash1 = AuthCrypto.hash_password(self.dummy_password)
        hash2 = AuthCrypto.hash_password(self.dummy_password)
        self.assertNotEqual(hash1, hash2, "Dua hash dari password yang sama tidak boleh identik (karena salt harus unik)")

    # SKENARIO 4: Uji Negatif - Verifikasi kata sandi salah mengembalikan False
    def test_verify_wrong_password(self):
        hashed = AuthCrypto.hash_password(self.dummy_password)
        is_valid = AuthCrypto.verify_password(self.wrong_password, hashed)
        self.assertFalse(is_valid)

    # SKENARIO 5: Uji Batas (Boundary) - Input kosong atau format hash rusak ditangani dengan aman
    def test_invalid_and_empty_inputs(self):
        # Kata sandi kosong saat hash harus melempar ValueError
        with self.assertRaises(ValueError):
            AuthCrypto.hash_password("")
            
        # Format hash rusak tidak melempar error, tapi mengembalikan False
        is_valid_broken_format = AuthCrypto.verify_password(self.dummy_password, "format_asal_asalan_tanpa_dollar")
        self.assertFalse(is_valid_broken_format)
        
        is_valid_empty = AuthCrypto.verify_password("", "")
        self.assertFalse(is_valid_empty)

if __name__ == '__main__':
    unittest.main()