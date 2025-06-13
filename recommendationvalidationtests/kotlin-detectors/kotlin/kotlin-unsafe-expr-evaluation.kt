import org.springframework.expression.Expression
import org.springframework.expression.spel.standard.SpelExpressionParser
import org.apache.commons.jexl3.*
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.net.Socket

class UnsafeEvaluation{

    fun noncompliant1(socket: Socket): Any? {
        BufferedReader(
                InputStreamReader(socket.getInputStream())
        ).use { reader ->
            val string = reader.readLine()
            val parser: SpelExpressionParser = SpelExpressionParser()
            // ruleid: kotlin-unsafe-expr-evaluation
            val expression: Expression = parser.parseExpression(string)
            return expression.getValue()
        }
    }

    fun noncompliant2(socket: Socket) {
        BufferedReader(
                InputStreamReader(socket.getInputStream())
        ).use { reader ->
            val input = reader.readLine()
            val jexl: JexlEngine = JexlBuilder().create()
            // ruleid: kotlin-unsafe-expr-evaluation
            val expression: JexlExpression = jexl.createExpression(input)
            val context: JexlContext = MapContext()
            expression.evaluate(context)
        }
    }

    fun noncompliant3(request: HttpServletRequest): Any? {
        val string = request.getParameter("expr")
        val parser: SpelExpressionParser = SpelExpressionParser()
        // ruleid: kotlin-unsafe-expr-evaluation
        val expression: Expression = parser.parseExpression(string)
        return expression.getValue()
    
    }

    fun noncompliant4(request: HttpServletRequest) {
        val input = request.getParameter("expr")
        val jexl: JexlEngine = JexlBuilder().create()
        // ruleid: kotlin-unsafe-expr-evaluation
        val expression: JexlExpression = jexl.createExpression(input)
        val context: JexlContext = MapContext()
        expression.evaluate(context)
    }

    fun compliant1(input: String): Any? {
        val parser: SpelExpressionParser = SpelExpressionParser()
        // ok: kotlin-unsafe-expr-evaluation
        val expression: Expression = parser.parseExpression(input)
        return expression.getValue()
    }

    fun compliant2() {
        val input = "hardcoded-value"
        val jexl: JexlEngine = JexlBuilder().create()
        // ok: kotlin-unsafe-expr-evaluation
        val expression: JexlExpression = jexl.createExpression(input)
        val context: JexlContext = MapContext()
        expression.evaluate(context)        
    }

    fun compliant3(request: HttpServletRequest): Any? {
        val string = request.getParameter("expr")
        val parser: SpelExpressionParser = SpelExpressionParser()
        // ok: kotlin-unsafe-expr-evaluation
        val expression: Expression = parser.parseExpression("string")
        return expression.getValue()
    }

    fun compliant4(obj: SomeObject) {
        val input = obj.getParameter("expr")
        val jexl: JexlEngine = JexlBuilder().create()
        // ok: kotlin-unsafe-expr-evaluation
        val expression: JexlExpression = jexl.createExpression(input)
        val context: JexlContext = MapContext()
        expression.evaluate(context)
    }

}
