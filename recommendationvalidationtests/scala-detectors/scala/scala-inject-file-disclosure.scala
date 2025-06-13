package inject
import java.io.IOException
import org.apache.struts.action.ActionForward
import org.springframework.web.servlet.ModelAndView
import javax.servlet.RequestDispatcher
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.util

// REQUESTDISPATCHER_FILE_DISCLOSURE
class FileDisclosure extends HttpServlet {

  @throws[IOException]
  def doGet_noncomplaint(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    try {
      val jspFile = request.getParameter("jspFile")
      var requestDispatcher = request.getRequestDispatcher(jspFile)
      //ruleid: scala-inject-file-disclosure
      requestDispatcher.include(request, response)
      requestDispatcher = request.getSession.getServletContext.getRequestDispatcher(jspFile)     
      //ruleid: scala-inject-file-disclosure
      requestDispatcher.forward(request, response)    
      
    } catch {
      case e: Exception =>
        System.out.println(e)
    }
  }

  @throws[IOException]
  def doGet_compliant(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    try {
      val jspFile = request.getParameter("jspFile")

      // Validate and sanitize the jspFile parameter
      val sanitizedPath = sanitizePath(jspFile)

      var requestDispatcher = request.getRequestDispatcher(sanitizedPath)
      //ok: scala-inject-file-disclosure
      requestDispatcher.include(request, response)
      requestDispatcher = request.getSession.getServletContext.getRequestDispatcher(sanitizedPath)
      //ok: scala-inject-file-disclosure
      requestDispatcher.forward(request, response)

    } catch {
      case e: Exception =>
        System.out.println(e)
    }
  }

  // Helper method to sanitize the file path
  private def sanitizePath(path: String): String = {
    val normalizedPath = Paths.get(path).normalize().toString()
    // Add additional validation or sanitization logic as needed normalizedPath
  }

}


