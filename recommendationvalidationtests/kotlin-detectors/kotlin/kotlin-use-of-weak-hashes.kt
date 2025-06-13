import java.security.MessageDigest
import org.apache.commons.codec.digest.DigestUtils
import javax.crypto.Cipher

class WeakHashingAlgo {

    public fun noncompliant1(password: String): ByteArray {
        // ruleid: kotlin-use-of-weak-hashes
        val md5Digest: MessageDigest = MessageDigest.getInstance("MD5")
        md5Digest.update(password.getBytes())
        val hashValue: ByteArray = md5Digest.digest()
        return hashValue
    }

    public fun noncompliant2(password: String) {
        // ruleid: kotlin-use-of-weak-hashes
        val md5 = MessageDigest.getInstance("MD5")
        val bytes = md5.digest(password.toByteArray()) // Avoid `java.security.MessageDigest` for password hashing
    }

    public fun noncompliant3(password: String) {
        // ruleid: kotlin-use-of-weak-hashes
        val md5 = MessageDigest.getInstance(MessageDigestAlgorithms.MD5)
        md5.update(password.toByteArray()) // Avoid `java.security.MessageDigest` for password hashing
        md5.digest()
    }

    public fun noncompliant4(password: String): ByteArray {
        // ruleid: kotlin-use-of-weak-hashes
        val hashValue: ByteArray = DigestUtils.getMd5Digest().digest(password.toByteArray(Charsets.UTF_8))
        return hashValue
    }

    public fun noncompliant5(password: String): Array<Byte> {
        // ruleid: kotlin-use-of-weak-hashes
        var sha1Digest: MessageDigest = MessageDigest.getInstance("SHA1")
        sha1Digest.update(password.getBytes())
        val hashValue: Array<Byte> = sha1Digest.digest()
        return hashValue
    }

    public fun noncompliant6(password: String): Array<Byte> {
        // ruleid: kotlin-use-of-weak-hashes
        var sha1Digest: MessageDigest = MessageDigest.getInstance("SHA-1")
        sha1Digest.update(password.getBytes())
        val hashValue: Array<Byte> = sha1Digest.digest()
        return hashValue
    }

    public fun noncompliant7(password: String): Array<Byte> {
        // ruleid: kotlin-use-of-weak-hashes
        val hashValue: Array<Byte> = DigestUtils.getSha1Digest().digest(password.toByteArray(Charsets.UTF_8))
        return hashValue
    }

    public fun noncompliant8(password: String) {
        // ruleid: kotlin-use-of-weak-hashes
        val sha1Digest = MessageDigest.getInstance(MessageDigestAlgorithms.SHA1)
        sha1Digest.update(password.toByteArray()) // Avoid `java.security.MessageDigest` for password hashing
        sha1Digest.digest()
    }

    public fun noncompliant9(): Void {
      // ruleid: kotlin-use-of-weak-hashes
      val c: Cipher = Cipher.getInstance("AES/ECB/NoPadding")
      c.init(Cipher.ENCRYPT_MODE, k, iv)
      val cipherText = c.doFinal(plainText)
    }

    public fun noncompliant10(): Void {
      // ruleid: kotlin-use-of-weak-hashes
      var c = Cipher.getInstance("AES/ECB/NoPadding")
      c.init(Cipher.ENCRYPT_MODE, k, iv)
      val cipherText = c.doFinal(plainText)
    }


    public fun compliant1(password: String): ByteArray {
        // ok: kotlin-use-of-weak-hashes
        val shaDigest: MessageDigest = MessageDigest.getInstance("SHA-256")
        shaDigest.update(password.getBytes())
        val hashValue: ByteArray = shaDigest.digest()
        return hashValue
    }

    public fun compliant2(password: String) {
        // ok: kotlin-use-of-weak-hashes
        val shaDigest = MessageDigest.getInstance("SHA-512")
        val bytes = shaDigest.digest(password.toByteArray())
    }

    public fun compliant3(password: String) {
        // ok: kotlin-use-of-weak-hashes
        val shaDigest = MessageDigest.getInstance(MessageDigestAlgorithms.SHA_384)
        shaDigest.update(password.toByteArray())
        shaDigest.digest()
    }

    public fun compliant4(password: String): ByteArray {
        // ok: kotlin-use-of-weak-hashes
        val hashValue: ByteArray = DigestUtils.getSha256Digest().digest(password.toByteArray(Charsets.UTF_8))
        return hashValue
    }

    public fun compliant5(password: String): Array<Byte> {
        // ok: kotlin-use-of-weak-hashes
        var shaDigest: MessageDigest = MessageDigest.getInstance("SHA-256")
        shaDigest.update(password.getBytes())
        val hashValue: Array<Byte> = shaDigest.digest()
        return hashValue
    }

    public fun compliant6(password: String): Array<Byte> {
        // ok: kotlin-use-of-weak-hashes
        var shaDigest: MessageDigest = MessageDigest.getInstance("SHA-512")
        shaDigest.update(password.getBytes())
        val hashValue: Array<Byte> = shaDigest.digest()
        return hashValue
    }

    public fun compliant7(password: String): Array<Byte> {
        // ok: kotlin-use-of-weak-hashes
        val hashValue: Array<Byte> = DigestUtils.getSha512Digest().digest(password.toByteArray(Charsets.UTF_8))
        return hashValue
    }

    public fun compliant8(password: String) {
        // ok: kotlin-use-of-weak-hashes
        val shaDigest = MessageDigest.getInstance(MessageDigestAlgorithms.SHA256)
        shaDigest.update(password.toByteArray())
        shaDigest.digest()
    }

    public fun compliant9(): Void {
        // ok: kotlin-use-of-weak-hashes
        var c = Cipher.getInstance("AES/GCM/NoPadding")
        c.init(Cipher.ENCRYPT_MODE, k, iv)
        val cipherText = c.doFinal(plainText)
    }

}
