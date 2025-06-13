import javax.servlet.ServletException
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.io.IOException
import java.util


class InsecureServlet extends HttpServlet {

  @throws[ServletException]
  @throws[IOException]
  override protected def nonCompliant1(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    useParameters(req)
    // ruleid: scala-insecure-servlet-handling
    resp.getWriter.print("<!--" + req.getContentType + "-->")
    // ruleid: scala-insecure-servlet-handling
    resp.getWriter.print("<!--" + req.getQueryString + "-->")
    val referrer = req.getHeader("Referer") //Should have a higher priority
    if (referrer != null && referrer.startsWith("http://company.ca")) {
      req.getHeader("Host")
      req.getHeader("User-Agent")
      req.getHeader("X-Requested-With")
    }
  }

  @throws[ServletException]
  @throws[IOException]
  override protected def nonCompliant2(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    useParameters(req)
    // ruleid: scala-insecure-servlet-handling
    resp.getWriter.print("<h1>Welcome to " + req.getServerName)
    // ruleid: scala-insecure-servlet-handling
    resp.getWriter.print("<!--" + req.getQueryString + "-->")
    val referrer = req.getHeader("Referer") //Should have a higher priority
    if (referrer != null && referrer.startsWith("http://company.ca")) {
      req.getHeader("Host")
      req.getHeader("User-Agent")
      req.getHeader("X-Requested-With")
    }
  }

 @throws[ServletException]
 @throws[IOException]
  override protected def nonCompliant3(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    useParameters(req)
    // ruleid: scala-insecure-servlet-handling
    val sqlQuery = "UPDATE sessions(last_visit) VALUES(now()) WHERE where sid = '" + req.getRequestedSessionId + "')"
    // ruleid: scala-insecure-servlet-handling
    resp.getWriter.print("<!--" + req.getQueryString + "-->")
    val referrer = req.getHeader("Referer") //Should have a higher priority
    if (referrer != null && referrer.startsWith("http://company.ca")) {
      req.getHeader("Host")
      req.getHeader("User-Agent")
      req.getHeader("X-Requested-With")
    }
  }

 @throws[ServletException]
 @throws[IOException]
 override def noncompliant4(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    val inputParam = request.getParameter("param")
    // No input validation or sanitization
    // ruleid: scala-insecure-servlet-handling
    response.getWriter.println(s"User input: $inputParam")
  }

 @throws[ServletException]
 @throws[IOException]
 override def compliant1(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    val inputParam = request.getParameter("param")
    if (inputParam != null && !inputParam.isEmpty && inputParam.matches("[a-zA-Z0-9]+")) {
      // Sanitize the input using Encode.forHtml
      val sanitizedParam = Encode.forHtml(inputParam)
      // Use the sanitizedParam safely
      // ok: scala-insecure-servlet-handling
      response.getWriter.println(s"Sanitized input: $sanitizedParam")
    } else {
      response.getWriter.println("Invalid input")
    }
  }

  @throws[ServletException]
  @throws[IOException]
  override protected def compliant2(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val inputParam = req.getParameter("param")
    if (inputParam != null && !inputParam.isEmpty && isValidInput(inputParam)) {
      // Sanitize the input using StringEscapeUtils.escapeHtml4
      val sanitizedParam = StringEscapeUtils.escapeHtml4(inputParam)
      // Use the sanitizedParam safely
      // ok: scala-insecure-servlet-handling
      resp.getWriter.println(s"Sanitized input: $sanitizedParam")
    } else {
      resp.getWriter.println("Invalid input")
    }
  }

  private def isValidInput(input: String): Boolean = {
    // Add your custom validation logic here
    // For example, check if the input contains only alphanumeric characters
    input.matches("[a-zA-Z0-9]+")
  }

  private def useParameters(req: HttpServletRequest): Unit = {
    val username = req.getParameter("username").asInstanceOf[String]
    val roles = req.getParameterValues("roles").asInstanceOf[Array[String]]
    val price = req.getParameterMap.get("hidden_price_value")
    val parameters = req.getParameterNames
    var isAdmin = false
    while ( {
      parameters.hasMoreElements
    }) if (parameters.nextElement.equals("admin_mode")) {
      isAdmin = true
    }
  }

  @Context
  var http_request: HttpServletRequest = null

  def requested_uri = {
    val query = http_request.getQueryString
    // ok: scala-insecure-servlet-handling
    http_request.getRequestURI + Option(query).map("?"+_).getOrElse("")
  }

  override def rewriteTarget(request: HttpServletRequest): String = {
    val requestURL = request.getRequestURL
    val requestURI = request.getRequestURI
    var targetURL = "/no-ui-error"
    extractTargetAddress(requestURI).foreach { case (host, port) =>
      val targetURI = requestURI.stripPrefix(s"/engine-ui/$host:$port") match {
        // for some reason, the proxy can not handle redirect well, as a workaround,
        // we simulate the Spark UI redirection behavior and forcibly rewrite the
        // empty URI to the Spark Jobs page.
        case "" | "/" => "/jobs/"
        case path => path
      }
      val targetQueryString =
        Option(request.getQueryString).filter(StringUtils.isNotEmpty).map(q => s"?$q").getOrElse("")
      // ok: scala-insecure-servlet-handling
      targetURL = new URL("http", host, port, targetURI + targetQueryString).toString
    }
    debug(s"rewrite $requestURL => $targetURL")
    targetURL
  }

  def javaUtilLogging(req: HttpServletRequest): Unit = {
    val tainted = req.getParameter("test")
    var encoded = tainted.replace("\r", "").toUpperCase
    // ok: scala-insecure-servlet-handling
    encoded = "safe" + encoded.toLowerCase
    logger.warning(encoded.replace("\n", " (new line)"))
    logger.fine(tainted.replaceAll("[\r\n]+", ""))
  }

  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    try {
      val item = request.getParameter("item")
      //in HttpClient 4.x, there is no GetMethod anymore. Instead there is HttpGet
      // ok: scala-insecure-servlet-handling
      val httpget = new HttpGet("http://host.com?param=" + URLEncoder.encode(item)) //OK
    } catch {
      case e: Exception =>
        System.out.println(e)
    }
  }

  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    try {
      val item = request.getParameter("item")
      //in HttpClient 4.x, there is no GetMethod anymore. Instead there is HttpGet
      // ok: scala-insecure-servlet-handling
      val httpget = new HttpGet("http://host.com?param=" + URLEncoder.encode(item)) //OK
      // ruleid: scala-insecure-servlet-handling
      val httpget2 = new HttpGet("http://host.com?param=" + item) //BAD
      // ok: scala-insecure-servlet-handling
      val httpget3 = new HttpGet("http://host.com?param=" + urlPathSegmentEscaper().escape(item))
      // ruleid: scala-insecure-servlet-handling
      val get = new GetMethod("http://host.com?param=" + item)
      // ruleid: scala-insecure-servlet-handling
      get.setQueryString("item=" + item) //BAD
    } catch {
      case e: Exception =>
        System.out.println(e)
    }
  }
}