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

class CommandInjection {    
    fun noncompliant1() {
        print("Enter your input:")
        val input = readLine()

        val command = "echo Hello, $input"
        // ruleid: kotlin-command-injection
        val process = Runtime.getRuntime().exec(String.format("The value is: %s", command))
  
    }
    
    fun noncompliant2() {
        println("Enter a directory name:")
        val directory = readLine() ?: ""

        val command = "ls -l " + directory
        val r: Runtime = Runtime.getRuntime()
        // ruleid: kotlin-command-injection
        val process = r.getRuntime().exec(command)
  
    }


    fun noncompliant3() {
        println("Enter the name of the library to load:")
        val libraryName = readLine() ?: ""

        // ruleid: kotlin-command-injection
        Runtime.getRuntime().loadLibrary(libraryName)
    } 

    fun noncompliant4() {
        print("Enter your input:")
        val input = readLine()

        val command = "echo Hello, $input"
        // ruleid: kotlin-command-injection
        val process = Runtime.getRuntime().loadLibrary(String.format("The value is: %s", command))
  
    }


    fun noncompliant5() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val params = call.receiveParameters()
                val command = params["command"]
                // ruleid: kotlin-command-injection
                val process = Runtime.getRuntime().exec(command)
            }
        }
      }.start(wait = true)
   }

   fun noncompliant6() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val command = call.receiveText()
                // ruleid: kotlin-command-injection
                val process = Runtime.getRuntime().exec(command)
            }
        }
      }.start(wait = true)
   }

   fun noncompliant7() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val command = call.request.queryParameters["command"]
                // ruleid: kotlin-command-injection
                val process = Runtime.getRuntime().exec(command)
            }
        }
      }.start(wait = true)
   }

   fun noncompliant8() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path/{pathParam}") {
                val command = call.parameters["pathParam"]
                // ruleid: kotlin-command-injection
                val process = Runtime.getRuntime().exec(command)
            }
        }
      }.start(wait = true)
   }

   fun noncompliant9() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path") {
                val command = call.request.headers["command"]
                // ruleid: kotlin-command-injection
                val process = Runtime.getRuntime().exec(command)
            }
        }
      }.start(wait = true)
   }



    fun noncompliant10() {
        val app: HttpHandler = { request: Request ->
                val command = request.bodyString()
                // ruleid: kotlin-command-injection
                val process = Runtime.getRuntime().loadLibrary(command)
            
        }

        val server: Http4kServer = app.asServer(Netty(8080)).start()

        println("Server started on port 8080")
    }

    fun noncompliant11(request: HttpServletRequest, response:           
       HttpServletResponse) {
        val command = request.getParameter("command")
        // ruleid: kotlin-command-injection
        val process = Runtime.getRuntime().loadLibrary(command)
    }


    
    fun compliant1(input: String) {
        // ok: kotlin-command-injection
        val process = Runtime.getRuntime().exec(String.format("The value is: %s", input))
  
    }
    
    
    fun compliant2() {
        val directory = "hardcoded_value"

        val command = "ls -l " + directory
        val r: Runtime = Runtime.getRuntime()
        // ok: kotlin-command-injection
        val process = r.getRuntime().exec(command)
  
    }
   
    fun compliant3(libraryName: String) {
        // ok: kotlin-command-injection
        Runtime.getRuntime().loadLibrary(libraryName)
    }

    fun compliant4(command: String) {
        // ok: kotlin-command-injection
        val process = Runtime.getRuntime().loadLibrary(String.format("The value is: %s", command))
    }  


    fun compliant5() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val params = call.receiveParameters()
                val command = params["command"]
                // ok: kotlin-command-injection
                val process = Runtime.getRuntime().exec("command")
            }
        }
      }.start(wait = true)
   }

   fun compliant6() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val command = "hardcoded_value"
                // ok: kotlin-command-injection
                val process = Runtime.getRuntime().exec(sanitizeCommand)
            }
        }
      }.start(wait = true)
   }

   fun compliant7() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val command = "hardcoded_value"
                // ok: kotlin-command-injection
                val process = Runtime.getRuntime().exec(command)
            }
        }
      }.start(wait = true)
   }

   fun compliant8(command: String) {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path/{pathParam}") {
                // ok: kotlin-command-injection
                val process = Runtime.getRuntime().exec(command)
            }
        }
      }.start(wait = true)
   }

   fun compliant9() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path") {
                val command = "hardcoded_value"
                // ok: kotlin-command-injection
                val process = Runtime.getRuntime().exec(command)
            }
        }
      }.start(wait = true)
   }

   fun compliant10(command: String) {
        val app: HttpHandler = { request: Request ->
                // ok: kotlin-command-injection
                val process = Runtime.getRuntime().loadLibrary(command)
            
        }

        val server: Http4kServer = app.asServer(Netty(8080)).start()

        println("Server started on port 8080")
    }

    fun compliant11(request: HttpServletRequest, response:           
       HttpServletResponse) {
        val command = "hardcoded_value"
        // ok: kotlin-command-injection
        val process = Runtime.getRuntime().exec(command)
    }
   
}
