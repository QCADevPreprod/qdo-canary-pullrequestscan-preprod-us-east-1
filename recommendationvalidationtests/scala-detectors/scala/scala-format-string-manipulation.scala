// License: LGPL-3.0 License (c) find-sec-bugs
package strings

import java.util.Formatter
import java.util.Locale
import java.io.IOException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServlet


class FormatStringManipulation extends HttpServlet {
  @throws[IOException]
  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = { // create a new formatter
    val buffer = new StringBuffer()
    val formatter = new Formatter(buffer, Locale.US)
    val input = request.getParameter("suffix")
    
    // ruleid: scala-format-string-manipulation
    val format = "The customer: %s %s" + input
    //test cases
    
    // ruleid: scala-format-string-manipulation
    formatter.format(format, "John", "Smith", "Jr") //BAD


    
    // ruleid: scala-format-string-manipulation
    formatter.format(Locale.US, format, "John", "Smith")
    // {/fact}
    //false positive test


    // {fact rule=untrusted-format-strings@v1.0 defects=0}
    formatter.format("The customer: %s %s", "John", request.getParameter("testParam")) //OK

    
    // ruleid: scala-format-string-manipulation
    System.out.printf(format, "John", "Smith")
    
    // ruleid: scala-format-string-manipulation
    System.out.printf(Locale.US, format, "John", "Smith")

    
    // ruleid: scala-format-string-manipulation
    System.out.format(format, "John", "Smith")

    
    // ruleid: scala-format-string-manipulation
    System.out.format(Locale.US, format, "John", "Smith")

    
    // ruleid: scala-format-string-manipulation
    val format2 = "The customer: %s %s" + request.getParameter("suffix")


    
    // ruleid: scala-format-string-manipulation
    String.format(format2, "John", "Smith")

    
    // ruleid: scala-format-string-manipulation
    String.format(Locale.US, format2, "John", "Smith")
    // {/fact}
  


    
    val format = "The customer: %s %s"
    // ok: scala-format-string-manipulation
    formatter.format(format, "John", "Smith")

    val safeFormat = "The customer: %s %s"
    
    System.out.printf(safeFormat, "John", "Smith")
    System.out.printf(Locale.US, safeFormat, "John", "Smith")
    // ok: scala-format-string-manipulation
    System.out.format(safeFormat, "John", "Smith")
    // ok: scala-format-string-manipulation
    System.out.format(Locale.US, safeFormat, "John", "Smith")

    val safeFormat2 = "The customer: %s %s"
    // ok: scala-format-string-manipulation
    String.format(safeFormat2, "John", "Smith")
    // ok: scala-format-string-manipulation
    String.format(Locale.US, safeFormat2, "John", "Smith")
  }
}