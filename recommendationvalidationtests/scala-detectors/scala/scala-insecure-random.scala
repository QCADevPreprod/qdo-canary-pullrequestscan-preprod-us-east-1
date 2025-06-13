import java.security.SecureRandom
import java.nio.file.Files
import java.nio.file.Paths
import scala.util.Random
import org.apache.commons.codec.digest.DigestUtils

class Test {

  def bad1() {
    import scala.util.Random
    // ruleid: scala-insecure-random
    val result = Seq.fill(16)(Random.nextInt)
    return result.map("%02x" format _).mkString
  }

  def ok1() {
    import java.security.SecureRandom
    val rand = new SecureRandom()
    val value = Array.ofDim[Byte](16)
    // ok: scala-insecure-random
    rand.nextBytes(value)
    return value.map("%02x" format _).mkString
  }
  def goodCase1() {
    // Non-vulnerable: Using SecureRandom directly
    val rand = new SecureRandom()
    val value = Array.ofDim[Byte](16)
    // ok: scala-insecure-random
    rand.nextBytes(value)
    val result = value.map("%02x" format _).mkString
    // result is a cryptographically secure random string
  }

  def goodCase2() {
    // Non-vulnerable: Using SecureRandom with additional entropy
    val rand = new SecureRandom()
    // ok: scala-insecure-random
    rand.setSeed(SecureRandom.getSeed(32)) // Additional entropy from a secure source
    val value = Array.ofDim[Byte](16)
    // ok: scala-insecure-random
    rand.nextBytes(value)
    val result = value.map("%02x" format _).mkString
    // result is a cryptographically secure random string with additional entropy
  }

  def goodCase3() {
    // Non-vulnerable: Using NativePRNGNonBlocking from Apache Commons Codec
    val seed = DigestUtils.sha256Hex(System.currentTimeMillis().toString)
    val rand = new DigestUtils.NativePRNGNonBlocking(seed)
    val value = Array.ofDim[Byte](16)
    // ok: scala-insecure-random
    rand.nextBytes(value)
    val result = value.map("%02x" format _).mkString
    // result is a cryptographically secure random string using a third-party library
  }


  def badCase1() {
    // Vulnerable: Using java.util.Random with a predictable seed
    val random = new Random(42)
    // ruleid: scala-insecure-random
    val result = Seq.fill(16)(random.nextInt(256)).map("%02x" format _).mkString
    // result is a predictable random string
  }

  def badCase2() {
    // Vulnerable: Using System.currentTimeMillis() as a seed
    val seed = System.currentTimeMillis()
    val random = new Random(seed)
    // ruleid: scala-insecure-random
    val result = Seq.fill(16)(random.nextInt(256)).map("%02x" format _).mkString
    // result is predictable if generated within the same millisecond
  }

  def badCase3() {
    // Vulnerable: Using Math.random() which is not cryptographically secure
    // ruleid: scala-insecure-random
    val result = Seq.fill(16)(Math.random() * 256).map("%02x" format _).mkString
    // result is not suitable for security-sensitive applications
  }
}