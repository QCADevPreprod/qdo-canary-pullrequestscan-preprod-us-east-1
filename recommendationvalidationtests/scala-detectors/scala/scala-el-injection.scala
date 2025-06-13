import javax.el._
import javax.faces.context.FacesContext


class ELInjection {
  def valueExpr(expression: String) = {
    val context = FacesContext.getCurrentInstance
    val expressionFactory = context.getApplication.getExpressionFactory
    val elContext = context.getELContext
    // ruleid: scala-el-injection
    val vex = expressionFactory.createValueExpression(elContext, expression, classOf[Nothing])
    vex.getValue(elContext).asInstanceOf[Nothing]
  }

  def methodExpr(expression: String) = {
    val context = FacesContext.getCurrentInstance
    val expressionFactory = context.getApplication.getExpressionFactory
    val elContext = context.getELContext
    // ruleid: scala-el-injection
    val ex = expressionFactory.createMethodExpression(elContext, expression, classOf[Nothing], null)
    ex.getMethodInfo(elContext)
  }

  def safeValueExpr(expression: String) = {
    val context = FacesContext.getCurrentInstance
    val expressionFactory = context.getApplication.getExpressionFactory
    val elContext = context.getELContext
    // Validate and sanitize the expression before using it
    val safeExpression = sanitizeExpression(expression)
    // ok: scala-el-injection
    val vex = expressionFactory.createValueExpression(elContext, safeExpression, classOf[Nothing])
    vex.getValue(elContext).asInstanceOf[Nothing]
  }

  def safeMethodExpr(expression: String) = {
    val context = FacesContext.getCurrentInstance
    val expressionFactory = context.getApplication.getExpressionFactory
    val elContext = context.getELContext
    // Validate and sanitize the expression before using it
    val safeExpression = sanitizeExpression(expression)
    // ok: scala-el-injection
    val ex = expressionFactory.createMethodExpression(elContext, safeExpression, classOf[Nothing], null)
    ex.getMethodInfo(elContext)
  }

  def valueExprWithUserInput(userInput: String): Any = {
    val context = FacesContext.getCurrentInstance
    val expressionFactory = context.getApplication.getExpressionFactory
    val elContext = context.getELContext
    // ruleid: scala-el-injection
    val vex = expressionFactory.createValueExpression(elContext, userInput, classOf[Any])
    vex.getValue(elContext)
  }

  def methodExprWithUserInput(userInput: String): Unit = {
    val context = FacesContext.getCurrentInstance
    val expressionFactory = context.getApplication.getExpressionFactory
    val elContext = context.getELContext
    // ruleid: scala-el-injection
    val mex = expressionFactory.createMethodExpression(elContext, userInput, classOf[Any], Array.empty)
    mex.invoke(elContext, null)
  }

  def evaluatorWithUserInput(userInput: String): Any = {
    // ruleid: scala-el-injection
    val evaluator = ExpressionEvaluator.parseExpression(userInput)
    evaluator.evaluate(Map.empty)
  }

   def valueExprNonVulnerable(): String = {
    val context = FacesContext.getCurrentInstance
    val expressionFactory = context.getApplication.getExpressionFactory
    val elContext = context.getELContext
    // ok: scala-el-injection
    val vex = expressionFactory.createValueExpression(elContext, "#{bean.property}", classOf[String])
    vex.getValue(elContext).asInstanceOf[String]
  }

  def methodExprNonVulnerable(): Unit = {
    val context = FacesContext.getCurrentInstance
    val expressionFactory = context.getApplication.getExpressionFactory
    val elContext = context.getELContext
    // ok: scala-el-injection
    val mex = expressionFactory.createMethodExpression(elContext, "#{bean.method()}", classOf[Void], Array.empty)
    mex.invoke(elContext, null)
  }

  def evaluatorNonVulnerable(): Int = {
    import javax.servlet.jsp.el.ExpressionEvaluator
    val expression = "1 + 2"
    // ok: scala-el-injection
    val evaluator = ExpressionEvaluator.parseExpression(expression)
    evaluator.evaluate(Map.empty).asInstanceOf[Int]
  }
}
