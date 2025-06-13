import io.ktor.application.*;
import io.ktor.features.*;
import io.ktor.request.*;
import io.ktor.response.*;
import io.ktor.routing.*;
import io.ktor.server.engine.*;
import io.ktor.server.netty.*;
import java.io.InputStreamReader;
import org.http4k.core.*;
import org.http4k.core.Method.POST;
import org.http4k.server.Http4kServer;
import org.http4k.server.Netty;
import org.http4k.server.asServer;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter
import org.jsoup.Jsoup
import org.owasp.html.Sanitizers

class CrossSiteScripting {    
    fun noncompliant1() {
        print("Enter your name:")
        val name = readLine()

        val writer = PrintWriter(System.out)
        // ruleid: kotlin-cross-site-scripting
        writer.write("<p>Hello, $name!</p>")
  
    }


    fun noncompliant2() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val params = call.receiveParameters()
                val name = params["name"]
                val writer = call.response.writer
                // ruleid: kotlin-cross-site-scripting
                writer.write("<p>Hello, $name!</p>")
          }
        }.start(wait = true)
     }
    }

   fun noncompliant3() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val name = call.receiveText()
                val out = call.response.outputStream
                // ruleid: kotlin-cross-site-scripting
                out.write(name.toByteArray())
            }
        }
      }.start(wait = true)
   }

   fun noncompliant4() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
      
                val name = call.request.queryParameters["name"]
                val writer = call.response.writer
                // ruleid: kotlin-cross-site-scripting
                writer.write("<p>Hello, $name!</p>")
            }

      
            }
        }.start(wait = true)
    }

   fun noncompliant5() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path/{pathParam}") {
                val param = call.parameters["pathParam"]
                val out = call.response.outputStream
                // ruleid: kotlin-cross-site-scripting
                out.write(param.toByteArray())
                
            }
        }
      }.start(wait = true)
   }

   fun noncompliant6() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path") {
                val name = call.request.headers["name"]
                val writer = call.response.writer
                // ruleid: kotlin-cross-site-scripting
                writer.write("<p>Hello, $name!</p>")
                
        }
      }.start(wait = true)
    }
   }

    fun noncompliant7() {
        val app: HttpHandler = { request: Request ->
                val input = request.bodyString()
                val writer = call.response.writer
                // ruleid: kotlin-cross-site-scripting
                writer.write("<p>$input</p>")
            
        }

        val server: Http4kServer = app.asServer(Netty(8080)).start()

        println("Server started on port 8080")
    }

    fun noncompliant8(request: HttpServletRequest, response:           
       HttpServletResponse) {
        response.contentType = getContentType(request)
        val name = request.getParameter("yourName")
        val writer = response.writer
        // ruleid: kotlin-cross-site-scripting
        writer.write("<p>Hello, $name!</p>")
    }

    fun noncompliant9(request: HttpServletRequest, response:           
       HttpServletResponse) {
        response.contentType = getContentType(request)
        val name = request.getParameter("yourName")
        val out = call.response.outputStream
        // ruleid: kotlin-cross-site-scripting
        out.write(name.toByteArray())
    }


    
    fun compliant1() {
        print("Enter your name:")
        val name = readLine()

        val writer = PrintWriter(System.out)
        // ok: kotlin-cross-site-scripting
        writer.write("<p>Hello, name!</p>")
  
    }
    
    
    fun compliant2() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val params = call.receiveParameters()
                val name = params["name"]
                val writer = call.response.writer
                val sanitizedName = Jsoup.clean(name, Whitelist.none())
                // ok: kotlin-cross-site-scripting
                writer.write("<p>Hello, $sanitizedName!</p>")
          }
        }.start(wait = true)
     }
    }
   
    fun compliant3() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                var name = call.receiveText()
                val out = call.response.outputStream
                name = "hardcoded_value"
                // ok: kotlin-cross-site-scripting
                out.write(name.toByteArray())
            }
        }
      }.start(wait = true)
   }

    fun compliant4() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
      
                val name = "hardcoded_value"
                val writer = call.response.writer
                // ok: kotlin-cross-site-scripting
                writer.write("<p>Hello, $name!</p>")
            }

      
            }
        }.start(wait = true)
    }


    fun compliant5() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path/{pathParam}") {
                val param = call.parameters["pathParam"]
                val out = call.response.outputStream
                val sanitizer = Sanitizers.FORMATTING.and(Sanitizers.BLOCKS)
                val sanitizedParam = sanitizer.sanitize(param)
                // ok: kotlin-cross-site-scripting
                out.write(sanitizedParam.toByteArray())
                
            }
        }
      }.start(wait = true)
   }

   fun compliant6() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path") {
                val name = call.request.headers["name"]
                val writer = call.response.writer
                val sanitizedName = Jsoup.clean(name, Whitelist.none())
                // ok: kotlin-cross-site-scripting
                writer.write("<p>Hello, $sanitizedName!</p>")
                
        }
      }.start(wait = true)
    }
   }

   fun compliant7() {
        val app: HttpHandler = { request: Request ->
                val input = request.bodyString()
                val writer = call.response.writer
                val sanitizer = Sanitizers.FORMATTING.and(Sanitizers.BLOCKS)
                val sanitizedInput = sanitizer.sanitize(input)
                // ok: kotlin-cross-site-scripting
                writer.write("<p>$sanitizedInput</p>")
            
        }

        val server: Http4kServer = app.asServer(Netty(8080)).start()

        println("Server started on port 8080")
    }

    fun compliant8(request: HttpServletRequest, response:           
       HttpServletResponse) {
        response.contentType = getContentType(request)
        val name = request.getParameter("yourName")
        val sanitizer = Sanitizers.FORMATTING.and(Sanitizers.BLOCKS)
        val sanitizedName = sanitizer.sanitize(name)
        val writer = response.writer
        // ok: kotlin-cross-site-scripting
        writer.write("<p>Hello, $sanitizedName!</p>")
    }

    fun compliant9(request: HttpServletRequest, response:           
       HttpServletResponse) {
        response.contentType = getContentType(request)
        val name = request.getParameter("yourName")
        val out = call.response.outputStream
        val sanitizedName = Jsoup.clean(name, Whitelist.none())
        // ok: kotlin-cross-site-scripting
        out.write(sanitizedName.toByteArray())
    }
   
}   
