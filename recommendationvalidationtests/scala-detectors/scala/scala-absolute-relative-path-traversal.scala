package inject

import javax.servlet.ServletException
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.FileReader
import java.io.FileWriter
import java.io.IOException
import java.io.RandomAccessFile
import java.net.URI
import java.net.URISyntaxException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths


class SpotbugsPathTraversal extends HttpServlet { // DETECTS: PT_ABSOLUTE_PATH_TRAVERSAL
  @Override
  @throws[ServletException]
  @throws[IOException]
  override protected def doGet(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input = req.getParameter("input")
    // ruleid: scala-absolute-relative-path-traversal
    new File(input + "/abs/path") // BAD, DETECTS: PT_RELATIVE_PATH_TRAVERSAL
  }


    override protected def doGet_compliant(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
        val input = req.getParameter("input")
        val baseDir = "/some/fixed/base/directory"
        // ok: scala-absolute-relative-path-traversal
        val file = new File(baseDir, "abs/path")
        // Additional code to handle the 'file' object as needed
    }

  @throws[ServletException] 
  @throws[IOException]
  protected def danger2(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input1 = req.getParameter("input1")
    // ruleid: scala-absolute-relative-path-traversal
    new File(input1) // BAD
  }

  @throws[ServletException]
  @throws[IOException]
  @throws[URISyntaxException]
  protected def danger3(req: HttpServletRequest, resp: HttpServletResponse): Unit = {

    val input = req.getParameter("test")
    // ruleid: scala-absolute-relative-path-traversal
    new File(input)
    // ruleid: scala-absolute-relative-path-traversal
    new File("test/" + input, "misc.jpg")
    // ruleid: scala-absolute-relative-path-traversal
    new RandomAccessFile(input, "r") // BAD, DETECTS: PT_ABSOLUTE_PATH_TRAVERSAL
    // ruleid: scala-absolute-relative-path-traversal
    new File(new URI(input))
    // ruleid: scala-absolute-relative-path-traversal
    new FileReader(input)
    // ruleid: scala-absolute-relative-path-traversal
    new FileInputStream(input)
    // false positive test
    new RandomAccessFile("safe", input)
    new FileWriter("safe".toUpperCase)

    new File(new URI("safe"))
    // ruleid: scala-absolute-relative-path-traversal
    File.createTempFile(input, "safe")
    // ruleid: scala-absolute-relative-path-traversal
    File.createTempFile("safe", input)
  }

  // nio path traversal
  def loadFile(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val path = req.getParameter("test")
    // ruleid: scala-absolute-relative-path-traversal
    Paths.get(path)
    //Each argument represents a segment of the path
    // ruleid: scala-absolute-relative-path-traversal
    Paths.get(path, "foo")
    // ruleid: scala-absolute-relative-path-traversal
    Paths.get(path, "foo", "bar")
    // ruleid: scala-absolute-relative-path-traversal
    Paths.get("foo", path)
    // ruleid: scala-absolute-relative-path-traversal
    Paths.get("foo", "bar", path)
    Paths.get("foo")
    Paths.get("foo", "bar")
    Paths.get("foo", "bar", "allsafe")
  }

  @throws[IOException]
  def tempDir(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input = req.getParameter("test")
    val p = Paths.get("/")
    // ruleid: scala-absolute-relative-path-traversal
    Files.createTempFile(p, input, "")
    // ruleid: scala-absolute-relative-path-traversal
    Files.createTempFile(p, "", input)
    // ruleid: scala-absolute-relative-path-traversal
    Files.createTempFile(input, "")
    // ruleid: scala-absolute-relative-path-traversal
    Files.createTempFile("", input)
    // ruleid: scala-absolute-relative-path-traversal
    Files.createTempDirectory(p, input)
    // ruleid: scala-absolute-relative-path-traversal
    Files.createTempDirectory(input)
  }

  @throws[IOException]
  def writer(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    
    val input = req.getParameter("test")
    // ruleid: scala-absolute-relative-path-traversal
    new FileWriter(input)
    // ruleid: scala-absolute-relative-path-traversal
    new FileWriter(input, true)
    // ruleid: scala-absolute-relative-path-traversal
    new FileOutputStream(input)
    // ruleid: scala-absolute-relative-path-traversal
    new FileOutputStream(input, true)
  }
  
}