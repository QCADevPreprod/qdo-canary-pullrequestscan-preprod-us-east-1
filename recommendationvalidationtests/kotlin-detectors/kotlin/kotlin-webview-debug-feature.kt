import android.webkit.WebView

public class DebugFeature {
    
    fun noncompliant1() {
      // ruleid:kotlin-webview-debug-feature
      WebView.setWebContentsDebuggingEnabled(true) // Sensitive
    }

    fun noncompliant2() {
      val webView = findViewById<WebView>(R.id.webView)
      // Enabling WebView debugging in production can expose sensitive information
      webView.settings.setJavaScriptEnabled(true)
      // ruleid:kotlin-webview-debug-feature
      WebView.setWebContentsDebuggingEnabled(true)
    }

    fun compliant1() {
      // ok:kotlin-webview-debug-feature
      WebView.setWebContentsDebuggingEnabled(false)
    }

    fun compliant2() {
      val webView = findViewById<WebView>(R.id.webView)
      webView.settings.setJavaScriptEnabled(false)
      // ok:kotlin-webview-debug-feature
      WebView.setWebContentsDebuggingEnabled(false)
    }

    fun compliant3() {
      // ok:kotlin-webview-debug-feature
      if (0 != (getApplicationInfo().flags && ApplicationInfo.FLAG_DEBUGGABLE)) {
        WebView.setWebContentsDebuggingEnabled(true);
      }
    }

}
