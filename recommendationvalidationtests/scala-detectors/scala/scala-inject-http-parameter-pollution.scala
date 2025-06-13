package inject

import org.apache.commons.httpclient.methods.GetMethod
import org.apache.http.client.methods.HttpGet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.io.IOException
import java.net.URLEncoder
import com.google.common.net.UrlEscapers.urlPathSegmentEscaper


class HttpParameterPollution extends HttpServlet {
  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    try {
      val item = request.getParameter("item")
      //in HttpClient 4.x, there is no GetMethod anymore. Instead there is HttpGet
      // ok:scala-inject-http-parameter-pollution 
      val httpget = new HttpGet("http://host.com?param=" + URLEncoder.encode(item)) //OK
   
      // ruleid: scala-inject-http-parameter-pollution
      val httpget2 = new HttpGet("http://host.com?param=" + item) //BAD

      // ok:scala-inject-http-parameter-pollution
      val httpget3 = new HttpGet("http://host.com?param=" + urlPathSegmentEscaper().escape(item))

      // ruleid: scala-inject-http-parameter-pollution
      val get = new GetMethod("http://host.com?param=" + item)

      // ok: scala-inject-http-parameter-pollution
      val get = new GetMethod("http://host.com?param=" + URLEncoder.encode(item))

      // ruleid: scala-inject-http-parameter-pollution
      get.setQueryString("item=" + item) //BAD

      // ok: scala-inject-http-parameter-pollution
      get.setQueryString("item=" + URLEncoder.encode(item))

    } catch {
      case e: Exception =>
        System.out.println(e)
    }
  }
}