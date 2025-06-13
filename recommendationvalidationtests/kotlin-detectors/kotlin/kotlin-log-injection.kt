import org.springframework.web.bind.annotation.RequestParam;
import org.slf4j.LoggerFactory
import javax.servlet.ServletRequest
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.servlet.ModelAndView
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class LogInjection {

    val logger = LoggerFactory.getLogger("MyClass")

    fun noncompliant1(@RequestParam input: String) {
        // Vulnerable code: Unsafely concatenating user input into log message
        // ruleid:kotlin-log-injection
        logger.info("Received input: $input")
    }


    fun noncompliant2(request: ServletRequest) {
        val xValue = request.getParameter("x")
        // ruleid:kotlin-log-injection
        logger.info("Value is: {}", xValue)
    }

    fun noncompliant3(request: ServletRequest) {
        // ruleid:kotlin-log-injection
        logger.info("Value is: {}", request.getParameter("x"))
    }

    @RequestMapping("/example.htm", method = [RequestMethod.GET, RequestMethod.POST])
    fun noncompliant4(request: HttpServletRequest, response: HttpServletResponse): ModelAndView {
        val result = ModelAndView("success")
        val userId = request.getParameter("userId")
        result.addObject("userId", userId)
        // More logic to populate `result`.
        // ruleid:kotlin-log-injection
        logger.info("Successfully processed {} with user ID: {}.", request, userId)
        return result
    }


    @RequestMapping("/example.htm", method = [RequestMethod.GET, RequestMethod.POST])
    fun noncompliant5(request: HttpServletRequest, response: HttpServletResponse) {
        val user = request.getParameter("user")
        // ruleid:kotlin-log-injection
        logger.info("Current logged in user: {}", user)
    }

    fun sanitize(userId: String): String {
        return userId.replace(Regex("\\D"), "")
    }

    fun compliant1(input: String) {
        // ok:kotlin-log-injection
        logger.info("Received input: $input")
    }

        
    fun compliant2(request: ServletRequest) {
        val xValue = request.getParameter("x")
        // ok:kotlin-log-injection
        logger.info("Value is: {}", sanitize(xValue))
    }

    fun compliant3(request: ServletRequest) {
        // ok:kotlin-log-injection
        logger.info("Value is: {}", sanitize(request.getParameter("x")))
    }

    @RequestMapping("/example.htm", method = [RequestMethod.GET, RequestMethod.POST])
    fun compliant4(request: HttpServletRequest, response: HttpServletResponse): ModelAndView {
        val result = ModelAndView("success")
        val userId = request.getParameter("userId")
        val sanitizedUserId = sanitize(userId)
        result.addObject("userId", sanitizedUserId)
        // More logic to populate `result`.
        // ok:kotlin-log-injection
        logger.info("Successfully processed {} with user ID: {}.", request, sanitizedUserId)
        return result
    }

    @RequestMapping("/example.htm", method = [RequestMethod.GET, RequestMethod.POST])
    fun compliant5(request: HttpServletRequest, response: HttpServletResponse) {
        val user = request.getParameter("user")
        // ok:kotlin-log-injection
        logger.info("Current logged in user: {}", sanitize(user))
    }

}
