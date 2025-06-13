import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import org.springframework.web.bind.annotation.RequestParam

public class CookieController {
    public fun noncompliant1(value: String, response: HttpServletResponse) {
        var cookie: Cookie = Cookie("cookie", value)
        // ruleid:kotlin-cookie-missing-secure-flag
        response.addCookie(cookie)
    }

    public fun noncompliant2(@RequestParam value: String, response: HttpServletResponse) {
       var cookie: Cookie = Cookie("cookie", value)
        cookie.setSecure(false)
        cookie.setHttpOnly(false)
        // ruleid:kotlin-cookie-missing-secure-flag
        response.addCookie(cookie)
    }

    public fun compliant1(@RequestParam value: String, response: HttpServletResponse) {
       var cookie: Cookie = Cookie("cookie", value)
        cookie.setSecure(true)
        // ok:kotlin-cookie-missing-secure-flag
        response.addCookie(cookie)
    }

    public fun compliant2(@RequestParam value: String, response: HttpServletResponse) {
       var cookie: Cookie = Cookie("cookie", value)
        cookie.setSecure(true)
        cookie.setHttpOnly(true)
        // ok:kotlin-cookie-missing-secure-flag
        response.addCookie(cookie)
    }

    public fun compliant3(name: String, value: String, expiration: int, httpOnly: boolean) {
    var existingCookie: Cookie = HttpRequest.getCookie(request.getCookies(), name)
    if (existingCookie != null) {
      if (Constant.cookiePath.equals(existingCookie.getPath())
          || existingCookie.getPath() == null // in some cases cookies set on path '/' are returned with a null path
          ) {
        // update existing cookie
        existingCookie.setPath(Constant.cookiePath)
        existingCookie.setValue(value)
        existingCookie.setMaxAge(expiration)
        if (Constant.cookieHttpOnly) {
          setHttpOnly(existingCookie)
        }
        existingCookie.setSecure(Constant.cookieSecure)
        if (Constant.cookieDomain != null) {
          existingCookie.setDomain(Constant.cookieDomain)
        }
        // ok:kotlin-cookie-missing-secure-flag
        response.addCookie(existingCookie)
      } else {
        // we have an existing cookie on another path: clear it, and add a new cookie on root path
        existingCookie.setValue("")
        existingCookie.setMaxAge(0)

        // ok:kotlin-cookie-missing-secure-flag
        response.addCookie(existingCookie)

        var c: Cookie = Cookie(name, value)
        c.setPath(Constant.cookiePath)
        c.setMaxAge(expiration)
        if (Constant.cookieHttpOnly) {
          setHttpOnly(existingCookie)
        }
        c.setSecure(Constant.cookieSecure)
        if (Constant.cookieDomain != null) {
          c.setDomain(Constant.cookieDomain)
        }

        // ok:kotlin-cookie-missing-secure-flag
        response.addCookie(c)

      }
    } else {
      var c: Cookie = Cookie(name, value)
      c.setPath(Constant.cookiePath)
      c.setMaxAge(expiration)
      if (Constant.cookieHttpOnly) {
        setHttpOnly(c)
      }
      c.setSecure(Constant.cookieSecure)
      if (Constant.cookieDomain != null) {
        c.setDomain(Constant.cookieDomain)
      }

      // ok:kotlin-cookie-missing-secure-flag
      response.addCookie(c)
    }
    return this
  }

  public fun compliant4(cookie: String) {
    var existingCookie: Cookie = HttpRequest.getCookie(request.getCookies(), cookie)
    if (existingCookie != null) {
      existingCookie.setPath(Constant.cookiePath)
      existingCookie.setValue("")
      existingCookie.setMaxAge(0)
      // ok:kotlin-cookie-missing-secure-flag
      response.addCookie(existingCookie)
    }
    return this
  }

}
