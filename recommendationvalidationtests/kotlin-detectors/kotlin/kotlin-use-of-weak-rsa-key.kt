import java.security.KeyPairGenerator

public class WeakRSA {

  fun noncompliant1(): Void {
    val keyGen: KeyPairGenerator = KeyPairGenerator.getInstance("RSA")
    // ruleid: kotlin-use-of-weak-rsa-key
    keyGen.initialize(512)
  }

  fun noncompliant2(): Void {
    val keyGen: KeyPairGenerator = KeyPairGenerator.getInstance("RSA")
    // ruleid: kotlin-use-of-weak-rsa-key
    keyGen.initialize(256)
  }

  fun noncompliant3(): Void {
    val keyGen: KeyPairGenerator = KeyPairGenerator.getInstance("RSA")
     // ruleid: kotlin-use-of-weak-rsa-key
    keyGen.initialize(1024)
  }

  fun compliant1(): Void {
    val keyGen = KeyPairGenerator.getInstance("RSA")
    // ok: kotlin-use-of-weak-rsa-key
    keyGen.initialize(2048);
  }

  fun compliant2(): Void {
    val keyGen: KeyPairGenerator = KeyPairGenerator.getInstance("RSA")
    // ok: kotlin-use-of-weak-rsa-key
    keyGen.initialize(4096)
  }

  fun compliant3(): Void {
    val keyGen: KeyPairGenerator = KeyPairGenerator.getInstance("RSA")
    // ok: kotlin-use-of-weak-rsa-key
    keyGen.initialize(2065)
  }
  
}
