import scala.scalajs.js

object Smth {
  def call1(code: String) = {
    // ruleid: scala-jseval
    js.eval(s"console.log($code)")
    // ok: scala-jseval
    js.eval("FooBar()")
    true
  }
}

object FooBar {
  def call2(code: String) = {
    // ruleid: scala-jseval
    js.eval("console.log(" + code +")")
    // ok: scala-jseval
    js.eval("FooBar()")
    true
  }
}

object VulnerableExample {
  def executeScript(script: String) = {
    // ruleid: scala-jseval
    js.eval(script)
  }
}

object NonVulnerableExample {
  def executeSafeScript(param: Int) = {
    val result = param * 2
    // ok: scala-jseval
    js.eval(s"console.log($result)")
  }
}