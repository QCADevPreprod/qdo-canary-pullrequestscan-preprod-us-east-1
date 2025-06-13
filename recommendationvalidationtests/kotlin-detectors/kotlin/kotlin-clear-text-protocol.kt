import android.webkit.WebView
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPSClient;
import org.apache.commons.net.smtp.SMTPClient;
import org.apache.commons.net.smtp.SMTPSClient;
import org.apache.commons.net.telnet.TelnetClient;
import okhttp3.ConnectionSpec;

public class ClearTextProtocolTestCases {

    fun noncompliant1() {
        // ruleid: kotlin-clear-text-protocol
        val ftpClient = FTPClient(); // Sensitive
    }

    fun noncompliant2() {
        // ruleid: kotlin-clear-text-protocol
        val telnet = TelnetClient(); // Sensitive
    }

    fun noncompliant3() {
        // ruleid: kotlin-clear-text-protocol
        val smtpClient = SMTPClient(); // Sensitive
    }

    fun noncompliant4() {
        // ruleid: kotlin-clear-text-protocol
        val spec: ConnectionSpec = ConnectionSpec.Builder(ConnectionSpec.CLEARTEXT) // Sensitive
        .build()
    }

    fun noncompliant5() {
      val webView: WebView = findViewById(R.id.webview)
      // ruleid: kotlin-clear-text-protocol
      webView.getSettings().setMixedContentMode(MIXED_CONTENT_ALWAYS_ALLOW) // Sensitive
    }

    fun compliant1() {
        // ok: kotlin-clear-text-protocol
        val ftpsClient = FTPSClient(true);
    }

    fun noncompliant2() {
      // ok: kotlin-clear-text-protocol
        val ssh = SSHClient()
    }

    fun compliant3() {
        // ok: kotlin-clear-text-protocol
        val smtpsClient = SMTPSClient(true);
    }

    fun compliant4() {
        // ok: kotlin-clear-text-protocol
        val spec: ConnectionSpec = ConnectionSpec.Builder(ConnectionSpec.MODERN_TLS)
        .build()
    }

    fun compliant5() {
        val webView: WebView = findViewById(R.id.webview)
        // ok: kotlin-clear-text-protocol
        webView.getSettings().setMixedContentMode(MIXED_CONTENT_NEVER_ALLOW)
    }

}
