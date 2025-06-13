import com.amazonaws.util.Base64
import org.springframework.beans.factory.annotation.Qualifier

import javax.crypto.spec._
import javax.net.ssl.KeyManagerFactory
import javax.security.auth.callback.PasswordCallback
import javax.security.auth.kerberos.KerberosKey
import javax.security.auth.kerberos.KerberosTicket
import java.io.ByteArrayInputStream
import java.io.FileInputStream
import java.io.IOException
import java.math.BigInteger
import java.net.PasswordAuthentication
import java.nio.charset.StandardCharsets
import java.security.KeyRep
import java.security.KeyStore
import java.security.KeyStore.PasswordProtection
import java.security.KeyStoreException
import java.security.NoSuchAlgorithmException
import java.security.cert.CertificateException
import java.security.spec._
import java.sql.Connection
import java.sql.DriverManager
import java.sql.SQLException
import java.util


object PasswordCommon {
  private val KEYSTORE_TYPE = "RSA"
  private val PUBLIC_KEY = Array[Byte](1, 2, 3, 4, 5, 6, 7)
  private val PWD1 = "secret4"
  private val PWD2 = Array('s', 'e', 'c', 'r', 'e', 't', '5')
  private val big = new String("1000000")
  private val keys = Array(1, 2, 3, 4, 5, 6, 7, 8)

  @throws[Exception]
  def noncompliant1(): Unit = {
    val passphrase = "secret2"
    System.out.println("secret2")
    val ks = KeyStore.getInstance("JKS")
    val fs = new FileInputStream("keystore")
    // ruleid: scala-hardcoded-credentials
    ks.load(fs, passphrase.toCharArray)
  }


  @throws[Exception]
  def noncompliant2(): Unit = {
    val ks = KeyStore.getInstance("JKS")
    // ruleid: scala-hardcoded-credentials
    ks.load(new FileInputStream("keystore"), PWD2)
  }

  private def getPassword = {
    val password = new Array[Char](3)
    // some operations to simulate non-constant password
    password(0) = 'x'
    password(1) = 10
    password(2) = ("o" + "z").charAt(1)
    password
  }
}

class PasswordCommon {
  final private val PWD3 = Array('s', 'e', 'c', 'r', 'e', 't', '5')
  final private val pwd5 = null
  final private val pwd6 = new Array[Char](7)
  private val pwd4 = null // not considered hard coded


  @throws[Exception]
  def noncompliant3(): Unit = {
    val passphrase = "secret1".toCharArray
    val ks = KeyStore.getInstance("JKS")
    // ruleid: scala-hardcoded-credentials
    ks.load(new FileInputStream("keystore"), passphrase)
  }

  @throws[Exception]
  def noncompliant4(): Unit = {
    val passphrase = Array('s', 'e', 'c', 'r', 'e', 't', '3')
    // ruleid: scala-hardcoded-credentials
    KeyStore.getInstance("JKS").load(new FileInputStream("keystore"), passphrase)
  }
  

  @throws[Exception]
  def noncompliant5(): Unit = {
    val ks = KeyStore.getInstance("JKS")
    // ruleid: scala-hardcoded-credentials
    ks.load(new FileInputStream("keystore"), PasswordCommon.PWD1.toCharArray)
  }
  

  @throws[Exception]
  def noncompliant6(): Unit = {
    val ks = KeyStore.getInstance("JKS")
    // ruleid: scala-hardcoded-credentials
    ks.load(new FileInputStream("keystore"), PWD3)
  }
  

  @throws[Exception]
  def noncompliant7(): Unit = {
    val pwdStr = "secret6"
    val pwd1 = pwdStr.toCharArray
    val ks = KeyStore.getInstance("JKS")
    val pwd2 = pwd1
    // ruleid: scala-hardcoded-credentials
    ks.load(new FileInputStream("keystore"), pwd2)
  }
  

  @throws[Exception]
  def noncompliant8(): Unit = {
    val bytes = new Array[Byte](2)
    val pwd = "secret7".toCharArray
    // ruleid: scala-hardcoded-credentials
    new PBEKeySpec(pwd)
    // ruleid: scala-hardcoded-credentials
    new PBEKeySpec(pwd, bytes, 1)
    // ruleid: scala-hardcoded-credentials
    new PBEKeySpec(pwd, bytes, 1, 1)
    // ruleid: scala-hardcoded-credentials
    val auth = new PasswordAuthentication("user", pwd)
    val callback = new PasswordCallback("str", true)
    // ruleid: scala-hardcoded-credentials
    callback.setPassword(pwd)
    val protection = new PasswordProtection(pwd)
    // ruleid: scala-hardcoded-credentials
    val key = new KerberosKey(null, pwd, "alg")
    // ruleid: scala-hardcoded-credentials
    KeyManagerFactory.getInstance("").init(null, pwd)
  }
  

