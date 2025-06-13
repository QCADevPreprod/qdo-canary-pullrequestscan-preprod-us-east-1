// Import necessary libraries
import play.api.mvc.EssentialFilter
import play.filters.cors.CORSFilter
import javax.inject.Inject
import play.api.http.DefaultHttpFilters
import play.filters.csrf.CSRFFilter
import play.filters.csrf.contentTypeBlacklist

// Vulnerable case: Bypassing CSRF protection for specific headers
object VulnerableCSRFConfig {
    
  val bypassHeaders = Seq(
    //ruleid: scala-cross-site-request-forgery
    "X-Requested-With" -> "*",
    //ruleid: scala-cross-site-request-forgery
    "Csrf-Token" -> "nocheck"
  )
}

// Non-vulnerable case: Proper CSRF protection without bypassing headers
object NonVulnerableCSRFConfig {
  val protectedHeaders = Seq(
    "X-Requested-With",
    "Csrf-Token"
  )
}

// Vulnerable case: Disabling CSRF filter
class VulnerableFilters @Inject()(corsFilter: CORSFilter) extends DefaultHttpFilters(corsFilter)

// Non-vulnerable case: Enabling CSRF filter
class NonVulnerableFilters @Inject()(corsFilter: CORSFilter, csrfFilter: CSRFFilter) extends DefaultHttpFilters(corsFilter, csrfFilter)

// Vulnerable case: Bypassing CSRF protection for trusted origins
object VulnerableTrustedOriginConfig {
    //ruleid: scala-cross-site-request-forgery
  val bypassCorsTrustedOrigins = true
}

// Non-vulnerable case: Not bypassing CSRF protection for trusted origins
object NonVulnerableTrustedOriginConfig {
    //ok: scala-cross-site-request-forgery
  val bypassCorsTrustedOrigins = false
}

// Vulnerable case: Incorrect content type blacklist
object VulnerableContentTypeConfig {
    //ruleid: scala-cross-site-request-forgery
   contentTypeBlacklist = Seq(
    "text/plain",
    "multipart/form-data",
    "something/weird"
  )
}

// Non-vulnerable case: Proper content type blacklist
object NonVulnerableContentTypeConfig {
    //ok: scala-cross-site-request-forgery
    contentTypeBlacklist = Seq(
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain"
  )
}

// Vulnerable case: Bypassing CSRF protection in configuration
object VulnerableConfig {
  val config = Map(
    //ruleid: scala-cross-site-request-forgery
    "play.filters.csrf.header.bypassHeaders.X-Requested-With" -> "*",
    //ruleid: scala-cross-site-request-forgery
    "play.filters.csrf.header.bypassHeaders.Csrf-Token" -> "nocheck",
    "play.filters.csrf.contentTypeBlackList" -> Seq("text/plain", "multipart/form-data", "something/weird")
  )
}

// Non-vulnerable case: Proper CSRF protection in configuration
object NonVulnerableConfig {
  val config = Map(
    "play.filters.csrf.header.protectHeaders" -> null,
    "play.filters.csrf.bypassCorsTrustedOrigins" -> false,
    "play.filters.csrf.method.whiteList" -> Seq.empty[String],
    "play.filters.csrf.method.blackList" -> Seq("POST"),
    //ok: scala-cross-site-request-forgery
    "play.filters.csrf.contentTypeBlackList" -> Seq("application/x-www-form-urlencoded", "multipart/form-data", "text/plain")
  )
}