import javax.crypto.Cipher
import javax.crypto.NullCipher
import javax.crypto.spec.SecretKeySpec

class NoNullCipher {
    public fun noncompliant1(plainText: String): Array<Byte> {
        // ruleid: kotlin-no-null-cipher
        val doNothingCipher: Cipher = NullCipher()
        val cipherText: Cipher = doNothingCihper.doFinal(plainText)
        return cipherText
    }

    public fun noncompliant2(plainText: String): ByteArray {
        // ruleid: kotlin-no-null-cipher
        val doNothingCipher: Cipher = NullCipher()
        val cipherText: ByteArray = doNothingCipher.doFinal(plainText.toByteArray())
        return cipherText
    }

    public fun noncompliant3(plainText: String): ByteArray {
        // ruleid: kotlin-no-null-cipher
        val doNothingCipher: Cipher = NullCipher()
        return doNothingCipher.doFinal(plainText.toByteArray())
    }

    public fun noncompliant4(cipherText: ByteArray): String {
        // ruleid: kotlin-no-null-cipher
        val doNothingCipher: Cipher = NullCipher()
        val decryptedBytes = doNothingCipher.doFinal(cipherText)
        return String(decryptedBytes)
    }

    public fun noncompliant5(data: String): ByteArray {
        // ruleid: kotlin-no-null-cipher
        val doNothingCipher: Cipher = NullCipher()
        return doNothingCipher.doFinal(data.toByteArray())
    }

    public fun compliant1(plainText: String): Void {
        // ok: kotlin-no-null-cipher
        val cipher: Cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        val cipherText: Array<Byte> = cipher.doFinal(plainText)
        return cipherText
    }

    public fun compliant2(plainText: String): ByteArray {
        // ok: kotlin-no-null-cipher
        val doNothingCipher: Cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        val cipherText: ByteArray = doNothingCipher.doFinal(plainText.toByteArray())
        return cipherText
    }

    public fun compliant3(plainText: String, key: SecretKeySpec): ByteArray {
        // ok: kotlin-no-null-cipher
        val cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
        cipher.init(Cipher.ENCRYPT_MODE, key)
        return cipher.doFinal(plainText.toByteArray())
    }

    public fun compliant4(cipherText: ByteArray, key: SecretKeySpec): String {
        // ok: kotlin-no-null-cipher
        val cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
        cipher.init(Cipher.DECRYPT_MODE, key)
        val decryptedBytes = cipher.doFinal(cipherText)
        return String(decryptedBytes)
    }

    public fun compliant5(data: String, key: Key): ByteArray {
        // ok: kotlin-no-null-cipher
        val cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
        cipher.init(Cipher.ENCRYPT_MODE, key)
        return cipher.doFinal(data.toByteArray())
    }

}
