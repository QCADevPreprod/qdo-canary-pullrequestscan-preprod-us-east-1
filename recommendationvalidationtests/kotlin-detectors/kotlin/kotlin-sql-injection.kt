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
import java.sql.Connection
import java.sql.Statement
import java.sql.ResultSet

class SqlInjection {    


   fun noncompliant1(connection: Connection): ResultSet {
       print("Enter your userId:")
       val userId = readLine()
       val query = "SELECT * FROM users WHERE userId = '$userId'"
       val statement = connection.createStatement()
       // ruleid: kotlin-sql-injection
       return statement.executeQuery(query)
    }



    fun noncompliant2(connection: Connection): ResultSet {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/user/{params}") {
                val params = call.receiveParameters()
                val query = "SELECT * FROM users WHERE userId = '$params'"
                val statement = connection.createStatement()
                // ruleid: kotlin-sql-injection
                return statement.executeQuery(query)
            }
        }
      }.start(wait = true)
   }

   fun noncompliant3(connection: Connection): ResultSet {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/user/{id}") {
                val id = call.receiveText()
                val query = "SELECT * FROM users WHERE userId = '$id'"
                val statement = connection.createStatement()
                // ruleid: kotlin-sql-injection
                return statement.execute(query)
            }
        }
      }.start(wait = true)
   }

   fun noncompliant4(connection: Connection): ResultSet {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/user/{userId}") {
                val userId = call.request.queryParameters["id"] 
                val statement = connection.createStatement()
                // ruleid: kotlin-sql-injection
                return statement.execute("SELECT * FROM users WHERE userId = '$userId'")
            }
        }
      }.start(wait = true)
   }

   fun noncompliant5(connection: Connection): ResultSet {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path/{id}") {
                val id = call.parameters["id"]
                val query = "SELECT * FROM users WHERE userId = '$id'"
                val statement = connection.createStatement()
                // ruleid: kotlin-sql-injection
                return statement.executeQuery(query)
            }
        }
      }.start(wait = true)
   }

   fun noncompliant6(connection: Connection): ResultSet {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path") {
                val name = call.request.headers["name"]
                val query = "SELECT * FROM users WHERE name = '$name'"
                val statement = connection.createStatement()
                // ruleid: kotlin-sql-injection
                return statement.executeQuery(query)
            }
        }
      }.start(wait = true)
   }



    fun noncompliant7(connection: Connection): ResultSet {
        val app: HttpHandler = { request: Request ->
             val name = request.bodyString()
             val statement = connection.createStatement()
             // ruleid: kotlin-sql-injection
             return statement.executeQuery("SELECT * FROM users WHERE name = '$name'")

        }

        val server: Http4kServer = app.asServer(Netty(8080)).start()

        println("Server started on port 8080")
    }

    fun noncompliant8(request: HttpServletRequest, response:           
       HttpServletResponse) {
          val userId = request.getParameter("id")
          val query = "SELECT * FROM users WHERE userId = '$userId'"
          val statement = connection.createStatement()
          // ruleid: kotlin-sql-injection
          statement.execute(query)
    }



    fun compliant1(connection: Connection): ResultSet {
       val userId = "hardcoded_value"
       val query = "SELECT * FROM users WHERE userId = '$userId'"
       val statement = connection.createStatement()
       // ok: kotlin-sql-injection
       return statement.executeQuery(query)
    }


    fun compliant2(connection: Connection, params: String): ResultSet {
        val query = "SELECT * FROM users WHERE userId = '$params'"
        val statement = connection.createStatement()
        // ok: kotlin-sql-injection
        return statement.executeQuery(query)

   }

    fun compliant3(connection: Connection): ResultSet {
         val id = "hardcoded_value"
         val query = "SELECT * FROM users WHERE userId = '$id'"
         val statement = connection.createStatement()
         // ok: kotlin-sql-injection
         return statement.execute(query)
   }

    fun compliant4(connection: Connection): ResultSet {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/user/{userId}") {
                val userId = call.request.queryParameters["id"] 
                val statement = connection.createStatement()
                // ok: kotlin-sql-injection
                return statement.execute("SELECT * FROM users WHERE userId = 'userId'")
            }
        }
      }.start(wait = true)
   }



    fun compliant5(connection: Connection): ResultSet {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path/{id}") {
                val id = call.parameters["id"]
                id = "hardcoded_value"
                val query = "SELECT * FROM users WHERE userId = '$id'"
                val statement = connection.createStatement()
                // ok: kotlin-sql-injection
                return statement.executeQuery(query)
            }
        }
      }.start(wait = true)
   }


   fun compliant6(connection: Connection): ResultSet {
        embeddedServer(Netty, port = 8080) {

        routing {
            post("/path") {
                val name = call.request.headers["name"]
                val query = "SELECT * FROM users WHERE name = '$name'"
                val statement = connection.createStatement()
                // ok: kotlin-sql-injection
                return statement.executeQuery("query")
            }
        }
      }.start(wait = true)
   }

   fun compliant7(connection: Connection): ResultSet {
        val app: HttpHandler = { request: Request ->
             val name = request.bodyString()
             val statement = connection.createStatement()
             // ok: kotlin-sql-injection
             return statement.executeQuery("SELECT * FROM users WHERE name = 'foo'")

        }

        val server: Http4kServer = app.asServer(Netty(8080)).start()

        println("Server started on port 8080")
    }

   fun compliant8(request: HttpServletRequest, response:           
       HttpServletResponse, id: String) {
          val userId = request.getParameter("id")
          val query = "SELECT * FROM users WHERE userId = 'id'"
          val statement = connection.createStatement()
          // ok: kotlin-sql-injection
          statement.execute(query)
    }

}
