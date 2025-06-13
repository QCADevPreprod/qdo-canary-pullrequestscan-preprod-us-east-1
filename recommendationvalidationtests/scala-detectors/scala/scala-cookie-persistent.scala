import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletResponse

class CookiePersistent {
  def danger(res: HttpServletResponse): Unit = {
    val cookie = new Cookie("key", "value")
    cookie.setSecure(true)
    cookie.setHttpOnly(true)
    // ruleid: scala-cookie-persistent
    cookie.setMaxAge(31536000) // danger

    res.addCookie(cookie)
  }

  def safe(res: HttpServletResponse): Unit = {
    // ok: scala-cookie-persistent
    val cookie = new Cookie("key", "value")
    cookie.setSecure(true)
    cookie.setHttpOnly(true)
    res.addCookie(cookie)
  }

  def safe2(res: HttpServletResponse): Unit = {
    // ok: scala-cookie-persistent
    val cookie = new Cookie("key", "value")
    cookie.setMaxAge(604800) // Max age set to one week
    cookie.setSecure(true)
    cookie.setHttpOnly(true)
    res.addCookie(cookie)
  }
}