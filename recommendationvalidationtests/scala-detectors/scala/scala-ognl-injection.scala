import com.opensymphony.xwork2.ognl.OgnlReflectionProvider
import com.opensymphony.xwork2.ognl.OgnlUtil
import com.opensymphony.xwork2.util.TextParseUtil
import ognl.OgnlException
import com.opensymphony.xwork2.ognl

import javax.management.ReflectionException
import java.beans.IntrospectionException
import java.util


class OgnlInjection {

  @throws[OgnlException]
  @throws[ReflectionException]
  def noncompliant1(ognlUtil: OgnlUtil, input: String, propsInput: util.HashMap[String,String]): Unit = {
    
    // ruleid: scala-ognl-injection
    ognlUtil.setValue(input, null, null, "12345")


    // ruleid: scala-ognl-injection
    ognlUtil.getValue(input, null, null, null)


    // ruleid: scala-ognl-injection
    ognlUtil.setProperty(input, "12345", null, null)


    // ruleid: scala-ognl-injection
    ognlUtil.setProperty(input, "12345", null, null, true)
    

    // ruleid: scala-ognl-injection
    ognlUtil.setProperties(propsInput, new Object())
    

    // ruleid: scala-ognl-injection
    ognlUtil.setProperties(propsInput, null, null, true)
    
    // ruleid: scala-ognl-injection
    ognlUtil.setProperties(propsInput, null, true)
    
    // ruleid: scala-ognl-injection
    ognlUtil.setProperties(propsInput, null)
    
    // ruleid: scala-ognl-injection
    ognlUtil.compile(input)
    
    // ruleid: scala-ognl-injection
    ognlUtil.compile(input)
  }

  @throws[OgnlException]
  @throws[ReflectionException]
  def compliant1(ognlUtil: OgnlUtil): Unit = {
    val input = "thisissafe"
    val map = new util.HashMap[String,String]()
    // ok: scala-ognl-injection
    ognlUtil.setValue(input, null, null, "12345")
    // ok: scala-ognl-injection
    ognlUtil.getValue(input, null, null, null)
    // ok: scala-ognl-injection
    ognlUtil.setProperty(input, "12345", null, null)
    // ok: scala-ognl-injection
    ognlUtil.setProperty(input, "12345", null, null, true)
    // ok: scala-ognl-injection
    ognlUtil.setProperties(map, null, null)
    // ok: scala-ognl-injection
    ognlUtil.setProperties(map, null, null, true)
    // ok: scala-ognl-injection
    ognlUtil.setProperties(map, null, true)
    // ok: scala-ognl-injection
    ognlUtil.setProperties(map, null)
    // ok: scala-ognl-injection
    ognlUtil.compile(input)
    // ok: scala-ognl-injection
    ognlUtil.compile(input)
  }

  @throws[ReflectionException]
  @throws[IntrospectionException]
  def compliant2(input: Nothing, propsInput: Nothing, reflectionProvider: Nothing, `type`: Nothing): Unit = {
    var reflectionProvider: OgnlReflectionProvider = null
    // ok: scala-ognl-injection
    reflectionProvider.getGetMethod(`type`, input)
    // ok: scala-ognl-injection
    reflectionProvider.getSetMethod(`type`, input)
    // ok: scala-ognl-injection
    reflectionProvider.getField(`type`, input)
    // ok: scala-ognl-injection
    reflectionProvider.setProperties(propsInput, null, null, true)
    // ok: scala-ognl-injection
    reflectionProvider.setProperties(propsInput, null, null)
    // ok: scala-ognl-injection
    reflectionProvider.setProperties(propsInput, null)
    // ok: scala-ognl-injection
    reflectionProvider.setProperty(input, "test", null, null)
    // ok: scala-ognl-injection
    reflectionProvider.getValue(input, null, null)
    // ok: scala-ognl-injection
    reflectionProvider.setValue(input, null, null, null)
  }

  @throws[IntrospectionException]
  @throws[ReflectionException]
  def compliant3(reflectionProvider: Nothing, `type`: Nothing): Unit = {
    var reflectionProvider: OgnlReflectionProvider = null
    val input = "thisissafe"
    val constant1 = ""
    val constant2 = ""

    val map = new util.HashMap[String,String]()
    // ok: scala-ognl-injection
    reflectionProvider.getGetMethod(`type`, input)
    // ok: scala-ognl-injection
    reflectionProvider.getSetMethod(`type`, input)
    // ok: scala-ognl-injection
    reflectionProvider.getField(`type`, input)
    // ok: scala-ognl-injection
    reflectionProvider.setProperties(map, null, null, true)
    // ok: scala-ognl-injection
    reflectionProvider.setProperties(map, null, null)
    // ok: scala-ognl-injection
    reflectionProvider.setProperties(map, null)
    // ok: scala-ognl-injection
    reflectionProvider.setProperty("test", constant1, null, null)
    // ok: scala-ognl-injection
    reflectionProvider.getValue(input, null, null)
    // ok: scala-ognl-injection
    reflectionProvider.setValue(input, null, null, null)
  }

  def noncompliant3(input: String): Unit = {
    // ruleid: scala-ognl-injection
    TextParseUtil.translateVariables(input, null)
    
    // ruleid: scala-ognl-injection
    TextParseUtil.translateVariables(input, null, null)
    
    // ruleid: scala-ognl-injection
    TextParseUtil.translateVariables('a', input, null)
    
    // ruleid: scala-ognl-injection
    TextParseUtil.translateVariables('a', input, null, null)
    
    // ruleid: scala-ognl-injection
    TextParseUtil.translateVariables('a', input, null, null, null, 0)
  }

  def compliant4(stack: Nothing, parsedValueEvaluator: Nothing, `type`: Nothing): Unit = {
    val input = "1+1"
    // ok: scala-ognl-injection
    TextParseUtil.translateVariables(input, stack)
    // ok: scala-ognl-injection
    TextParseUtil.translateVariables(input, stack, parsedValueEvaluator)
    // ok: scala-ognl-injection
    TextParseUtil.translateVariables('a', input, stack)
    // ok: scala-ognl-injection
    TextParseUtil.translateVariables('a', input, stack, `type`)
    // ok: scala-ognl-injection
    TextParseUtil.translateVariables('a', input, stack, `type`, parsedValueEvaluator, 0)
  }
}