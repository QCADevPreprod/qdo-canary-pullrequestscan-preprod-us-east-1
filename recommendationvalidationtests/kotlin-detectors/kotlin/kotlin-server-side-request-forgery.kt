package testcode.crypto

import jakarta.servlet.http.HttpServlet
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import java.net.URL

class ServerSideRequestForgery: HttpServlet() {
    private val client: HttpClient = HttpClient.newHttpClient()

    fun non_conformant_1(request: HttpServletRequest, response: HttpServletResponse?) {
        val uri = URI(request.getParameter("uri"))
        
        // ruleid: kotlin-server-side-request-forgery
        val r: HttpRequest = HttpRequest.newBuilder(uri).build()
        client.send(r, HttpResponse.BodyHandlers.ofString())
    }

    fun non_conformant_2(request: HttpServletRequest, response: HttpServletResponse) {
        val suffix = ".com"
        // Add a suffix to user controlled uri
        val uri = URI(request.getParameter("uri") + suffix)

        // ruleid: kotlin-server-side-request-forgery
        val r: HttpRequest = HttpRequest.newBuilder(uri).build()
        client.send(r, HttpResponse.BodyHandlers.ofString())
    }

    fun non_conformant_3(request: HttpServletRequest, response: HttpServletResponse) {
        // Use getAttribute to get untrusted data
        val uri = URI(request.getAttribute("uri") as String)
        
        // ruleid: kotlin-server-side-request-forgery
        val r: HttpRequest = HttpRequest.newBuilder(uri).build()
        client.send(r, HttpResponse.BodyHandlers.ofString())
    }

    fun non_conformant_4() {
        embeddedServer(Netty, port = 8080) {
            routing {
                post("/proxy/{url}") {
                    val url = call.request.queryParameters["url"]
                    if (url != null) {
                        val data = URL(url).readText()
                        // ruleid: kotlin-server-side-request-forgery
                        call.respondText(data)
                    }
                }
            }
        }.start(wait = true)
    }

    fun non_conformant_5() {
        embeddedServer(Netty, port = 8080) {
            routing {
                post("/proxy/{url}") {
                        val data = URL(call.request.queryParameters["url"]).readText()
                        // ruleid: kotlin-server-side-request-forgery
                        call.respondText(data)
                }
            }
        }.start(wait = true)
    }

    fun non_conformant_6() {
        embeddedServer(Netty, port = 8080) {
            routing {
                post("/proxy/{url}") {
                    val data = URL(call.request.parameters["url"]).readText()
                    // ruleid: kotlin-server-side-request-forgery
                    call.respondText(data)
                }
            }
        }.start(wait = true)
    }

    fun conformant_1(request: HttpServletRequest, response: HttpServletResponse) {
        val uri = URI(request.getParameter("uri"))
        if (VALID_URI == request.getParameter("uri")) {
            // ok: kotlin-server-side-request-forgery
            val r2: HttpRequest = HttpRequest.newBuilder(uri).build()
            client.send(r2, HttpResponse.BodyHandlers.ofString())
        }
    }

    fun conformant_2(request: HttpServletRequest, response: HttpServletResponse) {
        val suffix = ".com"
        // Hardcoded URI
        val uri = URI("www.google" + suffix)

        // ok: kotlin-server-side-request-forgery
        val r: HttpRequest = HttpRequest.newBuilder(uri).build()
        client.send(r, HttpResponse.BodyHandlers.ofString())
    }

    fun conformant_3(request: HttpServletRequest, response: HttpServletResponse) {
        val attribute = request.getAttribute("uri")
        val uri = URI("someurl")

        // ok: kotlin-server-side-request-forgery
        val r: HttpRequest = HttpRequest.newBuilder(uri).build()
        client.send(r, HttpResponse.BodyHandlers.ofString())
    }

    fun conformant_4() {
        embeddedServer(Netty, port = 8080) {
            routing {
                post("/proxy/{url}") {
                    val url = "<hardcoded_url>"
                    if (url != null) {
                        val data = URL(url).readText()
                        // ok: kotlin-server-side-request-forgery
                        call.respondText(data)
                    }
                }
            }
        }.start(wait = true)
    }

    companion object {
        private const val VALID_URI = "http://lgtm.com"
    }

}