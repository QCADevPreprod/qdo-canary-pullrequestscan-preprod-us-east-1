ackage crypto

import java.security._
import java.security.spec.RSAKeyGenParameterSpec
import javax.crypto.KeyGenerator
import java.security.NoSuchAlgorithmException

class InsufficientKeySize {
  // {fact rule=insecure-cryptography@v1.0 defects=1}
  @throws[NoSuchAlgorithmException]
  def weakKeySize1 = {
    val keyGen = KeyPairGenerator.getInstance("RSA")
    // ruleid: scala-insufficient-key-size
    keyGen.initialize(512) //BAD

    keyGen.generateKeyPair
  }
  // {/fact}

  // {fact rule=insecure-cryptography@v1.0 defects=1}
  @throws[NoSuchAlgorithmException]
  def weakKeySize2 = {
    val keyGen = KeyPairGenerator.getInstance("RSA")
    // ruleid: scala-insufficient-key-size
    keyGen.initialize(128, new SecureRandom) //BAD //Different signature

    keyGen.generateKeyPair
  }
  // {/fact}

  // {fact rule=insecure-cryptography@v1.0 defects=1}
  @throws[NoSuchAlgorithmException]
  @throws[InvalidAlgorithmParameterException]
  def weakKeySize3ParameterSpec = {
    val keyGen = KeyPairGenerator.getInstance("RSA")
    // ruleid: scala-insufficient-key-size
    keyGen.initialize(new RSAKeyGenParameterSpec(128, RSAKeyGenParameterSpec.F4))
    val key = keyGen.generateKeyPair
    key
  }
  // {/fact}

  // {fact rule=insecure-cryptography@v1.0 defects=1}
  @throws[NoSuchAlgorithmException]
  @throws[InvalidAlgorithmParameterException]
  def weakKeySize4ParameterSpec = {
    val keyGen = KeyPairGenerator.getInstance("RSA")
    // ruleid: scala-insufficient-key-size
    keyGen.initialize(new RSAKeyGenParameterSpec(128, RSAKeyGenParameterSpec.F4), new SecureRandom)
    val key = keyGen.generateKeyPair
    key
  }
  // {/fact}

  // {fact rule=insecure-cryptography@v1.0 defects=1}
  @throws[NoSuchAlgorithmException]
  def weakKeySize5Recommended = {
    val keyGen = KeyPairGenerator.getInstance("RSA")
    // ruleid: scala-insufficient-key-size
    keyGen.initialize(1024) //BAD with lower priority

    keyGen.generateKeyPair
  }
  // {/fact}

  @throws[NoSuchAlgorithmException]
  @throws[InvalidAlgorithmParameterException]
  def okKeySizeParameterSpec = {
    val keyGen = KeyPairGenerator.getInstance("RSA")
    // ok: scala-insufficient-key-size
    keyGen.initialize(new RSAKeyGenParameterSpec(2048, RSAKeyGenParameterSpec.F4)) //Different signature

    keyGen.generateKeyPair
  }

  // {fact rule=insecure-cryptography@v1.0 defects=1}
  @throws[NoSuchAlgorithmException]
  @throws[NoSuchProviderException]
  def weakKeySizeWithProviderString = {
    val keyGen = KeyPairGenerator.getInstance("RSA", "BC")
    // ruleid: scala-insufficient-key-size
    keyGen.initialize(1024)
    keyGen.generateKeyPair
  }
  // {/fact}

  // {fact rule=insecure-cryptography@v1.0 defects=1}
  @throws[NoSuchAlgorithmException]
  def weakKeySizeWithProviderObject1 = {
    val keyGen = KeyPairGenerator.getInstance("RSA")
    // ruleid: scala-insufficient-key-size
    keyGen.initialize(1024)
    keyGen.generateKeyPair
  }
  // {/fact}

  // {fact rule=insecure-cryptography@v1.0 defects=1}
  @throws[NoSuchAlgorithmException]
  def weakKeySizeWithProviderObject2 = {
    val p = new ExampleProvider("info")
    val keyGen = KeyPairGenerator.getInstance("RSA", p)
    // ruleid: scala-insufficient-key-size
    keyGen.initialize(1024)
    keyGen.generateKeyPair
  }
  // {/fact}

  @throws[NoSuchAlgorithmException]
  @throws[NoSuchProviderException]
  def strongKeySizeWithProviderString = {
    val keyGen = KeyPairGenerator.getInstance("RSA", "BC")
    // ok: scala-insufficient-key-size
    keyGen.initialize(2048) // OK: n >= 2048

    keyGen.generateKeyPair
  }

  private class ExampleProvider(info: String) extends Provider("example", 0.0, info) {
    def this() {
      this("example")
    }
  }

  // {fact rule=insecure-cryptography@v1.0 defects=1}
  @throws[NoSuchAlgorithmException]
  def danger(): Unit = {
    // ruleid: scala-insufficient-key-size
    val keyGen = KeyGenerator.getInstance("Blowfish")
    keyGen.init(64)
  }
  // {/fact}

  @throws[NoSuchAlgorithmException]
  def danger(): Unit = {
    val keyGen = KeyGenerator.getInstance("Blowfish")
    // ok: scala-insufficient-key-size
    keyGen.init(128) // Use a key size of 128 bits or higher
  }
}