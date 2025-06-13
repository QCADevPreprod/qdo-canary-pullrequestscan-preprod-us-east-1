import android.webkit.WebView

public class JavaScriptEnabled {

    fun noncompliant1() {
      val webView: WebView = findViewById(R.id.webview)
      // ruleid: kotlin-webviews-security
      webView.getSettings().setJavaScriptEnabled(true) // Sensitive

    }

    fun noncompliant2() {
      val myWebView: WebView = findViewById(R.id.webview)
      // ruleid: kotlin-webviews-security
      myWebView.settings.javaScriptEnabled = true // Sensitive
    }

    fun noncompliant3() {
      val myWebView: WebView = findViewById(R.id.webview)
      val webSettings = myWebView.settings
      // ruleid: kotlin-webviews-security
      webSettings.setJavaScriptEnabled(true); // Sensitive
    }

    fun noncompliant4() {
      val webView: WebView = findViewById(R.id.webview)
      // ruleid: kotlin-webviews-security
      webView.getSettings().setAllowContentAccess(true) // Sensitive
      // ruleid: kotlin-webviews-security
      webView.getSettings().setAllowFileAccess(true) // Sensitive
    }

    fun noncompliant5() {
      val webView: WebView = findViewById(R.id.webview)
      val webSettings = myWebView.settings
      // ruleid: kotlin-webviews-security
      webSettings.setAllowContentAccess(true) // Sensitive
      // ruleid: kotlin-webviews-security
      webSettings.setAllowFileAccess(true) // Sensitive
    }


    fun compliant1() {
      val webView: WebView = findViewById(R.id.webview)
      // ok: kotlin-webviews-security
      webView.getSettings().setJavaScriptEnabled(false)

    }

    fun compliant2() {
      val myWebView: WebView = findViewById(R.id.webview)
      // ok: kotlin-webviews-security
      myWebView.settings.javaScriptEnabled = false
    }

    fun compliant3() {
      val myWebView: WebView = findViewById(R.id.webview)
      val webSettings = myWebView.settings
      // ok: kotlin-webviews-security
      webSettings.setJavaScriptEnabled(false);     
    }

    fun compliant4() {
      val webView: WebView = findViewById(R.id.webview)
      // ok: kotlin-webviews-security
      webView.getSettings().setAllowContentAccess(false) 
      // ok: kotlin-webviews-security
      webView.getSettings().setAllowFileAccess(false)
    }

    fun compliant5() {
      val webView: WebView = findViewById(R.id.webview)
      val webSettings = myWebView.settings
      // ok: kotlin-webviews-security
      webSettings.setAllowContentAccess(false) 
      // ok: kotlin-webviews-security
      webSettings.setAllowFileAccess(false)
    }


}
