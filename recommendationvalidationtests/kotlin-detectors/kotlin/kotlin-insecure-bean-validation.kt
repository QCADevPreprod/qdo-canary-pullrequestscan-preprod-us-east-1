import TestValidator.InterpolationHelper.BEGIN_TERM
import TestValidator.InterpolationHelper.EL_DESIGNATOR
import TestValidator.InterpolationHelper.END_TERM
import TestValidator.InterpolationHelper.ESCAPE_CHARACTER
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.hibernate.validator.constraintvalidation.HibernateConstraintValidatorContext
import java.util.regex.Matcher
import java.util.regex.Pattern
import javax.validation.ConstraintValidatorContext

class Specifications {

    fun non_conformant_1(request: HttpServletRequest, response: HttpServletResponse, constraintContext: ConstraintValidatorContext) {
        // Unsafe Bean properties (normally user-controlled) are passed directly to `buildConstraintViolationWithTemplate`
        // ruleid: kotlin-insecure-bean-validation
        constraintContext.buildConstraintViolationWithTemplate(request.getParameter("unsafeTemplate"))
            .addConstraintViolation()
            .disableDefaultConstraintViolation()
    }

    fun non_conformant_2(request: HttpServletRequest, response: HttpServletResponse, constraintContext: ConstraintValidatorContext) {
        val constraintViolation: String = request.getAttribute("constraintViolation").toString()
        // ruleid: kotlin-insecure-bean-validation
        constraintContext.buildConstraintViolationWithTemplate(constraintViolation)
            .addConstraintViolation()
            .disableDefaultConstraintViolation()
    }

    fun conformant_1(request: HttpServletRequest, response: HttpServletResponse, constraintContext: ConstraintValidatorContext): Boolean {
        val context: HibernateConstraintValidatorContext = constraintContext.unwrap(HibernateConstraintValidatorContext::class.java)
        context.addMessageParameter("prop", request.getParameter("prop"))
        // ok: kotlin-insecure-bean-validation
        context.buildConstraintViolationWithTemplate("{prop} is invalid").addConstraintViolation()
        return false
    }

    fun conformant_2(request: HttpServletRequest, response: HttpServletResponse, constraintContext: ConstraintValidatorContext): Boolean {
        val context: HibernateConstraintValidatorContext = constraintContext.unwrap(HibernateConstraintValidatorContext::class.java)
        val prop: String = request.getParameter("prop")
        context.addMessageParameter("prop", prop)
        // ok: kotlin-insecure-bean-validation
        context.buildConstraintViolationWithTemplate("{prop} is invalid").addConstraintViolation()
        return false
    }

    fun conformant_3(request: HttpServletRequest, response: HttpServletResponse, constraintContext: ConstraintValidatorContext) {
        val template: String = request.getParameter("template")
        val ESCAPE_MESSAGE_PARAMETER_PATTERN = Pattern.compile("([$ESCAPE_CHARACTER$BEGIN_TERM$END_TERM$EL_DESIGNATOR])")
        ESCAPE_MESSAGE_PARAMETER_PATTERN.matcher(template).replaceAll(Matcher.quoteReplacement(ESCAPE_CHARACTER.toString()))
        // ok: kotlin-insecure-bean-validation
        constraintContext.buildConstraintViolationWithTemplate(template)
            .addConstraintViolation()
            .disableDefaultConstraintViolation()
    }
}