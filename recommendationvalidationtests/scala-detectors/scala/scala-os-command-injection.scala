import java.io.IOException
import java.util.Arrays


class Foo {
  def noncompliant1(command: String, arg1: String) = {
    import sys.process._
    // ruleid: scala-os-command-injection
    Seq(command, arg1).!
  }

  def noncompliant2(command: String) = {
    import sys.process._
    // ruleid: scala-os-command-injection
    val result = Seq(command, "--some-arg").!!
    return result
  }

  def noncompliant3(message: String) = {
    import sys.process._
    // ruleid: scala-os-command-injection
    Seq("sh", "-c", message).!
  }

  def noncompliant4(message: String) = {
    import sys.process._
    // ruleid: scala-os-command-injection
    val result = Seq("bash", "-c", message).!!
    return result
  }

  def noncompliant5(value:String) = Action {
    import sys.process._

    // ruleid: scala-os-command-injection
    val result = value.!!
    Ok("Result:\n"+result)
  }

  def noncompliant6(value:String) = Action {
    import sys.process._

    // ruleid: scala-os-command-injection
    val result = value.!
    Ok("Result:\n"+result)
  }

  def noncompliant7(value:String) = Action {
    import sys.process._

    // ruleid: scala-os-command-injection
    val result = value.lazyLines
    Ok("Result:\n"+result)
  }

  def noncompliant8(value:String) = Action {
    import sys.process._

    // ruleid: scala-os-command-injection
    val result = value.!!
    Ok("Result:\n"+result)
  }

  def noncompliant9(value:String) = Action {
    import sys.process._

    // ruleid: scala-os-command-injection
    val result = value
    Ok("Result:\n"+result)
  }

  def noncompliant10(value:String) = Action {
    import sys.process._

    // ruleid: scala-os-command-injection
    val result = value.lazyLines
    Ok("Result:\n"+result)
  }

  @throws[IOException]
  def noncompliant11(cmd: String): Unit = {
    val r = Runtime.getRuntime
    r.exec(cmd)
    r.exec(Array[String]("test"))
    // ruleid: scala-os-command-injection
    r.exec(Array[String]("bash", cmd))
    // ruleid: scala-os-command-injection
    r.exec(Array[String]("/bin/sh", "-c", cmd))
  }

  def noncompliant12(cmd: String): Unit = {
    val b = new ProcessBuilder()
    // ruleid: scala-os-command-injection
    b.command(cmd)
    b.command("test")
    // ruleid: scala-os-command-injection
    b.command(Arrays.asList("/bin/sh", "-c", cmd))
  }

  def compliant1(message: String) = {
    import sys.process._
    // ok: scala-os-command-injection
    Seq("ls", "-la").!!
  }

  def compliant2(message: String) = {
    import sys.process._
    // ok: scala-os-command-injection
    Seq("sh", "-c", "ls").!!
  }

  def compliant3(message: String) = {
    import sys.process._
    // ok: scala-os-command-injection
    Seq(message, "123")
  }

  def compliant4(command: String) = {
    // ok: scala-os-command-injection
    val result = Seq(command, "--some-arg").!!
    return result
  }

  def compliant5(message: String) = {
    import sys.process._
    // ok: scala-os-command-injection
    Seq("ls", "-la").!!
  }

  def compliant6(message: String) = {
    import sys.process._
    // ok: scala-os-command-injection
    Seq("sh", "-c", "ls").!!
  }

  def compliant7(message: String) = {
    import sys.process._
    // ok: scala-os-command-injection
    Seq("sh", "-c", message)
  }

  def compliant8(message: String) = {
    // ok: scala-os-command-injection
    val result = Seq("bash", "-c", message).!!
    return result
  }


  def compliant9(value:String) = Action {
    import sys.process._

    // ok: scala-os-command-injection
    val cmd = "ls -lah"
    val result = cmd.!
    Ok("Result:\n"+result)
  }

  def compliant10() = Action {
    import sys.process._

    // ok: scala-os-command-injection
    val cmd = Seq("ls", "-lah")
    val result = cmd.!
    Ok("Result:\n"+result)
  }

  def compliant11() = Action {
    import sys.process._

    // ok: scala-os-command-injection
    val result = Seq("ls", "-lah").!!
    Ok("Result:\n"+result)
  }

  def compliant12(sender: Actor) = {
    // ok: scala-os-command-injection
    sender ! "FooBar"
  }

  def executeCommand2(value:String) = Action {
    import sys.process._

    // ruleid: scala-os-command-injection
    val result = value !
    Ok("Result:\n"+result)
  }

}