  @throws[Exception]
  def noncompliant9(): Unit = {
    new DESKeySpec(null) // should not be reported

    val key = Array[Byte](1, 2, 3, 4, 5, 6, 7, 8)
    // ruleid: scala-hardcoded-credentials
    val spec = new DESKeySpec(key)
    // ruleid: scala-hardcoded-credentials
    val spec2 = new DESedeKeySpec(key)
    // ruleid: scala-hardcoded-credentials
    val kerberosKey = new KerberosKey(null, key, 0, 0)
    System.out.println(spec.getKey()(0) + kerberosKey.getKeyType)
    // ruleid: scala-hardcoded-credentials
    new SecretKeySpec(key, "alg")
    // ruleid: scala-hardcoded-credentials
    new SecretKeySpec(key, 0, 0, "alg")
    // ruleid: scala-hardcoded-credentials
    new X509EncodedKeySpec(key)
    // ruleid: scala-hardcoded-credentials
    new PKCS8EncodedKeySpec(key)
    // ruleid: scala-hardcoded-credentials
    new KeyRep(null, "alg", "format", key)
    // ruleid: scala-hardcoded-credentials
    new KerberosTicket(null, null, null, key, 0, null, null, null, null, null, null)
  }
  

  def noncompliant10(): Unit = {
    val key = "secret8".getBytes
    System.out.println("something")
    new SecretKeySpec(key, "alg")
  }
  

  @throws[SQLException]
  def noncompliant11(): Unit = {
    val pass = "secret9"
    var connection = DriverManager.getConnection("url", "user", PasswordCommon.PWD1)
    System.out.println(connection.getCatalog)
    // ruleid: scala-hardcoded-credentials
    connection = DriverManager.getConnection("url", "user", pass)
    System.out.println(connection.getCatalog)
  }
  

  @throws[SQLException]
  def noncompliant12(): Unit = {
    // ruleid: scala-hardcoded-credentials
    val connection = DriverManager.getConnection("url", "user", "")
    System.out.println(connection.getCatalog)
  }
  

  @throws[Exception]
  def noncompliant13(): Unit = {
    val bigInteger = new BigInteger("12345", 5)
    // ruleid: scala-hardcoded-credentials
    new DSAPrivateKeySpec(bigInteger, null, null, null)
    // ruleid: scala-hardcoded-credentials
    new DSAPublicKeySpec(bigInteger, null, bigInteger, null) // report once
    // ruleid: scala-hardcoded-credentials
    new DHPrivateKeySpec(bigInteger, null, null)
    // ruleid: scala-hardcoded-credentials
    new DHPublicKeySpec(bigInteger, null, null)
    // ruleid: scala-hardcoded-credentials
    new ECPrivateKeySpec(bigInteger, null)
    // ruleid: scala-hardcoded-credentials
    new RSAPrivateKeySpec(bigInteger, null)
    // ruleid: scala-hardcoded-credentials
    new RSAMultiPrimePrivateCrtKeySpec(bigInteger, null, null, null, null, null, null, null, null)
    // ruleid: scala-hardcoded-credentials
    new RSAPrivateCrtKeySpec(bigInteger, null, null, null, null, null, null, null)
    // ruleid: scala-hardcoded-credentials
    new RSAPublicKeySpec(bigInteger, null)
  }
  
  def noncompliant14(): Unit = {
    // ruleid: scala-hardcoded-credentials
    new DSAPrivateKeySpec(null, null, null, null)
    System.out.println
    // ruleid: scala-hardcoded-credentials
    new DSAPrivateKeySpec(null, null, null, null)
  }
  

  @throws[Exception]
  def noncompliant15(): Unit = {
    val key = "secret8".getBytes(StandardCharsets.UTF_8)
    val bigInteger = new BigInteger(key)
    // ruleid: scala-hardcoded-credentials
    new DSAPrivateKeySpec(bigInteger, null, null, null)
  }
  

  @throws[Exception]
  def noncompliant16(): Unit = {
    var pwd: String = null
    if (PasswordCommon.PWD2(3) < 'u') { // non-trivial condition
      pwd = "hardcoded"
    }
    // ruleid: scala-hardcoded-credentials
    if (pwd != null) KeyStore.getInstance("JKS").load( // should be reported
      new FileInputStream("keystore"), pwd.toCharArray)
  }
  

  @throws[Exception]
  def noncompliant17 = {
    var pwd: String = null
    if (PasswordCommon.PWD2(2) % 2 == 1) pwd = "hardcoded1"
    else { // different constant but still hard coded
      pwd = "hardcoded2"
    }
    // ruleid: scala-hardcoded-credentials
    DriverManager.getConnection("url", "user", pwd)
  }
  

