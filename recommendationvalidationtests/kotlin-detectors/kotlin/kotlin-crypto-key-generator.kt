import java.security.Key
import java.security.NoSuchAlgorithmException
import java.security.SecureRandom
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey

class CryptoKeyGeneratorKotlinRule {

    @Throws(NoSuchAlgorithmException::class)
    fun nonConformant1() {
        // ruleid: kotlin-crypto-key-generator
        val generator = KeyGenerator.getInstance("AES")
    }

    @Throws(NoSuchAlgorithmException::class)
    fun nonConformant2() {
        // ruleid: kotlin-crypto-key-generator
        val generator = KeyGenerator.getInstance("AES")
        generator.init(128)
    }

    @Throws(NoSuchAlgorithmException::class)
    fun nonConformant3() {
        // ruleid: kotlin-crypto-key-generator
        val c = KeyGenerator.getInstance("HmacSHA256")
        c.init(128)
    }

    @Throws(NoSuchAlgorithmException::class)
    fun nonConformant4() {
        val keysize = 125
        // ruleid: kotlin-crypto-key-generator
        val c = KeyGenerator.getInstance("AES")
        c.init(keysize)
        c.generateKey()
    }

    @Throws(NoSuchAlgorithmException::class)
    fun nonConformant6() {
        // ruleid: kotlin-crypto-key-generator
        val c = KeyGenerator.getInstance("AES")
        c.generateKey()
        val keysize = 128
        c.init(keysize)
    }

    @Throws(NoSuchAlgorithmException::class)
    fun nonConformant7() {
        // ruleid: kotlin-crypto-key-generator
        val c = KeyGenerator.getInstance("AES")
        c.generateKey()
        c.init(128)
        val d = KeyGenerator.getInstance("AES")
        d.generateKey()
    }

    @Throws(NoSuchAlgorithmException::class)
    fun nonConformant8() {
        // ruleid: kotlin-crypto-key-generator
        val c = KeyGenerator.getInstance("AES")
        c.init(128)
        c.generateKey()
        c.init(256) // No need to init again, can directly use `generateKey`
    }

    fun nonConformant9() {
        var keyGen: KeyGenerator? = null
        try {
            // ruleid: kotlin-crypto-key-generator
            keyGen = KeyGenerator.getInstance("Blowfish")
        } catch (e: NoSuchAlgorithmException) {
            throw RuntimeException(e)
        }
        keyGen.init(64)
    }

    @Throws(NoSuchAlgorithmException::class)
    fun conformant1() {
        // ok: kotlin-crypto-key-generator
        val c = KeyGenerator.getInstance("AES")
        c.init(128)
        c.generateKey()
    }

    @Throws(NoSuchAlgorithmException::class)
    fun conformant2() {
        // ok: kotlin-crypto-key-generator
        val c = KeyGenerator.getInstance("AES")
        c.generateKey()
    }

    @Throws(NoSuchAlgorithmException::class)
    fun conformant3() {
        try {
            // ok: kotlin-crypto-key-generator
            val key = KeyGenerator.getInstance("AES")
            key.init(192, SecureRandom())
            val sk = key.generateKey()
        } catch (e: Exception) {
        }
    }

    @Throws(NoSuchAlgorithmException::class)
    fun conformant4(algorithm: EncryptionAlgorithms) {
        try {
            // ok: kotlin-crypto-key-generator
            val keyGen = KeyGenerator.getInstance(algorithm.cipherAlgorithm)
            keyGen.init(algorithm.keyLength * 8)
            keyGen.generateKey()
        } catch (e: NoSuchAlgorithmException) {
        }
    }

    // Algorithm names should be case insensitive
    @Throws(NoSuchAlgorithmException::class)
    fun conformant5() {
        // ok: kotlin-crypto-key-generator
        val c = KeyGenerator.getInstance("aes")
        c.init(128)
        c.generateKey()
    }

    @Throws(Exception::class)
    fun conformant6() {
        // Adapted from OWASP test 345
        val c = javax.crypto.Cipher.getInstance("AES/CCM/NoPadding", java.security.Security.getProvider("BC"))
        // ok: kotlin-crypto-key-generator
        val key = KeyGenerator.getInstance("AES").generateKey()
        c.init(javax.crypto.Cipher.ENCRYPT_MODE, key)
    }

    fun conformant7() {
        var keyGen: KeyGenerator? = null
        try {
            // ok: kotlin-crypto-key-generator
            keyGen = KeyGenerator.getInstance("Blowfish")
        } catch (e: NoSuchAlgorithmException) {
            throw RuntimeException(e)
        }
        keyGen.init(448)
    }

    fun conformant8() {
        var keyGen: KeyGenerator? = null
        try {
            // ok: kotlin-crypto-key-generator
            keyGen = KeyGenerator.getInstance("Blowfish")
        } catch (e: NoSuchAlgorithmException) {
            throw RuntimeException(e)
        }
        keyGen.init(128)
    }
}
