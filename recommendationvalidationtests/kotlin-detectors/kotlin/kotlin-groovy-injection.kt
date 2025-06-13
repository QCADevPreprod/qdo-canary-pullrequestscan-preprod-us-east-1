import groovy.lang.GroovyClassLoader
import groovy.lang.GroovyCodeSource
import groovy.lang.GroovyObject
import groovy.lang.GroovyShell
import groovy.util.Eval
import jakarta.servlet.http.HttpServletRequest

class GroovyInjection {
    fun noncompliant1(request: HttpServletRequest) {
        val script: String = request.getParameter("script")
        val classLoader = GroovyClassLoader()
        // ruleid: kotlin-groovy-injection
        val groovy: Class<*> = classLoader.parseClass(script)
        val groovyObj: GroovyObject = groovy.newInstance() as GroovyObject
    }

    fun noncompliant2(request: HttpServletRequest) {
        val script: String = request.getParameter("script")
        // ruleid: kotlin-groovy-injection
        Eval.me(script)
    }

    fun noncompliant3(request: HttpServletRequest) {
        val shell = GroovyShell()
        val script: String = request.getParameter("script")
        // ruleid: kotlin-groovy-injection
        shell.evaluate(script)
    }

    fun noncompliant4(request: HttpServletRequest) {
        val shell = GroovyShell()
        val script: String = request.getParameter("script")
        val gcs = GroovyCodeSource(script, "test", "Test")
        // ruleid: kotlin-groovy-injection
        shell.evaluate(gcs)
    }

    fun compliant1() {
        val script: String = request.getParameter("script")
        val classLoader = GroovyClassLoader()
        // ok: kotlin-groovy-injection
        val groovy: Class<*> = classLoader.loadClass(script)
        val groovyObj: GroovyObject = groovy.newInstance() as GroovyObject
    }

    fun compliant2(script: String) {
        // ok: kotlin-groovy-injection
        Eval.me(sanitizeScript(script))
    }

    fun compliant3(request: HttpServletRequest) {
        val shell = GroovyShell()
        val script: String = request.getParameter("script")
        // ok: kotlin-groovy-injection
        shell.evaluate("script")
    }

    fun compliant4(request: HttpServletRequest) {
        val shell = GroovyShell()
        val script: String = "script"
        val gcs = GroovyCodeSource(script, "test", "Test")
        // ok: kotlin-groovy-injection
        shell.evaluate(gcs)
    }

}
