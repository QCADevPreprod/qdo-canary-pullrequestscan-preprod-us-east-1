package strings

import java.net.IDN
import java.net.URI
import java.text.Normalizer

class ImproperUnicode {

  def noncompliant1(s: String) = {
    // ruleid: scala-improper-unicode-normalization
    s.toUpperCase().equals("TEST")
  }


  def compliant1(s: String) = {
    val normalizedInput = Normalizer.normalize(s, Normalizer.Form.NFC)
    val normalizedTest = Normalizer.normalize("TEST", Normalizer.Form.NFC)
    // ok: scala-improper-unicode-normalization
    normalizedInput.toUpperCase() == normalizedTest
  }

  def noncompliant2(s: String) = {
    // ruleid: scala-improper-unicode-normalization
    s.toUpperCase().equalsIgnoreCase("TEST")
  }

  def compliant2(s: String) = {
    val normalizedInput = Normalizer.normalize(s, Normalizer.Form.NFC).toUpperCase
    val normalizedTest = Normalizer.normalize("TEST", Normalizer.Form.NFC).toUpperCase
    // ok: scala-improper-unicode-normalization
    normalizedInput.equals(normalizedTest)
  }
  

  def noncompliant3(s: String) = {
    // ruleid: scala-improper-unicode-normalization
    s.toUpperCase().indexOf("T")
  }
  

  def noncompliant4(s: String) = {
    // ruleid: scala-improper-unicode-normalization
    s.toLowerCase().equals("test")
  }
  

  def noncompliant5(s: String) = {
    // ruleid: scala-improper-unicode-normalization
    s.toLowerCase().equalsIgnoreCase("test")
  }
  

  def noncompliant6(s: String) = {
    // ruleid: scala-improper-unicode-normalization
    s.toLowerCase().indexOf("t")
  }
  

  def noncompliant7(uri: URI) = {
    // ruleid: scala-improper-unicode-normalization
    uri.toASCIIString()
  }

  def compliant3(uri: URI) = {
    // ok: scala-improper-unicode-normalization
    val normalizedURI = Normalizer.normalize(uri.toString, Normalizer.Form.NFC)
    // Perform operations on the normalized URI string
    // ...
  }
  

  def noncompliant8(input: String) = {
    // ruleid: scala-improper-unicode-normalization
    IDN.toASCII(input)
  }
  

  def noncompliant9(s: String) = {
    // ruleid: scala-improper-unicode-normalization
    Normalizer.normalize(s.toUpperCase, Normalizer.Form.NFKC).equals("ADMIN")
  }

  def compliant4(s: String) = {
    val normalizedInput = Normalizer.normalize(s, Normalizer.Form.NFC).toUpperCase
    val normalizedAdmin = Normalizer.normalize("ADMIN", Normalizer.Form.NFC)
    // ok: scala-improper-unicode-normalization
    normalizedInput.equals(normalizedAdmin)
  }

}
