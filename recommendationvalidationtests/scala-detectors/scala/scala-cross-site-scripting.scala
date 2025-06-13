import play.api._
import play.api.mvc.{Action, Controller}
import play.twirl.api.Html;
import org.owasp.encoder.Encode
import javax.servlet.ServletException
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.io.IOException
import java.io.PrintWriter
import java.util


class CrossSiteScripting {
    def nonCompliant1(value: String) = Action { implicit request: Request[AnyContent] =>
    // ruleid: scala-cross-site-scripting
    Ok(s"Hello $value !").as("text/html")
    }

    def nonCompliant2(value: String) = Action.async { implicit request: Request[AnyContent] =>
    // ruleid: scala-cross-site-scripting
    Ok("Hello " + value + " !").as("tExT/HtML")
    }

    def nonCompliant3(value: String, contentType: String) = Action { implicit request: Request[AnyContent] =>
    val bodyVals = request.body.asFormUrlEncoded
    val smth = bodyVals.get("username").head
    // ruleid: scala-cross-site-scripting
    Ok(s"Hello $smth !").as(contentType)
    }

    def nonCompliant4(value: String) = Action.async(parse.json) { implicit request: Request[AnyContent] =>
    // ruleid: scala-cross-site-scripting
    Ok("Hello " + value + " !").as(ContentTypes.HTML)
    }

    def nonCompliant5(value: String) = Action(parse.json) {
    // ruleid: scala-cross-site-scripting
    Ok(s"Hello $value !").as(HTML)
    }

    def nonCompliant6(value:String) = Action { implicit request: Request[AnyContent] =>
    // ruleid: scala-cross-site-scripting
    Ok(views.html.xssHtml.render(Html.apply("Hello "+value+" !")))
    }

    def nonCompliant7(value:String) = Action {
    // ruleid: scala-cross-site-scripting
    Ok(views.html.xssHtml.render(Html.apply("Hello "+value+" !")))
    }

    def compliant1(value: String) = Action.async { implicit request: Request[AnyContent] =>
    // ok: scala-cross-site-scripting
    Ok("Hello " + value + " !").as("text/json")
    }

    def compliant2(value:String) = Action {
    // ok: scala-cross-site-scripting
    Ok(views.html.template.render(value))
    }

    def compliant3(value: String) = Action { implicit request: Request[AnyContent] =>
    // ok: scala-cross-site-scripting
    Ok("Hello "+value+" !")
    // ok: scala-cross-site-scripting
    Ok(s"Hello $value !").as("text/json")
    // ok: scala-cross-site-scripting
    Ok("<b>Hello !</b>").as("text/html")
    // ok: scala-cross-site-scripting
    Ok(views.html.xssHtml.render(Html.apply("<b>Hello !</b>")))

    val escapedValue = org.apache.commons.lang3.StringEscapeUtils.escapeHtml4(value)
    // ok: scala-cross-site-scripting
    Ok("Hello " + escapedValue + " !")
    // ok: scala-cross-site-scripting
    Ok("Hello " + escapedValue + " !").as("text/html")

    val owaspEscapedValue = org.owasp.encoder.Encode.forHtml(value)
    // ok: scala-cross-site-scripting
    Ok("Hello " + owaspEscapedValue + " !")
    // ok: scala-cross-site-scripting
    Ok("Hello " + owaspEscapedValue + " !").as("text/html")
    }

    def nonCompliant8(value: String) =  Action{
    // ruleid: scala-cross-site-scripting
    Ok(value)
    }

    def nonCompliant9(value: String) = Action {
    // ruleid: scala-cross-site-scripting
    Ok(value + "test")
    }

    def compliant4(value: String) =  Action{
    val encoded = Encode.forHtml(value)
    // ok: scala-cross-site-scripting
    Ok(encoded)
    }

    def compliant5(value: String) =  Action{
    val encoded = Encode.forHtml(value + "test")
    // ok: scala-cross-site-scripting
    Ok(encoded + "test")
    }

    @throws[ServletException]
    @throws[IOException]
    protected def nonCompliant10(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input1 = req.getParameter("input1")
    // ruleid: scala-cross-site-scripting
    resp.getWriter.write(input1) // BAD

    }

    @throws[ServletException]
    @throws[IOException]
    override protected def nonCompliant11(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input1 = req.getParameter("input1") // BAD
    val sessionId = req.getRequestedSessionId
    val queryString = req.getQueryString
    val referrer = req.getHeader("Referer") //Should have a higher priority
    if (referrer != null && referrer.startsWith("http://company.ca")) { // Header access
        val host = req.getHeader("Host")
        val referer = req.getHeader("Referer")
        val userAgent = req.getHeader("User-Agent")
    }
    val writer = resp.getWriter
    // ruleid: scala-cross-site-scripting
    writer.write(input1)
    }

    @throws[ServletException]
    @throws[IOException]
    protected def nonCompliant12(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input1 = req.getParameter("input1")
    val map = req.getParameterMap
    val vals = req.getParameterValues("input2")
    val names = req.getParameterNames
    val contentType = req.getContentType
    val serverName = req.getServerName
    // ruleid: scala-cross-site-scripting
    resp.getWriter.write(input1)
    }

    @throws[ServletException]
    @throws[IOException]
    protected def compliant6(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input1 = req.getParameter("input1")
    val writer = resp.getWriter
    // ok: scala-cross-site-scripting
    writer.write(Encode.forHtml(input1)) // OK
    }

    @throws[ServletException]
    @throws[IOException]
    protected def compliant7(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input1 = req.getParameter("input1")
    val writer = resp.getWriter
    // ok: scala-cross-site-scripting
    writer.write(Encode.forHtml(input1))
    }

}
