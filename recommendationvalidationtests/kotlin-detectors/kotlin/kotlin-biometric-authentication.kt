import android.content.Context
import android.hardware.biometrics.BiometricPrompt
import androidx.core.content.ContextCompat
import java.security.Cipher
import java.security.Mac
import java.security.Signature
import javax.crypto.SecretKey

class BiometricAuthentication {
    private val executor = ContextCompat.getMainExecutor(this)
    private val callback = object : AuthenticationCallback() {
        override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
            super.onAuthenticationError(errorCode, errString)
            // Handle authentication error
        }

        override fun onAuthenticationSucceeded(result: AuthenticationResult?) {
            super.onAuthenticationSucceeded(result)
            // Handle authentication success
        }

        override fun onAuthenticationFailed() {
            super.onAuthenticationFailed()
            // Handle authentication failure
        }
    }

    val promptInfo = BiometricPrompt.PromptInfo.Builder()
        .setTitle("Biometric login for my app")
        .setSubtitle("Log in using your biometric credential")
        .build()

    public fun noncompliant1() {
        val biometricPrompt: BiometricPrompt = BiometricPrompt(this, executor, callback)    
        // ruleid: kotlin-biometric-authentication
        biometricPrompt.authenticate(promptInfo) // Noncompliant
    }

    public fun compliant1() {
        val biometricPrompt: BiometricPrompt = BiometricPrompt(this, executor, callback)
        val cipher = getCipher()
        val secretKey = getSecretKey()
        cipher.init(Cipher.ENCRYPT_MODE, secretKey)
        // ok: kotlin-biometric-authentication
        biometricPrompt.authenticate(promptInfo,
            BiometricPrompt.CryptoObject(cipher))
    }

    public fun compliant2() {
        val biometricPrompt: BiometricPrompt = BiometricPrompt(activity,        
            executor, callback)
        val sig: Signature = Signature("ECDSAwithSHA1")
        // ok: kotlin-biometric-authentication
        biometricPrompt.authenticate(promptInfo, BiometricPrompt.CryptoObject(sig)) // Compliant
    }

    public fun compliant3() {
        val biometricPrompt: BiometricPrompt = BiometricPrompt(activity,        
            executor, callback)
        val mac: Mac = getMac()
        // ok: kotlin-biometric-authentication
        biometricPrompt.authenticate(promptInfo, BiometricPrompt.CryptoObject(mac)) // Compliant
    }

    fun startBiometricAuthentication(
        activity: AppCompatActivity,
        promptInfo: BiometricPrompt.PromptInfo,
        executor: Executor,
        callback: BiometricPrompt.AuthenticationCallback,
        cipher: Cipher
    ) {
        // Create BiometricPrompt instance
        val biometricPrompt : BiometricPrompt = BiometricPrompt(activity, executor, callback)

        val cryptoObject = BiometricPrompt.CryptoObject(cipher)

        // ok: kotlin-biometric-authentication
        biometricPrompt.authenticate(promptInfo, cryptoObject)
    }

        fun startBiometricAuthentication(
        activity: AppCompatActivity,
        promptInfo: BiometricPrompt.PromptInfo,
        executor: Executor,
        callback: BiometricPrompt.AuthenticationCallback,
        cipher: Cipher
    ) {
        // Create BiometricPrompt instance
        val biometricPrompt = BiometricPrompt(activity, executor, callback)

        // ruleid: kotlin-biometric-authentication
        biometricPrompt.authenticate(promptInfo)
    }
}
