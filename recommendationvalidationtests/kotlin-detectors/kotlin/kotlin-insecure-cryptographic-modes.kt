import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec
import javax.crypto.NullCipher

class CryptoComplianceCipherRuleTestCases {

    private val BAD_ENCRYPTION_ALGORITHM = "DES"


    @Throws(Exception::class)
    fun non_conformant1() {
        // Nonconforming: Insecure cipher transformation
        //ruleid: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance("des")
        c.doFinal()
    }


    @Throws(Exception::class)
     fun non_conformant2() {
        // Nonconforming: Cipher lacks integrity checks
        //ruleid: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance("aes_123/ctr/nopadding")
        c.doFinal()
    }

    @Throws(Exception::class)
     fun non_conformant3() {
        // Nonconforming: RSA insecure padding
        //ruleid: kotlin-insecure-cryptographic-modes
        val rsa = Cipher.getInstance("RSA/ECB/PKCS1Padding")
        rsa.init(Cipher.ENCRYPT_MODE, myPuKey)
    }

    @Throws(Exception::class)
     fun non_conformant4() {
        //ruleid: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance("aes_123/gcm/nopadding")
        c.doFinal()
    }

    // FPs from Darwin Evaluation
     fun non_conformant5() {
        private val AES = "AES"
        private val UTF8 = Charset.forName("UTF-8")

        private val encryptCipher: Cipher
        private val decryptCipher: Cipher

        private val key: SecretKeySpec

        try {
            val secretKey = symmetricKey.symmetricKey
            val secretText = secretKey.encoded

            key = SecretKeySpec(secretText, AES)
            //ruleid: kotlin-insecure-cryptographic-modes
            encryptCipher = Cipher.getInstance(AES)
            encryptCipher.init(Cipher.ENCRYPT_MODE, key)
            //ruleid: kotlin-insecure-cryptographic-modes
            decryptCipher = Cipher.getInstance(AES)
            decryptCipher.init(Cipher.DECRYPT_MODE, key)
        } catch (e: NoSuchAlgorithmException) {
            log.error("Unable to create cryptographer", e)
            throw EncryptionException("Unable to create cryptographer")
        } catch (e: NoSuchPaddingException) {
            log.error("Unable to create cryptographer", e)
            throw EncryptionException("Unable to create cryptographer")
        } catch (e: InvalidKeyException) {
            log.error("Unable to create cryptographer", e)
            throw EncryptionException("Unable to create cryptographer")
        }
    }

     fun non_conformant6(): Cipher {
        //ruleid: kotlin-insecure-cryptographic-modes
        val cipher = Cipher.getInstance("DES/GCM")
        //ok: kotlin-insecure-cryptographic-modes
        Cipher.getInstance("AES/GCM")
        return cipher
    }

     fun non_conformant7(): Cipher {
        val constants = "DES/GCM"
        //ruleid: kotlin-insecure-cryptographic-modes
        return Cipher.getInstance(constants)
    }


     fun non_conformant8(): Cipher {
        //ruleid: kotlin-insecure-cryptographic-modes
        return Cipher.getInstance("RSA/NONE/NoPadding")
    }


    @Throws(Exception::class)
    fun conformant1() {
        //ok: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance("RSA/ECB/OAEPWithSHA-384AndMGF1Padding")
        c.doFinal()
    }


    fun conforming2() {
        //ok: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance("RSA/ECB/OAEPPadding", "with provider")
    }

    fun conforming3(cipher: String) {
        //ok: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance(cipher)
    }

    @Throws(Exception::class)
    fun conforming4() {
        //ok: kotlin-insecure-cryptographic-modes
        val cipher = Cipher.getInstance("AESWrap")
        cipher.init(Cipher.WRAP_MODE, key)
    }

    @Throws(Exception::class)
    fun conforming6() {
        //ok: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance("RSA/ECB/OAEPPadding")
        c.doFinal()
    }

    @Throws(Exception::class)
    fun conforming7() {
        //ok: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance("RSA/ECB/OAEPWithSHA-1AndMGF1Padding")
        c.doFinal()
    }

    @Throws(Exception::class)
    fun conforming8(key: SecretKey) {
        //ok: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance("RSA/ECB/OAEPPadding")
        c.init(
            Cipher.ENCRYPT_MODE, key, OAEPParameterSpec(
                "SHA-256", "MGF1",
                MGF1ParameterSpec.SHA256, PSource.PSpecified.DEFAULT
            )
        )
        c.doFinal()
    }

    fun conforming9(): Cipher {
        //ok: kotlin-insecure-cryptographic-modes
        return Cipher.getInstance("RSA/ECB/OAEPWithMD5AndMGF1Padding")
    }

    fun conforming10(): Cipher {
        //ok: kotlin-insecure-cryptographic-modes
        val c = Cipher.getInstance(
            "AES/CCM/NoPadding", java.security.Security.getProvider("BC")
        )
        return c
    }
}
