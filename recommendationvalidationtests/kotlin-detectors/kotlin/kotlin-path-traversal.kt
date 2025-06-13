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
import java.io.File
import java.io.BufferedReader
import java.io.BufferedWriter
import java.io.FileWriter
import java.net.Socket

class PathTraversal {    
    fun noncompliant1() {
        print("Enter your filename:")
        val filename = readLine()

        // ruleid: kotlin-path-traversal
        val file = File(filename)
        val lines = file.readLines()
        for (line in lines) {
           println(line)
        }
  
    }


    fun noncompliant2() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val params = call.receiveParameters()
                val filename = params["filename"]
                // ruleid: kotlin-path-traversal
                val file = File(filename)
                file.writeText("Hello, World!")
          }
        }.start(wait = true)
     }
    }

   fun noncompliant3() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val filename= call.receiveText()
                 // ruleid: kotlin-path-traversal
                val file = File(filename)
                file.appendText("This is a new line.")
            }
        }
      }.start(wait = true)
   }

   fun noncompliant4() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
      
                val sock = call.request.queryParameters["socket"]
                val filenameReader = BufferedReader(InputStreamReader(sock.getInputStream(), "UTF-8"))
                val filename = filenameReader.readLine()
                
                // ruleid: kotlin-path-traversal
                val fileReader = BufferedReader(FileReader(filename))
                var fileLine = fileReader.readLine()
                while (fileLine != null) {
                    sock.getOutputStream().write(fileLine.toByteArray())
                    fileLine = fileReader.readLine()
                }
            }

      
            }
        }.start(wait = true)
    }

   fun noncompliant5() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path/{pathParam}") {
                val sock = call.parameters["pathParam"]
                val filenameReader = BufferedReader(InputStreamReader(sock.getInputStream(), "UTF-8"))
                val filename = filenameReader.readLine()
                
                // ruleid: kotlin-path-traversal
                val fileWriter = BufferedReader(FileWriter(filename))
                
            }
        }
      }.start(wait = true)
   }

   fun noncompliant6() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path") {
                val filename = call.request.headers["file"]
                // ruleid: kotlin-path-traversal
                val fileReader = BufferedReader(FileReader(filename))

                var line = fileReader.readLine()
                while (line != null) {
                    println(line)
                    line = fileReader.readLine()
                }

                fileReader.close()
            }
        }
      }.start(wait = true)
   }



    fun noncompliant7() {
        val app: HttpHandler = { request: Request ->
                val input = request.bodyString()
                val url = URL("https://${input}")

                val reader = BufferedReader(InputStreamReader(url.openStream()))
                val filename = reader.readLine()
                
                // ruleid: kotlin-path-traversal
                val fileReader = BufferedReader(FileReader(filename))
            
        }

        val server: Http4kServer = app.asServer(Netty(8080)).start()

        println("Server started on port 8080")
    }

    fun noncompliant8(request: HttpServletRequest, response:           
       HttpServletResponse) {
        val filename = request.getParameter("file")

        // ruleid: kotlin-path-traversal
        val file = File(filename)
    }


    
    fun compliant1(filename: String) {
        // ok: kotlin-path-traversal
        val file = File(filename)
        val lines = file.readLines()
        for (line in lines) {
           println(line)
        }
  
    }
    
    
    fun compliant2() {
        embeddedServer(Netty, port = 8080) {

            routing {
                post("/execute") {
                    val params = call.receiveParameters()
                    val filename = "path/to/input.txt"
                    // ok: kotlin-path-traversal
                    val file = File(filename)
                    file.writeText("Hello, World!")
                }
             }.start(wait = true)
        }
  
    }
   
    fun compliant3() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
                val filename = call.receiveText()
                 // ok: kotlin-path-traversal
                val file = File("path/to/input.txt")
                file.appendText("This is a new line.")
            }
        }
      }.start(wait = true)
    }

    fun compliant4() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/execute") {
      
                val sock = Socket("example.com", 80)
                val filenameReader = BufferedReader(InputStreamReader(sock.getInputStream(), "UTF-8"))
                val filename = filenameReader.readLine()
                
                // ok: kotlin-path-traversal
                val fileReader = BufferedReader(FileReader(filename))
                var fileLine = fileReader.readLine()
                while (fileLine != null) {
                    sock.getOutputStream().write(fileLine.toByteArray())
                    fileLine = fileReader.readLine()
                }
            }

      
            }
        }.start(wait = true)
    }  


    fun compliant5(sock: Socket, user: String) {
        val filenameReader = BufferedReader(
                InputStreamReader(sock.getInputStream(), "UTF-8"))
        val filename = filenameReader.readLine()

        // ok: kotlin-path-traversal
        if (!filename.contains("..") && filename.startsWith("/home/$user/public/")) {
            val fileReader = BufferedReader(FileReader(filename))
            var fileLine = fileReader.readLine()
            while (fileLine != null) {
                sock.getOutputStream().write(fileLine.toByteArray())
                fileLine = fileReader.readLine()
            }
        
        
        }
    }

   fun compliant6() {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path") {
                val filename = call.request.headers["file"]
                // ok: kotlin-path-traversal
                val fileReader = BufferedReader(FileReader("filename"))

                var line = fileReader.readLine()
                while (line != null) {
                    println(line)
                    line = fileReader.readLine()
                }

                fileReader.close()
            }
        }
      }.start(wait = true)
   }

   fun compliant7() {
        val app: HttpHandler = { request: Request ->
            val input = request.bodyString()
            val url = URL("https://example.com")

            val reader = BufferedReader(InputStreamReader(url.openStream()))
            val filename = reader.readLine()
            
            // ok: kotlin-path-traversal
            val fileReader = BufferedReader(FileReader(filename))
            
        }

        val server: Http4kServer = app.asServer(Netty(8080)).start()

        println("Server started on port 8080")
   }

    fun compliant8(request: HttpServletRequest, response:           
       HttpServletResponse) {
        val filename = request.getParameter("file")

        // ok: kotlin-path-traversal
        val file = File("path/to/textfile")
    }

    private fun serverRun(serverPort: Int, fileFolderName: String) {
        val portStr: String = if (serverPort == 80) "" else ":$serverPort"
        // ok: kotlin-path-traversal
        echo("Starting UncivServer for ${File(fileFolderName).absolutePath} on http://localhost$portStr")
        val server = embeddedServer(Netty, port = serverPort) {
            routing {
                post("/isalive") {
                    log.info("Received isalive request from ${call.request.local.remoteHost}")
                    call.respondText("{authVersion: ${if (authV1Enabled) "1" else "0"}}")
                }
            }
        }.start(wait = true)
    }

}   
