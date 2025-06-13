package testcode.crypto

import java.io.UnsupportedEncodingException
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException

public class EncryptFile {
   
    public fun compliant1(password: String): String {
        val mainKey = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)

        val encryptedFile = EncryptedFile.Builder(
            File(activity.filesDir, "data.txt"),
            activity,
            mainKey,
            EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
        ).build()

        encryptedFile.openFileOutput().apply {
            // ok : kotlin-unencrypted-files-in-app
            write(fileContent)
            flush()
            close()
        }
    }

    fun compliant2(context: Context, inputFile: File, encryptedFile: File) {
        val mainKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

        val encryptedFile = EncryptedFile.Builder(
            context,
            inputFile,
            encryptedFile,
            mainKey,
            EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
        ).build()

        inputFile.inputStream().use { inputStream ->
        // ok : kotlin-unencrypted-files-in-app
            encryptedFile.openFileOutput().use { outputStream ->
                inputStream.copyTo(outputStream)
            }
        }
    }

    
    public fun nonCompliant1(password: String): String {
        val targetFile = File(activity.filesDir, "data.txt")
        // ruleid : kotlin-unencrypted-files-in-app
        targetFile.writeText(fileContent)  // Sensitive
    }

    
    public fun nonCompliant2(password: String): String {
        val targetFile = File(activity.filesDir, "data.txt")
        // ruleid : kotlin-unencrypted-files-in-app
        targetFile.appendText(fileContent)  // Sensitive
    }
}