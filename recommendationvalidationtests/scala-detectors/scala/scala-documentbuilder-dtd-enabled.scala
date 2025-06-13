import java.io.File
import javax.xml.parsers.DocumentBuilder
import javax.xml.parsers.DocumentBuilderFactory

class Foo {

  def run1(file: File) = {
    // ruleid: scala-documentbuilder-dtd-enabled
    val docBuilderFactory = DocumentBuilderFactory.newInstance()
    val docBuilder = docBuilderFactory.newDocumentBuilder()
    val doc = docBuilder.parse(file)
    doc.getDocumentElement().normalize()
    val foobarList = doc.getElementsByTagName("Foobar")
    foobarList
  }

  def run2(file: File) = {
    // ruleid: scala-documentbuilder-dtd-enabled
    val docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder()
    val doc = docBuilder.parse(file)
    doc.getDocumentElement().normalize()
    val foobarList = doc.getElementsByTagName("Foobar")
    foobarList
  }

  def run3(file: File) = {
    // ruleid: scala-documentbuilder-dtd-enabled
    val docBuilderFactory = DocumentBuilderFactory.newInstance()
    val docBuilder = docBuilderFactory.newDocumentBuilder()
    docBuilder.setFeature("http://apache.org/xml/features/disallow-doctype-decl", false)
    docBuilder.setFeature("http://xml.org/sax/features/external-general-entities", true)
    docBuilder.setFeature("http://xml.org/sax/features/external-parameter-entities", true)

    val doc = docBuilder.parse(file)
    doc.getDocumentElement().normalize()
    val foobarList = doc.getElementsByTagName("Foobar")
    foobarList
  }

  def okRun1(file: File) = {
    // ok: scala-documentbuilder-dtd-enabled
    val docBuilderFactory = DocumentBuilderFactory.newInstance()
    val docBuilder = docBuilderFactory.newDocumentBuilder()
    docBuilder.setXIncludeAware(true)
    docBuilder.setNamespaceAware(true)

    docBuilder.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)
    docBuilder.setFeature("http://xml.org/sax/features/external-general-entities", false)
    docBuilder.setFeature("http://xml.org/sax/features/external-parameter-entities", false)

    val doc = docBuilder.parse(file)
    doc.getDocumentElement().normalize()
    val foobarList = doc.getElementsByTagName("Foobar")
    foobarList
  }

  def okRun2(file: File) = {
    // ok: scala-documentbuilder-dtd-enabled
    val docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder()
    docBuilder.setXIncludeAware(true)
    docBuilder.setNamespaceAware(true)

    docBuilder.setFeature("http://xml.org/sax/features/external-general-entities", false)
    docBuilder.setFeature("http://xml.org/sax/features/external-parameter-entities", false)
    docBuilder.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)

    val doc = docBuilder.parse(file)
    doc.getDocumentElement().normalize()
    val foobarList = doc.getElementsByTagName("Foobar")
    foobarList
  }

  def run_1(xmlFilePath:String) = {

    val file = new File(xmlFilePath)
    // ruleid: scala-documentbuilder-dtd-enabled
    val saxReader = new SAXReader()
    val doc = Try(saxReader.read(file))

    val result = doc match  {
      case Success(r) => r
      case Failure(exception) => println("getDocumentExcetion:" + exception.getMessage)
    }

    result.asInstanceOf[Document]
  }

  def run_2(xmlFilePath:String) = {

    val file = new File(xmlFilePath)
    // ruleid: scala-documentbuilder-dtd-enabled
    val factory = SAXParserFactory.newInstance()
    val saxReader = factory.newSAXParser()
    val doc = Try(saxReader.read(file))

    val result = doc match  {
      case Success(r) => r
      case Failure(exception) => println("getDocumentExcetion:" + exception.getMessage)
    }

    result.asInstanceOf[Document]
  }

  def run_3(xmlFilePath:String) = {

    val file = new File(xmlFilePath)
    // ruleid: scala-documentbuilder-dtd-enabled
    val factory = SAXParserFactory.newInstance()
    val doc = doSomethingWithFactory(factory)

    val result = doc match  {
      case Success(r) => r
      case Failure(exception) => println("getDocumentExcetion:" + exception.getMessage)
    }

    result.asInstanceOf[Document]
  }

  def run_4(xmlFilePath:String) = {

    val file = new File(xmlFilePath)
    // ruleid: scala-documentbuilder-dtd-enabled
    val saxReader = SAXParserFactory.newInstance().newSAXParser()
    val doc = Try(saxReader.read(file))

    val result = doc match  {
      case Success(r) => r
      case Failure(exception) => println("getDocumentExcetion:" + exception.getMessage)
    }

    result.asInstanceOf[Document]
  }

  def okRun_1(xmlFilePath:String) = {

    val file = new File(xmlFilePath)
    // ok: scala-documentbuilder-dtd-enabled
    val saxReader = new SAXReader()
    saxReader.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)
    saxReader.setFeature("http://xml.org/sax/features/external-general-entities", false)
    saxReader.setFeature("http://xml.org/sax/features/external-parameter-entities", false)

    val doc = Try(saxReader.read(file))

    val result = doc match  {
      case Success(r) => r
      case Failure(exception) => println("getDocumentExcetion:" + exception.getMessage)
    }

    result.asInstanceOf[Document]
  }

  def okRun_2(xmlFilePath:String) = {

    val file = new File(xmlFilePath)
    // ok: scala-documentbuilder-dtd-enabled
    val factory = SAXParserFactory.newInstance()
    val saxReader = factory.newSAXParser()
    saxReader.setFeature("http://xml.org/sax/features/external-general-entities", false)
    saxReader.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)
    saxReader.setFeature("http://xml.org/sax/features/external-parameter-entities", false)

    val doc = Try(saxReader.read(file))

    val result = doc match  {
      case Success(r) => r
      case Failure(exception) => println("getDocumentExcetion:" + exception.getMessage)
    }

    result.asInstanceOf[Document]
  }
}