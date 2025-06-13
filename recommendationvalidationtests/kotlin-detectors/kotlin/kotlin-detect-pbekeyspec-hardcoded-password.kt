import java.security.GeneralSecurityException
import java.security.NoSuchAlgorithmException
import java.security.SecureRandom
import java.security.spec.InvalidKeySpecException
import java.security.spec.KeySpec
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec
import java.util.Base64

class DetectPBEKeySpecHardcodedPassword {

    @Throws(NoSuchAlgorithmException::class, InvalidKeySpecException::class)
    fun nonConformant1() {
        val random = SecureRandom()
        val salt = ByteArray(16)
        random.nextBytes(salt)
        val pwd = charArrayOf('S', 'o', 'm', 'e', '@', '1', '2', '3')
        // ruleid: kotlin-detect-pbekeyspec-hardcoded-password
        val spec: KeySpec = PBEKeySpec(pwd, salt, 65536, 128) // non-compliant
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1")
        val hash = factory.generateSecret(spec).encoded
        (spec as PBEKeySpec).clearPassword()
    }

    @Throws(NoSuchAlgorithmException::class)
    fun nonConformant2() {
        val salt = ByteArray(32)
        SecureRandom.getInstanceStrong().nextBytes(salt)
        // ruleid: kotlin-detect-pbekeyspec-hardcoded-password
        val pbe = PBEKeySpec(charArrayOf('p', 'a', 's', 's', 'w', 'o', 'r', 'd'), salt, 65000, 128) // non-compliant
        pbe.clearPassword()
    }

    fun nonConformant3(algorithm: String, password: String): SecretKey {
        private const val PASSWORD = "SomePass@123"
        // ruleid: kotlin-detect-pbekeyspec-hardcoded-password
        return PBEKeySpec(PASSWORD.toCharArray()) // non-compliant
    }

    @Throws(NoSuchAlgorithmException::class)
    fun nonConformant4() {
        private const val PASSWORD = "SomePass@123"
        val salt = ByteArray(32)
        SecureRandom.getInstanceStrong().nextBytes(salt)
        // ruleid: kotlin-detect-pbekeyspec-hardcoded-password
        val pbe = PBEKeySpec(PASSWORD.toCharArray(), salt, 65000, 128) // non-compliant
        pbe.clearPassword()
    }

    fun nonConformant5() {
        val hardcodedPassword = "StillNotSecure987#".toCharArray()
        val salt = "SomeSaltValue".toByteArray()
        val iterationCount = 65536
        val keyLength = 512
        // ruleid: kotlin-detect-pbekeyspec-hardcoded-password
        val keySpec = PBEKeySpec("xyz".toCharArray(), salt, iterationCount, keyLength)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512")
        val secretKey = factory.generateSecret(keySpec)
        
        println("Generated key: ${Base64.getEncoder().encodeToString(secretKey.encoded)}")
        
        hardcodedPassword.fill('0')
        keySpec.clearPassword()
    }

    @Throws(NoSuchAlgorithmException::class, InvalidKeySpecException::class)
    fun conformant1() {
        val fPassPhrase = AppConfig.findString(fPassPhraseKey)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1")
        // ok: kotlin-detect-pbekeyspec-hardcoded-password
        val spec: KeySpec = PBEKeySpec(fPassPhrase.toCharArray(), gSalt, 1024, 256) // compliant
        fEncryptionKey = SecretKeySpec(factory.generateSecret(spec).encoded, "AES")
        (spec as PBEKeySpec).clearPassword()
    }

    private fun conformant2(password: String): ByteArray {
        return try {
            val pwd = password.toCharArray()
            // ok: kotlin-detect-pbekeyspec-hardcoded-password
            val spec = PBEKeySpec(pwd, salt, PBKDF2_ITERATIONS, HASH_BYTE_SIZE * 8) // compliant
            val fact = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM)
            spec.clearPassword()
            fact.generateSecret(spec).encoded
        } catch (e: NoSuchAlgorithmException) {
            throw RuntimeException(e)
        } catch (e: InvalidKeySpecException) {
            throw RuntimeException(e)
        }
    }

    fun conformant3(salt: String, plainText: String): String {
        return try {
            val iterations = 100
            val keyLength = 64 * 8
            val plainChars = plainText.toCharArray()
            val saltBytes = salt.toByteArray()
            // ok: kotlin-detect-pbekeyspec-hardcoded-password
            val spec = PBEKeySpec(plainChars, saltBytes, iterations, keyLength) // compliant
            val skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512")
            val hash = skf.generateSecret(spec).encoded
            spec.clearPassword()
            toHex(hash)
        } catch (e: NoSuchAlgorithmException) {
            log.error("Failed to perform hashing on the plaintext", e)
            throw ProcessingException("Unable to perform secure hashing")
        } catch (e: InvalidKeySpecException) {
            log.error("Failed to perform hashing on the plaintext", e)
            throw ProcessingException("Unable to perform secure hashing")
        }
    }

    private fun conformant4(rawPassword: CharSequence, salt: ByteArray): ByteArray {
        return try {
            // ok: kotlin-detect-pbekeyspec-hardcoded-password
            val spec = PBEKeySpec(
                rawPassword.toString().toCharArray(),
                concatenate(salt, this.secret), this.iterations, this.hashWidth
            )
            val skf = SecretKeyFactory.getInstance(this.algorithm)
            spec.clearPassword()
            concatenate(salt, skf.generateSecret(spec).encoded)
        } catch (e: GeneralSecurityException) {
            throw IllegalStateException("Could not create hash", e)
        }
    }

    @Throws(InvalidKeySpecException::class)
    fun conformant5(masterKey: String, salt: ByteArray): ByteArray {
        val factory = SecretKeyFactory.getInstance(ALGORITHM, BouncyCastleProvider.PROVIDER_NAME)
        // ok: kotlin-detect-pbekeyspec-hardcoded-password
        val spec: KeySpec = PBEKeySpec(masterKey.toCharArray(), salt, iterations, keyLen)
        return factory.generateSecret(spec).encoded.also {
            (spec as PBEKeySpec).clearPassword()
        }
    }
}