  @throws[Exception]
  def noncompliant18(vertx: Nothing): Unit = {
    var pwd: String = null
    if (PasswordCommon.PWD2(2) % 2 == 1) pwd = "hardcoded1"
    else pwd = "hardcoded2"
    // ruleid: scala-hardcoded-credentials
    io.vertx.ext.web.handler.CSRFHandler.create(vertx, pwd)
  }
  

  @throws[Exception]
  def compliant1(): Unit = {
    val ks = KeyStore.getInstance("JKS")
    // ok: scala-hardcoded-credentials
    ks.load(new FileInputStream("keystore"), PasswordCommon.getPassword)
  }
  

  @throws[Exception]
  def compliant2(): Unit = {
    val pwd = "uiiii".substring(3) + "oo"
    val pwdArray = pwd.toCharArray
    val ks = KeyStore.getInstance("JKS")
    // ok: scala-hardcoded-credentials
    ks.load(new FileInputStream("keystore"), pwdArray)
  }
  
  
  @throws[Exception]
  def compliant3(): Unit = {
    var key = "hard coded"
    key = new String(PasswordCommon.getPassword) // no longer hard coded

    val message = "can be hard coded"
    val byteStringToEncrypt = message.getBytes(StandardCharsets.UTF_8)
    // ok: scala-hardcoded-credentials
    new SecretKeySpec(key.getBytes, "AES") // should not report

    val newArray = new Array[Byte](1024) // not considered hard coded
    // ok: scala-hardcoded-credentials
    new X509EncodedKeySpec(newArray)
  }
  

  @throws[KeyStoreException]
  @throws[CertificateException]
  @throws[IOException]
  @throws[NoSuchAlgorithmException]
  def compliant4(vaultServiceKey: String, @Qualifier("keyStorePassword") pass: Nothing) = {
    val keyStore = KeyStore.getInstance(PasswordCommon.KEYSTORE_TYPE)
    // ok: scala-hardcoded-credentials
    keyStore.load(new ByteArrayInputStream(Base64.decode(vaultServiceKey)), pass)
    keyStore
  }
  

  @throws[KeyStoreException]
  @throws[CertificateException]
  @throws[IOException]
  @throws[NoSuchAlgorithmException]
  def compliant5(vaultServiceKey: String, @Qualifier("keyStorePassword") password: Array[Char]) = {
    val keyStore = KeyStore.getInstance(PasswordCommon.KEYSTORE_TYPE)
    // ok: scala-hardcoded-credentials
    keyStore.load(new ByteArrayInputStream(Base64.decode(vaultServiceKey)), password)
    keyStore
  }
  

  @throws[KeyStoreException]
  @throws[CertificateException]
  @throws[IOException]
  @throws[NoSuchAlgorithmException]
  def noncompliant19(vaultServiceKey: String) = {
    val keyStore = KeyStore.getInstance(PasswordCommon.KEYSTORE_TYPE)
    val pass = "test"
    // ruleid: scala-hardcoded-credentials
    keyStore.load(new ByteArrayInputStream(Base64.decode(vaultServiceKey)), pass.toCharArray)
    keyStore
  }
  

  @throws[KeyStoreException]
  @throws[CertificateException]
  @throws[IOException]
  @throws[NoSuchAlgorithmException]
  def noncompliant20(vaultServiceKey: String) = {
    val keyStore = KeyStore.getInstance(PasswordCommon.KEYSTORE_TYPE)
    // ruleid: scala-hardcoded-credentials
    keyStore.load(new ByteArrayInputStream(Base64.decode(vaultServiceKey)), "test".toCharArray)
    keyStore
  }
  
  @throws[KeyStoreException]
  @throws[CertificateException]
  @throws[IOException]
  @throws[NoSuchAlgorithmException]
  def noncompliant21(vaultServiceKey: String) = {
    val keyStore = KeyStore.getInstance(PasswordCommon.KEYSTORE_TYPE)
    val pass = "test".toCharArray
    // ruleid: scala-hardcoded-credentials
    keyStore.load(new ByteArrayInputStream(Base64.decode(vaultServiceKey)), pass)
    keyStore
  }
  

  private def noncompliant22(pwd: Array[Char], pwd2: Array[Char]): Unit = {
    val PWD8 = "secret4"
    if (pwd.eq(pwd2)) return
    if (PasswordCommon.PWD1.equals("")) return
    // ruleid: scala-hardcoded-credentials
    if ("password1213".equals(PWD8)) return
    // ruleid: scala-hardcoded-credentials
    if (PWD8.equals("password1213")) return
    if (pwd.eq(PasswordCommon.PWD2)) return
  }

