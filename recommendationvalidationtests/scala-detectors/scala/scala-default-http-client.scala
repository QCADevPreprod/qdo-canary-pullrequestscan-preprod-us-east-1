import org.apache.http.client.HttpClient
import org.apache.http.client.methods.HttpGet
import org.apache.http.client.methods.HttpUriRequest
import org.apache.http.impl.client.DefaultHttpClient
import java.io.IOException


class DefaultHTTPClient {
  @throws[IOException]
  def danger(): Unit = {
    // ruleid: scala-default-http-client
    val client = new DefaultHttpClient
    val request = new HttpGet("https://test.com")
    client.execute(request)
  }
}