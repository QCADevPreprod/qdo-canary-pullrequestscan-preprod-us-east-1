import play.api.mvc.{Cookie => PlayCookie, _}
import javax.servlet.http.{Cookie => ServletCookie, HttpServletResponse}
import akka.http.scaladsl.model.headers.HttpCookie
import akka.http.scaladsl.model.headers.Cookie
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import javax.inject.Inject

class CookieManager @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def danger(res: HttpServletResponse, name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Unit = {
    // ruleid: scala-cookie-http-only
    val cookie = new Cookie("key", "value")
    cookie.setSecure(true)
    cookie.setMaxAge(60)
    cookie.setHttpOnly(false) // Non-compliant
    res.addCookie(cookie)
  }

  // cookie.setHttpOnly(true) is missing
  def danger2(res: HttpServletResponse, name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Unit = {
    // ruleid: scala-cookie-http-only
    val cookie = new Cookie("key", "value")
    cookie.setSecure(true)
    cookie.setMaxAge(60)
    res.addCookie(cookie)
  }

  def safer(res: HttpServletResponse, name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Unit = {
    // ok: scala-cookie-http-only
    val cookie = new Cookie("key", "value")
    cookie.setSecure(true)
    cookie.setMaxAge(60)
    cookie.setHttpOnly(true) // Compliant
    res.addCookie(cookie)
  }

  def setPlayCookie(name: String, value: String, secure: Boolean = true, maxAge: Int = 60): Action[AnyContent] = Action {
    // ruleid: scala-cookie-http-only
    Ok("Cookie set!").withCookies(PlayCookie(name, value, maxAge = Some(maxAge), secure = secure, httpOnly = false))
  }

  def setSafePlayCookie(name: String, value: String, secure: Boolean = true, maxAge: Int = 60): Action[AnyContent] = Action {
    // ok: scala-cookie-http-only
    Ok("Cookie set!").withCookies(PlayCookie(name, value, maxAge = Some(maxAge), secure = secure, httpOnly = true))
  }

  // Method for Akka HTTP-based environment
  def setAkkaHttpCookie(name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Route =
    path("setCookie") {
      // ok: scala-cookie-http-only
      setCookie(HttpCookie(name, value, httpOnly = httpOnly)) {
        complete("Cookie set!")
      }
    }

}