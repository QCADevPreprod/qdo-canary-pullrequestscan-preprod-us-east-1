import javax.servlet.ServletException
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.io.IOException

class PermissiveCORS extends HttpServlet {
  override protected def doGet(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    falsePositiveCORS(resp)
    resp.getWriter.print(req.getSession.getAttribute("secret"))
  }

  private def falsePositiveCORS(resp: HttpServletResponse): Unit = {
    // ok: scala-permissive-cors
    resp.addHeader("Access-Control-Allow-Origin", "http://example.com") // OK
  }

  // Overly permissive Cross-domain requests accepted
  def addPermissiveCORS(resp: HttpServletResponse): Unit = {
    // ruleid: scala-permissive-cors
    resp.addHeader("Access-Control-Allow-Origin", "*") // BAD

  }

  def addPermissiveCORS2(resp: HttpServletResponse): Unit = {
    // ruleid: scala-permissive-cors
    resp.addHeader("access-control-allow-origin", "*")
  }

  def addWildcardsCORS(resp: HttpServletResponse): Unit = {
    // ruleid: scala-permissive-cors
    resp.addHeader("Access-Control-Allow-Origin", "*.example.com")
  }

  def addNullCORS(resp: HttpServletResponse): Unit = {
    // ruleid: scala-permissive-cors
    resp.addHeader("Access-Control-Allow-Origin", "null")
  }

  def setPermissiveCORS(resp: HttpServletResponse): Unit = {
    //ruleid: scala-permissive-cors
    resp.setHeader("Access-Control-Allow-Origin", "*")
  }

  def setPermissiveCORSWithRequestVariable(resp: HttpServletResponse, req: HttpServletRequest): Unit = {
    // ruleid: scala-permissive-cors
    resp.setHeader("Access-Control-Allow-Origin", req.getParameter("tainted"))
  }

  def setPermissiveCORSWithRequestVariable2(resp: HttpServletResponse, req: HttpServletRequest): Unit = {
    val header = req.getParameter("tainted")
    // ruleid: scala-permissive-cors
    resp.addHeader("access-control-allow-origin", header)
  }

  @throws[ServletException]
  @throws[IOException]
  override protected def doOptions(req: HttpServletRequest, resp: HttpServletResponse): Unit = { // BAD
    val tainted = req.getParameter("input")
    resp.setHeader("test", tainted)
    // OK: False negative but reported by spotbugs
    val data = req.getParameter("input")
    val normalized = data.replaceAll("\n", "\n")
    resp.setHeader("test", normalized)
    val normalized2 = data.replaceAll("\n", req.getParameter("test"))
    resp.setHeader("test2", normalized2)
    // OK
    val normalized3 = org.apache.commons.text.StringEscapeUtils.unescapeJava(tainted)
    resp.setHeader("test3", normalized3)
    val normalized4 = getString(tainted)
    resp.setHeader("test4", normalized4)
    val wrapper = new HttpServletResponseWrapper(resp)
    wrapper.addHeader("test", tainted)
    wrapper.setHeader("test2", tainted)
  }
}