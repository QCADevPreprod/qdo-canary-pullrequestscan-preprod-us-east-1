import org.apache.http.Header
import org.apache.http.HttpResponse
import org.apache.http.client.HttpClient
import org.apache.http.client.methods.HttpGet
import org.apache.http.client.methods.HttpPost
import org.apache.http.impl.client.DefaultHttpClient

public class DeprecatedHttpClient {

    public fun noncompliant1(args: Array<String>): Void {
        // ruleid: kotlin-defaulthttpclient-deprecated
        val client: HttpClient = DefaultHttpClient()
        val request: HttpGet = HttpGet("http://google.com")
        val response: HttpResponse= client.execute(request)
    }

    public fun noncompliant2(url: String) { 
        // ruleid: kotlin-defaulthttpclient-deprecated
        val client = DefaultHttpClient()
        val request = HttpGet(url)
        val response = client.execute(request)
    }

    public fun noncompliant3(url: String, data: String) { 
        // ruleid: kotlin-defaulthttpclient-deprecated
        val client = DefaultHttpClient()
        val request = HttpPost(url)
        val response = client.execute(request)
    }


    public fun compliant1(args: Array<String>): Void {
        // ok: kotlin-defaulthttpclient-deprecated
        val client: HttpClient = SystemDefaultHttpClient()
        val request: HttpGet = HttpGet("http://google.com")
        val response: HttpResponse= client.execute(request)
    }

    public fun compliant2(url: String) { 
        // ok: kotlin-defaulthttpclient-deprecated
        val client = SystemDefaultHttpClient()
        val request = HttpGet(url)
        val response = client.execute(request)
    }

    public fun compliant3(url: String) { 
        // ok: kotlin-defaulthttpclient-deprecated
        val client = SystemDefaultHttpClient()
        val request = HttpPost(url)
        val response = client.execute(request)
    }

}
