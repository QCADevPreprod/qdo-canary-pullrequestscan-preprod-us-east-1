import java.nio.charset.StandardCharsets
import java.security.DigestException
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import org.apache.commons.codec.digest.MessageDigestAlgorithms
import org.apache.commons.codec.digest.DigestUtils

class HashingAlgoNotSuitableForPasswordTestCases {


   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming1() {
       val PASSWORD = "Pass@123"
       val md5 = MessageDigest.getInstance("MD5")
       // ruleid: kotlin-incorrect-password-hashing
       val bytes = md5.digest(PASSWORD.toByteArray()) //Avoid `java.security.MessageDigest` for password hashing
   }

   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming2() {
       val password = "abcd"
       val md5 = MessageDigest.getInstance("SHA-1")
       // ruleid: kotlin-incorrect-password-hashing
       val bytes = md5.digest(password.toByteArray()) //Avoid `java.security.MessageDigest` for password hashing
   }

   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming3() {
       val md5 = MessageDigest.getInstance("SHA-256")
       val pass = "somepass".toByteArray()
       // ruleid: kotlin-incorrect-password-hashing
       val bytes = md5.digest(pass) //Avoid `java.security.MessageDigest` for password hashing
   }

   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming4() {
       val PASSWORD = "Pass@123"
       val md5 = MessageDigest.getInstance("SHA-384")
       val passwd = PASSWORD.toByteArray()
       // ruleid: kotlin-incorrect-password-hashing
       val bytes = md5.digest(passwd) //Avoid `java.security.MessageDigest` for password hashing
   }

   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming5(pwd: String) {
       val md5 = MessageDigest.getInstance(MessageDigestAlgorithms.SHA3_512)
       // ruleid: kotlin-incorrect-password-hashing
       val bytes = md5.digest(pwd.toByteArray()) //Avoid `java.security.MessageDigest` for password hashing
   }

   @Throws(NoSuchAlgorithmException::class, DigestException::class)
   fun nonconforming6(pwd: String): ByteArray {
       val md5 = MessageDigest.getInstance(MessageDigestAlgorithms.SHA3_512)
       // ruleid: kotlin-incorrect-password-hashing
       return md5.digest(pwd.toByteArray()) //Avoid `java.security.MessageDigest` for password hashing
   }

   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming7() {
       val md5 = MessageDigest.getInstance("SHA-256")
       val password = "aaa"
       md5.update(password.toByteArray()) //Avoid `java.security.MessageDigest` for password hashing
       // ruleid: kotlin-incorrect-password-hashing
       val hash = md5.digest()
   }

   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming8(pass: String) {
       val md5 = MessageDigest.getInstance("SHA-512")
       md5.update(pass.toByteArray()) //Avoid `java.security.MessageDigest` for password hashing
       // ruleid: kotlin-incorrect-password-hashing
       val hash = md5.digest()
   }

   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming9() {
       val PASSWORD = "Pass@123"
       val md5 = MessageDigest.getInstance(MessageDigestAlgorithms.MD5)
       md5.update(PASSWORD.toByteArray()) //Avoid `java.security.MessageDigest` for password hashing
       // ruleid: kotlin-incorrect-password-hashing
       md5.digest()
   }

   //Inter procedural case
   fun getVal(): String {
       password = "123"
       return password
   }

   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming10(): ByteArray {
       val md5 = MessageDigest.getInstance(MessageDigestAlgorithms.MD2)
       // ruleid: kotlin-incorrect-password-hashing
       return md5.digest(getVal().toByteArray()) //Avoid `java.security.MessageDigest` for password hashing
   }

   @Throws(NoSuchAlgorithmException::class)
   fun nonconforming11(): ByteArray {
       val md5 = MessageDigest.getInstance(MessageDigestAlgorithms.MD5)
       val `val` = getVal().toByteArray()
       md5.update(`val`) //Avoid `java.security.MessageDigest` for password hashing
       // ruleid: kotlin-incorrect-password-hashing
       return md5.digest()
   }

   @Throws(NoSuchAlgorithmException::class)
   fun conforming1() {
       val SOME_MESSAGE = "xyz"
       val md5 = MessageDigest.getInstance("MD5")
       //ok: kotlin-incorrect-password-hashing
       md5.digest(SOME_MESSAGE.toByteArray())
   }

   @Throws(NoSuchAlgorithmException::class)
   fun conforming2() {
       val md5 = MessageDigest.getInstance("SHA-1")
       val info = "some info".toByteArray()
       //ok: kotlin-incorrect-password-hashing
       md5.digest(info)
   }

   @Throws(NoSuchAlgorithmException::class)
   fun conforming3(msg: String) {
       val md5 = MessageDigest.getInstance("SHA-256")
       md5.update(msg.toByteArray(StandardCharsets.UTF_8))
       //ok : kotlin-incorrect-password-hashing
       md5.digest()
   }

   @Throws(NoSuchAlgorithmException::class)
   fun conforming4() {
       val SOME_MESSAGE = "xyz"
       val md5 = MessageDigest.getInstance("SHA-256")
       md5.update(SOME_MESSAGE.toByteArray(StandardCharsets.UTF_8))
       //ok : kotlin-incorrect-password-hashing
       md5.digest()
   }

   @Throws(NoSuchAlgorithmException::class)
   fun conforming5() {
       val md5 = MessageDigest.getInstance("SHA-512")
       md5.update("something".toByteArray(StandardCharsets.UTF_8))
       //ok : kotlin-incorrect-password-hashing
       md5.digest()
   }

   //Inter procedural case
   fun getMsg(): String {
       return "ak123"
   }

   @Throws(NoSuchAlgorithmException::class)
   fun conforming6(): ByteArray {
       val md5 = MessageDigest.getInstance(MessageDigestAlgorithms.MD2)
       // ruleid: kotlin-incorrect-password-hashing
       return md5.digest(getMsg().toByteArray())
   }
   @Throws(Exception::class)
   fun fn_non_conformant(password: String): ByteArray {
       // ruleid: kotlin-incorrect-password-hashing
       val hashValue = DigestUtils.getMd5Digest().digest(password.toByteArray())
       return hashValue
   }

   private fun bufferToHex(bytes: ByteArray): String? {
       // implementation not shown
       return null
   }
}