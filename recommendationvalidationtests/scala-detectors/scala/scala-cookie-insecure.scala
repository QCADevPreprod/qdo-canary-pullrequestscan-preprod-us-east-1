import play.api.mvc.{Cookie => PlayCookie, _}
import javax.servlet.http.{Cookie => ServletCookie, HttpServletResponse}
import akka.http.scaladsl.model.headers.HttpCookie
import akka.http.scaladsl.model.headers.Cookie
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import javax.inject.Inject

class CookieManager @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def danger(res: HttpServletResponse, name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Unit = {
    // ruleid: scala-cookie-insecure
    val cookie = new Cookie("key", "value")
    cookie.setSecure(false) // Non-compliant
    cookie.setMaxAge(60)
    cookie.setHttpOnly(true)
    res.addCookie(cookie)
  }

  // cookie.setSecure(true) is missing
  def danger2(res: HttpServletResponse, name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Unit = {
    // ruleid: scala-cookie-insecure
    val cookie = new Cookie("key", "value")
    cookie.setMaxAge(60)
    res.addCookie(cookie)
  }

  def safer(res: HttpServletResponse, name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Unit = {
    // ok: scala-cookie-insecure
    val cookie = new Cookie("key", "value")
    cookie.setSecure(true) // Compliant
    cookie.setMaxAge(60)
    cookie.setHttpOnly(true)
    res.addCookie(cookie)
  }

  def setPlayCookie(name: String, value: String, secure: Boolean = false, maxAge: Int = 60): Action[AnyContent] = Action {
    // ruleid: scala-cookie-insecure
    Ok("Cookie set!").withCookies(PlayCookie(name, value, maxAge = Some(maxAge), secure = secure, httpOnly = false))
  }

  def setSafePlayCookie(name: String, value: String, secure: Boolean = true, maxAge: Int = 60): Action[AnyContent] = Action {
    // ok: scala-cookie-insecure
    Ok("Cookie set!").withCookies(PlayCookie(name, value, maxAge = Some(maxAge), secure = true, httpOnly = true))
  }

  // Method for Akka HTTP-based environment
  def setAkkaHttpCookie(name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Route =
    path("setCookie") {
      // ruleid: scala-cookie-insecure
      setCookie(HttpCookie(name, value)) {
        complete("Cookie set!")
      }
    }

  // Method for Akka HTTP-based environment
  def setAkkaHttpCookie(name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Route =
    path("setCookie") {
      // ok: scala-cookie-insecure
      setCookie(HttpCookie(name, value, secure = secure)) {
        complete("Cookie set!")
      }
    }

  def setCookie(name: String, value: String, secure: Boolean = false, maxAge: Int = 60): Action[AnyContent] = Action {
    // ruleid: scala-cookie-insecure
    val cookie = Cookie(name, value, secure = secure)
    Ok("Cookie set!").withCookies(cookie)
  }

  def setCookie1(name: String, value: String, secure: Boolean = false, maxAge: Int = 60): Action[AnyContent] = Action {
    // ok: scala-cookie-insecure
    val cookie = Cookie(name, value, secure = true)
    Ok("Cookie set!").withCookies(cookie)
  }

  def setHttpCookie1(name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Route =
    path("setCookie") {
    // ok: scala-cookie-insecure
    setCookie(HttpCookie(name, value, secure = true)) {
        complete("Cookie set!")
      }
  }

  def setCookie2(name: String, value: String, secure: Boolean = false, maxAge: Int = 60): Action[AnyContent] = Action {
    // ruleid: scala-cookie-insecure
    val cookie = Cookie(name, value, secure = false)
    Ok("Cookie set!").withCookies(cookie)
  }

  def setHttpCookie1(name: String, value: String, secure: Boolean = true, maxAge: Int = 60, httpOnly: Boolean = true): Route =
    path("setCookie") {
    // ruleid: scala-cookie-insecure
    setCookie(HttpCookie(name, value, secure = false)) {
        complete("Cookie set!")
      }
  }

}
