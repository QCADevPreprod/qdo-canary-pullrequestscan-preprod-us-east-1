import javax.servlet.ServletException
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.io.IOException

class CookieUsage {
  @Override
  @throws[ServletException]
  @throws[IOException]
  protected def doGet(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    for (cookie <- req.getCookies) {
      // ruleid: scala-cookie-usage
      cookie.getName
      // ruleid: scala-cookie-usage
      cookie.getValue
      // ruleid: scala-cookie-usage
      cookie.getPath
    }
  }

  def getCookieName(req: HttpServletRequest) = {
    val c: Cookie = req.getCookies.head
    // ok: scala-cookie-usage
    c.getName
  }
}