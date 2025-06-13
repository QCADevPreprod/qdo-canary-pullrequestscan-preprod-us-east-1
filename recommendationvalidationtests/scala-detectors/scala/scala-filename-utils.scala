package file

import org.apache.commons.io.FilenameUtils._
import java.io.File
import java.io.IOException
import org.apache.commons.io.FilenameUtils


object FilenameUtils {
  @throws[IOException]
  def main(args: Array[String]): Unit = {
    val maliciousPath = "/test%00/././../../././secret/note.cfg\u0000example.jpg"
    testPath(maliciousPath)
  }

  @throws[IOException]
  private def testPath_ok(maliciousPath: String): Unit = {
    // ruleid: scala-filename-utils
    val path = normalize(maliciousPath)
    System.out.println("Expected:" + path + " -> Actual:" + canonical(path))
    // ruleid: scala-filename-utils
    val extension = getExtension(maliciousPath)
    // ruleid: scala-filename-utils
    System.out.println("Expected:" + extension + " -> Actual:" + getExtension(canonical(path)))
    // ruleid: scala-filename-utils
    val isExt = isExtension(maliciousPath, "jpg")
    // ruleid: scala-filename-utils
    System.out.println("Expected:" + isExt + " -> Actual:" + isExtension(canonical(path), "jpg"))
    // ruleid: scala-filename-utils
    val name = getName(maliciousPath)
    // ruleid: scala-filename-utils
    System.out.println("Expected:" + name + " -> Actual:" + getName(canonical(name)))
    // ruleid: scala-filename-utils
    val baseName = getBaseName(maliciousPath)
    // ruleid: scala-filename-utils
    System.out.println("Expected:" + baseName + " -> Actual:" + getBaseName(canonical(baseName)))
  }


  @throws[IOException]
  private def testPath(maliciousPath: String): Unit = {
    val validatedPath = validatePath(maliciousPath)
    val canonicalPath = getCanonicalPath(validatedPath)

    println("Canonical Path: " + canonicalPath)
    println("Extension: " + getFileExtension(canonicalPath))
    //ok:scala-filename-utils
    println("Is 'jpg' extension: " + isExtension(canonicalPath, "jpg"))
    println("File Name: " + getFileName(canonicalPath))
    //ok:scala-filename-utils
    println("Base Name: " + getBaseName(canonicalPath))
  }

  @throws[IOException]
  private def validatePath(path: String): String = {
    // Implement your validation logic here
    // For example, ensure that the path is within a specific directory
    // and does not contain any directory traversal sequences
    // Here's a simple example of validating against directory traversal
    if (path.contains("..")) {
      throw new IOException("Invalid path")
    }
    path
  }

  @throws[IOException]
  private def getCanonicalPath(path: String): String = new File(path).getCanonicalPath

  private def getFileExtension(path: String): String = {
    val fileName = new File(path).getName
    val dotIndex = fileName.lastIndexOf('.')
    if (dotIndex != -1) fileName.substring(dotIndex + 1) else ""
  }

  private def isExtension(path: String, extension: String): Boolean = {
    getFileExtension(path).equalsIgnoreCase(extension)
  }

  private def getFileName(path: String): String = new File(path).getName

  private def getBaseName(path: String): String = new File(path).getName.split("\\.")(0)

  private def makeInitFiles(conf: CodegenConfig, packageFolder: String = ""): Unit = {
    val dir = join(conf.pySrcDir, "synapse", "ml", packageFolder)
    val packageString = if (packageFolder != "") packageFolder.replace("/", ".") else ""
    val importStrings = if (packageFolder == "/services") {
      dir.listFiles.filter(_.isDirectory)
        .filter(folder => folder.getName != "langchain").sorted
        .map(folder => s"from synapse.ml$packageString.${folder.getName} import *\n").mkString("")
    } else {
      dir.listFiles.filter(_.isFile).sorted
        .map(_.getName)
        .filter(name => name.endsWith(".py") && !name.startsWith("_") && !name.startsWith("test"))
        .map(name => s"from synapse.ml$packageString.${getBaseName(name)} import *\n").mkString("")
    }
    val initFile = new File(dir, "__init__.py")
    if (packageFolder != "/cognitive"){
      if (packageFolder != "") {
        writeFile(initFile, conf.packageHelp(importStrings))
      } else if (initFile.exists()) {
        initFile.delete()
      }
    }
    dir.listFiles().filter(_.isDirectory).foreach(f =>
      makeInitFiles(conf, packageFolder + "/" + f.getName)
    )
  }
override def initialize(inputSplit: InputSplit, context: TaskAttemptContext): Unit = {
    // the file input
    val fileSplit = inputSplit.asInstanceOf[FileSplit]

    val file = fileSplit.getPath        // the actual file we will be reading from
    val conf = context.getConfiguration // job configuration
    val fs = file.getFileSystem(conf)   // get the filesystem
    filename = file.toString            // open the File

    inputStream = fs.open(file)
    rng.setSeed(filename.hashCode.toLong ^ seed)
    if (inspectZip && FilenameUtils.getExtension(filename) == "zip") {
        zipIterator = new ZipIterator(inputStream, filename, rng, subsample)
    }
  }
def fromFile[T: ClassTag](file: File, serdes: Seq[SerDes[_]] = Seq.empty): Try[T] = Try {
  // ruleid: scala-filename-utils
    val extension = FilenameUtils.getExtension(file.getPath).toLowerCase
    val mapper: ObjectMapper =
      extension match {
        case "json" => jsonMapper(serdes)
        case y if "yml" == y || "yaml" == y => yamlMapper(serdes)
        case _ => throw new IllegalArgumentException(
          s"Unsupported file type '$extension'. Supported file types: json, yml, yaml")
      }
    mapper.readValue(file, classTag[T].runtimeClass).asInstanceOf[T]
  }


}

