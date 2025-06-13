import org.springframework.context.expression.MapAccessor
import org.springframework.expression.Expression
import org.springframework.expression.spel.standard.SpelExpressionParser
import org.springframework.expression.spel.support.StandardEvaluationContext
import org.springframework.util.PropertyPlaceholderHelper
import org.springframework.util.PropertyPlaceholderHelper.PlaceholderResolver
import org.springframework.web.servlet.View
import org.springframework.web.servlet.support.ServletUriComponentsBuilder

import java.util
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.util._

class ExpressionEvaluationExamples {
  val parser = new SpelExpressionParser()

  def nonCompliant1(untrustedInput: String): Unit = {
    // ruleid: scala-parse-expression
    val expression = parser.parseExpression(untrustedInput)
    
  }

  def nonCompliant2(filePath: String): Unit = {
    val expressionString = Source.fromFile(filePath).getLines().mkString
    // ruleid: scala-parse-expression
    val expression = parser.parseExpression(expressionString)
    
  }

  def compliant1(untrustedInput: String): Unit = {
    val sanitizedInput = sanitizeInput(untrustedInput)
    //ok: scala-parse-expression
    val expression = parser.parseExpression(sanitizedInput)
    
  }

  def compliant2(data: Any): Unit = {
    //ok: scala-parse-expression
    val staticExpression = parser.parseExpression("#root.name")
    val context = new StandardEvaluationContext()
    context.setRootObject(data)
    val result = staticExpression.getValue(context)
  }

  def compliant3(data: Any): Unit = {
    //ok: scala-parse-expression
    val name = data.asInstanceOf[Person].getName
  }
}

abstract class SpelView_noncompliant(val template: String) extends View {
var resolver: PlaceholderResolver
final private val parser = new SpelExpressionParser()
final private val context = new StandardEvaluationContext()

this.context.addPropertyAccessor(new MapAccessor())
this.resolver = (name: String) => {
    // ruleid: scala-parse-expression
    val expression = parser.parseExpression(name)
    val value = expression.getValue(context)
    null
}
override def getContentType = "text/html"

@throws[Exception]
def render(model: java.util.Map[String, _], request: HttpServletRequest, response: HttpServletResponse): Unit = {
    val path = ServletUriComponentsBuilder.fromContextPath(request).build.getPath
    context.setRootObject(model)
    val helper = new PropertyPlaceholderHelper("${", "}")
    val result = helper.replacePlaceholders(template, resolver)
    response.setContentType(getContentType)
    response.getWriter.append(result)
}
}


abstract class SpelView_compliant(val template: String) extends View {
  var resolver: PlaceholderResolver
  final private val parser = new SpelExpressionParser()
  final private val context = new StandardEvaluationContext()

  this.context.addPropertyAccessor(new MapAccessor())
  this.resolver = (name: String) => {
    // Validate and sanitize the input
    val sanitizedName = sanitizeInput(name)
    //ok: scala-parse-expression
    val expression = parser.parseExpression(sanitizedName)
    val value = expression.getValue(context)
    null
  }
  override def getContentType = "text/html"

  @throws[Exception]
  def render(model: java.util.Map[String, _], request: HttpServletRequest, response: HttpServletResponse): Unit = {
    val path = ServletUriComponentsBuilder.fromContextPath(request).build.getPath
    context.setRootObject(model)
    val helper = new PropertyPlaceholderHelper("${", "}")
    val result = helper.replacePlaceholders(template, resolver)
    response.setContentType(getContentType)
    response.getWriter.append(result)
  }

  // Helper function to sanitize user input
  private def sanitizeInput(input: String): String = {
    // Implement input validation and sanitization logic here
    // For example, you can whitelist or blacklist certain characters or patterns
    val allowedPattern = "[a-zA-Z0-9_]+"
    input.replaceAll(s"[$allowedPattern]", "")
  }
}

case class Person(name: String)