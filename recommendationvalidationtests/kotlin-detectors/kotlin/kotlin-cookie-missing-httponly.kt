public class CookieController {
    
    public fun noncompliant1(value: String, response: HttpServletResponse) {
        val cookie: Cookie = Cookie("cookie", value)
        // ruleid: kotlin-cookie-missing-httponly
        response.addCookie(cookie)
    }

    public fun noncompliant2(value: String, response: HttpServletResponse) {
        val cookie: Cookie = Cookie("cookie", value)
        cookie.setSecure(true)
        // ruleid: kotlin-cookie-missing-httponly
        response.addCookie(cookie)
    }

    public fun noncompliant3(value: String, response: HttpServletResponse) {
        val cookie: Cookie = Cookie("cookie", value)
        cookie.setSecure(false)
        cookie.setHttpOnly(false)
        // ruleid: kotlin-cookie-missing-httponly
        response.addCookie(cookie)
    }

    public fun noncompliant4(value: String, response: HttpServletResponse) {
        val cookie: Cookie = Cookie("cookie", value)
        cookie.setHttpOnly(false)
        // ruleid: kotlin-cookie-missing-httponly
        response.addCookie(cookie)
    }

    public fun compliant1(value: String, response: HttpServletResponse ) {
        val cookie: Cookie = Cookie("cookie", value)
        cookie.setSecure(true)
        cookie.setHttpOnly(true)
        // ok: kotlin-cookie-missing-httponly
        response.addCookie(cookie)
    }

    public fun compliant2(value: String, response: HttpServletResponse) {
        val cookie: Cookie = Cookie("cookie", value)
        cookie.setHttpOnly(true)
        // ok: kotlin-cookie-missing-httponly
        response.addCookie(cookie)
    }

    public fun compliant3(value: String, response: HttpServletResponse) {
        val cookie: Cookie = Cookie("cookie", value)
        cookie.setSecure(true)
        cookie.setHttpOnly(true)
        // ok: kotlin-cookie-missing-httponly
        response.addCookie(cookie)
    }

    public fun compliant4(value: String, response: HttpServletResponse) {
        val cookie: Cookie = Cookie("cookie", value)
        cookie.setHttpOnly(true)
        // ok: kotlin-cookie-missing-httponly
        response.addCookie(cookie)
    }

    private fun compliant5(response: HttpServletResponse) {
        val tokenCookie = Cookie(PRIVATE_TOKEN_NAME, "")
        tokenCookie.path = "/"
        tokenCookie.isHttpOnly = true
        tokenCookie.maxAge = 0
        // ok: kotlin-cookie-missing-httponly
        response.addCookie(tokenCookie)
    }

}
