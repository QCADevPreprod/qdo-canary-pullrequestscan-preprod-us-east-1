import com.hazelcast.config.Config
import com.hazelcast.config.MapConfig
import com.hazelcast.config.NetworkConfig
import com.hazelcast.config.SymmetricEncryptionConfig
import com.hazelcast.core.Hazelcast
import com.hazelcast.core.IMap
import java.security.SecureRandom


class HazelcastSymmetricEncryption {
  var cacheMap: IMap[String, String] = null
  def init(): Unit = { //Specific map time to live
    val myMapConfig = new MapConfig()
    myMapConfig.setName("cachetest")
    myMapConfig.setTimeToLiveSeconds(10)
    //Package config
    val myConfig = new Config()

    //Symmetric Encryption
    
    val symmetricEncryptionConfig = new SymmetricEncryptionConfig
    // ruleid: scala-hazelcast-symmetric-encryption
    symmetricEncryptionConfig.setAlgorithm("DESede")
    symmetricEncryptionConfig.setSalt("saltysalt")
    symmetricEncryptionConfig.setPassword("lamepassword")
    // ruleid: scala-hazelcast-symmetric-encryption
    symmetricEncryptionConfig.setIterationCount(1337)
    //Weak Network config..
    val networkConfig = new NetworkConfig()
    networkConfig.setSymmetricEncryptionConfig(symmetricEncryptionConfig)
    myConfig.setNetworkConfig(networkConfig)
    Hazelcast.newHazelcastInstance(myConfig)
    cacheMap = Hazelcast.getOrCreateHazelcastInstance.getMap("cachetest")


    //Symmetric Encryption
    val symmetricEncryptionConfig = new SymmetricEncryptionConfig
    // ok: scala-hazelcast-symmetric-encryption
    symmetricEncryptionConfig.setAlgorithm("AES")
    val secureRandom = new SecureRandom()
    val salt = new Array[Byte](16)
    secureRandom.nextBytes(salt)
    // ok: scala-hazelcast-symmetric-encryption
    symmetricEncryptionConfig.setSalt(salt.map("%02X".format(_)).mkString)
    val password = new Array[Byte](32)
    secureRandom.nextBytes(password)
    // ok: scala-hazelcast-symmetric-encryption
    symmetricEncryptionConfig.setPassword(password.map("%02X".format(_)).mkString)
    // ok: scala-hazelcast-symmetric-encryption
    symmetricEncryptionConfig.setIterationCount(100000)

  }

  def put(key: String, value: String): Unit = {
    cacheMap.put(key, value)
  }

  def get(key: String) = cacheMap.get(key)


  def setSalt_config{
        val symmetricEncryptionConfig = new SymmetricEncryptionConfig
        val secureRandom = new SecureRandom()
        val salt = new Array[Byte](16)
        secureRandom.nextBytes(salt)
        val saltHex = salt.map("%02X".format(_)).mkString
        // ok: scala-hazelcast-symmetric-encryption
        symmetricEncryptionConfig.setSalt(saltHex)

        val saltBytes = new Array[Byte](16) // 16 bytes (128 bits) for the salt
        secureRandom.nextBytes(saltBytes) // Generate secure random bytes for the salt

        val symmetricEncryptionConfig = new SymmetricEncryptionConfig
        symmetricEncryptionConfig.setAlgorithm("AES")
        // ok: scala-hazelcast-symmetric-encryption
        symmetricEncryptionConfig.setSalt(saltBytes) // Set the salt as a byte array
  }

  def setKeyLengthBits_config{
        val symmetricEncryptionConfig = new SymmetricEncryptionConfig
        symmetricEncryptionConfig.setAlgorithm("AES/CBC/PKCS5Padding")
        // ok: scala-hazelcast-symmetric-encryption
        symmetricEncryptionConfig.setKeyLengthBits(256) // Set 256-bit key length for AES
        // ok: scala-hazelcast-symmetric-encryption
        symmetricEncryptionConfig.setKeyLengthBits(128)
        // ruleid: scala-hazelcast-symmetric-encryption
        symmetricEncryptionConfig.setKeyLengthBits(120)
  }

  def setIterationCount_config{
    val symmetricEncryptionConfig = new SymmetricEncryptionConfig
    symmetricEncryptionConfig.setAlgorithm("AES")
    // ruleid: scala-hazelcast-symmetric-encryption
    symmetricEncryptionConfig.setIterationCount(1000) //
    // ok: scala-hazelcast-symmetric-encryption
    symmetricEncryptionConfig.setIterationCount(1000000)
  }
}
