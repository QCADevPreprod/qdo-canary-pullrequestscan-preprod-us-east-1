package smtp

import org.apache.commons.mail.Email
import org.apache.commons.mail.SimpleEmail
import org.apache.commons.mail.MultiPartEmail
import org.apache.commons.mail.HtmlEmail
import org.apache.commons.mail.ImageHtmlEmail

object InsecureSmtp {

  @throws[Exception]
  def testCase_Compliant1(): Unit = {
    val email = new SimpleEmail
    email.setHostName("smtp.googlemail.com")
    // ok: scala-insecure-smtp
    email.setSSLOnConnect(false) //SSL is not enabled
  }

  @throws[Exception]
  def testCase_NonCompliant1(): Unit = {
    val email2 = new SimpleEmail
    email2.setHostName("smtp2.googlemail.com")
    // ruleid: scala-insecure-smtp
    email2.setSSLOnConnect(true) //SSL is enabled without server identity check
  }

  @throws[Exception]
  def testCase_Compliant2(): Unit = {
    val email3 = new SimpleEmail
    email3.setHostName("smtp3.googlemail.com")
    email3.setSSLCheckServerIdentity(true) //SSL is enabled after server identity check
    // ok: scala-insecure-smtp
    email3.setSSLOnConnect(true)
    
  }

  @throws[Exception]
  def testCase_NonCompliant2(): Unit = {
    val emailMulti = new MultiPartEmail
    emailMulti.setHostName("mail.myserver.com")
    // ruleid: scala-insecure-smtp
    emailMulti.setSSLOnConnect(true) //SSL is enabled without server identity check
  }

  @throws[Exception]
  def testCase_Compliant3(): Unit = {
    val emailMulti2 = new MultiPartEmail
    emailMulti2.setHostName("mail2.myserver.com")
    // ruleid: scala-insecure-smtp
    emailMulti2.setSSLOnConnect(true)
    emailMulti2.setSSLCheckServerIdentity(true) //SSL is enabled before server identity check
  }

  @throws[Exception]
  def testCase_NonCompliant3(): Unit = {
    val htmlEmail = new HtmlEmail
    htmlEmail.setHostName("mail.myserver.com")
    // ruleid: scala-insecure-smtp
    htmlEmail.setSSLOnConnect(true) //SSL is enabled without server identity check
  }

  @throws[Exception]
  def testCase_Compliant4(): Unit = {
    val htmlEmail2 = new HtmlEmail
    htmlEmail2.setHostName("mail2.myserver.com")
    // ruleid: scala-insecure-smtp
    htmlEmail2.setSSLOnConnect(true)
    htmlEmail2.setSSLCheckServerIdentity(true) //SSL is enabled before server identity check
  }

  @throws[Exception]
  def testCase_NonCompliant4(): Unit = {
    val imageEmail = new ImageHtmlEmail
    imageEmail.setHostName("mail.myserver.com")
    // ruleid: scala-insecure-smtp
    imageEmail.setSSLOnConnect(true)
    imageEmail.setSSLCheckServerIdentity(true) //SSL is enabled before server identity check
  }

  @throws[Exception]
  def testCase_Compliant5(): Unit = {
    val imageEmail2 = new ImageHtmlEmail
    imageEmail2.setHostName("mail2.myserver.com")
    imageEmail2.setSSLCheckServerIdentity(true)
    // ok: scala-insecure-smtp
    imageEmail2.setSSLOnConnect(true) //server identity check is done before enabling SSL
  }

  @throws[Exception]
  def testCase_NonCompliant5(): Unit = {
    val imageEmail3 = new ImageHtmlEmail
    imageEmail3.setHostName("mail3.myserver.com")
    // ruleid: scala-insecure-smtp
    imageEmail3.setSSLOnConnect(true) //SSL is enabled without server identity check
  }

  @throws[Exception]
  def testCase_Compliant6(): Unit = {
    val imageEmail4 = new ImageHtmlEmail
    imageEmail4.setHostName("mail4.myserver.com")
    imageEmail4.setSSLCheckServerIdentity(true) //SSL is enabled after server identity check
    // ok: scala-insecure-smtp
    imageEmail4.setSSLOnConnect(true)
    
  }

  def main(args: Array[String]): Unit = {
    testCase_Compliant1()
    testCase_NonCompliant1()
    testCase_Compliant2()
    testCase_NonCompliant2()
    testCase_Compliant3()
    testCase_NonCompliant3()
    testCase_Compliant4()
    testCase_NonCompliant4()
    testCase_Compliant5()
    testCase_NonCompliant5()
    testCase_Compliant6()
  }
}