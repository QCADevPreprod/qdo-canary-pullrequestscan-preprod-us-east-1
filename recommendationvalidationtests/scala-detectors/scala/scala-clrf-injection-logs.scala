package inject

import javax.servlet.http.HttpServletRequest
import java.util.ResourceBundle
import java.util.function.Supplier
import java.util.logging._


object CLRFInjectionLogs {
  var req = null
}

class CLRFInjectionLogs {
  def javaUtilLogging(req: HttpServletRequest): Unit = {
    val tainted = req.getParameter("test")
    val safe = "safe"
    val logger = Logger.getLogger(classOf[Nothing].getName)
    logger.setLevel(Level.ALL)
    val handler = new ConsoleHandler
    handler.setLevel(Level.ALL)
    logger.addHandler(handler)
    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.config(tainted)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.entering(tainted, safe)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.entering("safe", safe, tainted)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.entering(safe, "safe", Array[String](tainted))
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.exiting(safe, tainted)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.exiting(safe, "safe", tainted)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.fine(tainted)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.finer(tainted.trim)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.finest(tainted)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.info(tainted)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.log(Level.INFO, tainted)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.log(Level.INFO, tainted, safe)
    // {/fact}


    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.log(Level.INFO, "safe", Array[String](tainted))
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.log(Level.INFO, tainted)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.logp(Level.INFO, tainted, safe, "safe")
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.logp(Level.INFO, safe, "safe", tainted, safe)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.logp(Level.INFO, "safe", safe.toLowerCase, safe, Array[String](tainted))
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.logrb(Level.INFO, tainted, "safe", "bundle", safe, Array[String](safe))
    // {/fact}


    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.severe(tainted + "safe" + safe)
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.warning(tainted.replaceAll("\n", "")) // still insecure (CR not replaced)
    // {/fact}

    // these should not be reported
    logger.fine(safe)
    logger.log(Level.INFO, "safe".toUpperCase, safe + safe)
    logger.logp(Level.INFO, safe, safe, safe, Array[String](safe))

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.logrb(Level.INFO, safe, safe, tainted + "bundle", safe) // bundle name can be tainted
    // {/fact}


    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.info(tainted.replace('\n', ' ').replace('\r', ' '))
    var encoded = tainted.replace("\r", "").toUpperCase
    encoded = "safe" + encoded.toLowerCase
    // {/fact}

    // {fact rule=file-injection@v1.0 defects=1}
    // ruleid: scala-clrf-injection-logs
    logger.warning(encoded.replace("\n", " (new line)"))
    logger.fine(tainted.replaceAll("[\r\n]+", ""))
    // {/fact}


    val tainted = req.getParameter("test")

    // Validate and sanitize the parameter value
    val safe = Option(tainted).map(_.replace("\r", "").replace("\n", "")).getOrElse("")

    // Get logger instance for the specific class
    // ok: scala-clrf-injection-logs
    val logger = Logger.getLogger(classOf[CLRFInjectionLogs].getName)
    logger.setLevel(Level.ALL)

    // Create a ConsoleHandler and set its level
    val handler = new ConsoleHandler
    handler.setLevel(Level.ALL)
    // ok: scala-clrf-injection-logs
    logger.addHandler(handler)

    // Log the sanitized parameter value
    // ok: scala-clrf-injection-logs
    logger.info(safe)

    // Other logging statements with sanitized values
    // ok: scala-clrf-injection-logs
    logger.fine("This is a safe log message.")
    // ok: scala-clrf-injection-logs
    logger.warning("This is a safe warning message.")
    // ok: scala-clrf-injection-logs
    logger.severe("This is a safe severe message.")
    // ok: scala-clrf-injection-logs
    logger.fine(safe)
    // ok: scala-clrf-injection-logs
    logger.log(Level.INFO, "safe".toUpperCase, safe + safe)
    // ok: scala-clrf-injection-logs
    logger.logp(Level.INFO, safe, safe, safe, Array(safe))
    // ok: scala-clrf-injection-logs
    logger.logrb(Level.INFO, safe, safe, "safe_bundle", safe) 

    val sanitizedTainted = tainted.replaceAll("[\\r\\n]+", "") // Remove all CR and LF characters
      // ok: scala-clrf-injection-logs
      logger.config(sanitizedTainted)
      // ok: scala-clrf-injection-logs
      logger.entering(sanitizedTainted, safe)
  }
}