  def getDriverState(submissionId: String): Option[MesosDriverState] = {
    stateLock.synchronized {
      queuedDrivers.find(_.submissionId.equals(submissionId))
        .map(d => new MesosDriverState("QUEUED", d))
        .orElse(launchedDrivers.get(submissionId)
          .map(d => new MesosDriverState("RUNNING", d.driverDescription, Some(d))))
          // ok: scala-hardcoded-credentials
        .orElse(finishedDrivers.find(_.driverDescription.submissionId.equals(submissionId))
          .map(d => new MesosDriverState("FINISHED", d.driverDescription, Some(d))))
        .orElse(pendingRetryDrivers.find(_.submissionId.equals(submissionId))
          .map(d => new MesosDriverState("RETRYING", d)))
    }
  }

  def applyHttpsConfig(httpsConfig: HttpsConfig, withDisableHostnameVerification: Boolean = false): SSLContext = {
    val keyFactoryType = "SunX509"
    val clientAuth = {
      if (httpsConfig.clientAuth.toBoolean)
        Some(TLSClientAuth.need)
      else
        Some(TLSClientAuth.none)
    }

    val keystorePassword = httpsConfig.keystorePassword.toCharArray

    val keyStore: KeyStore = KeyStore.getInstance(httpsConfig.keystoreFlavor)
    val keyStoreStream: InputStream = new FileInputStream(httpsConfig.keystorePath)
    keyStore.load(keyStoreStream, keystorePassword)

    val keyManagerFactory: KeyManagerFactory = KeyManagerFactory.getInstance(keyFactoryType)
    keyManagerFactory.init(keyStore, keystorePassword)

    // Currently, we are using the keystore as truststore as well, because the clients use the same keys as the
    // server for client authentication (if enabled).
    // So this code is guided by https://doc.akka.io/docs/akka-http/10.0.9/scala/http/server-side-https-support.html
    // This needs to be reworked, when we fix the keys and certificates.
    val trustManagerFactory: TrustManagerFactory = TrustManagerFactory.getInstance(keyFactoryType)
    trustManagerFactory.init(keyStore)

    val sslContext: SSLContext = SSLContext.getInstance("TLS")
    sslContext.init(keyManagerFactory.getKeyManagers, trustManagerFactory.getTrustManagers, new SecureRandom)
    sslContext
  }

  def killDriver(submissionId: String): KillSubmissionResponse = {
    val k = new KillSubmissionResponse
    if (!ready) {
      k.success = false
      k.message = "Scheduler is not ready to take requests"
      return k
    }
    k.submissionId = submissionId
    stateLock.synchronized {
      // We look for the requested driver in the following places:
      // 1. Check if submission is running or launched.
      // 2. Check if it's still queued.
      // 3. Check if it's in the retry list.
      // 4. Check if it has already completed.
      if (launchedDrivers.contains(submissionId)) {
        val task = launchedDrivers(submissionId)
        mesosDriver.killTask(task.taskId)
        k.success = true
        k.message = "Killing running driver"
      } else if (removeFromQueuedDrivers(submissionId)) {
        k.success = true
        k.message = "Removed driver while it's still pending"
      } else if (removeFromPendingRetryDrivers(submissionId)) {
        k.success = true
        k.message = "Removed driver while it's being retried"
      } else if (finishedDrivers.exists(_.driverDescription.submissionId.equals(submissionId))) {
        k.success = false
        k.message = "Driver already terminated"
      } else {
        k.success = false
        k.message = "Cannot find driver"
      }
    }
    k
  }

  private def getExpectReduce(
      stageId: Int,
      attemptId: Int,
      metric: TaskMetricDistributions): Double = {
    val shuffleReadSize = metric.shuffleReadMetrics.readBytes
    val inputSize = metric.inputMetrics.bytesRead
    val stageKey = Array(stageId, attemptId)
    val expectDuration = metric.executorRunTime(3)
    if (isSkew(shuffleReadSize)) {
      // ok: scala-hardcoded-credentials
      kvStore
        .view(classOf[TaskDataWrapper])
        .parent(stageKey)
        .index(TaskIndexNames.SHUFFLE_TOTAL_READS)
        .first(shuffleReadSize(3).toLong)
        .asScala
        .filter { _.status == "SUCCESS" } // Filter "SUCCESS" tasks
        .toIndexedSeq
        .map(m => (m.executorRunTime - expectDuration) / 1000D / 60)
        .sum
        .max(0D)
    } else if (isSkew(inputSize)) {
      // ok: scala-hardcoded-credentials
      kvStore
        .view(classOf[TaskDataWrapper])
        .parent(stageKey)
        .index(TaskIndexNames.INPUT_SIZE)
        .first(inputSize(3).toLong)
        .asScala
        .filter { _.status == "SUCCESS" } // Filter "SUCCESS" tasks
        .toIndexedSeq
        .map(m => (m.executorRunTime - expectDuration) / 1000D / 60)
        .sum
        .max(0D)
    } else {
      0D
    }
  }



}