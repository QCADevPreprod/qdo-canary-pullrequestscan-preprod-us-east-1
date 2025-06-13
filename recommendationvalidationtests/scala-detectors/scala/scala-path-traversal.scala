class Test {
  def bad1(value:String) = Action {
    if (!Files.exists(Paths.get("public/lists/" + value))) {
      NotFound("File not found")
    } else {
      // ruleid: scala-path-traversal
      val result = Source.fromFile("public/lists/" + value).getLines().mkString // Weak point
      Ok(result)
    }
  }

  def bad2(value:String) = Action {
    if (!Files.exists(Paths.get("public/lists/" + value))) {
      NotFound("File not found")
    } else {
      val filename1 = "public/lists"
      val filename = filename1 + value
      // ruleid: scala-path-traversal
      val result = Source.fromFile(filename).getLines().mkString // Weak point
      Ok(result)
    }
  }

  def bad3(value:String) = Action {
    if (!Files.exists(Paths.get("public/lists/" + value))) {
      NotFound("File not found")
    } else {
      // ruleid: scala-path-traversal
      val result = Source.fromFile("%s/%s".format("public/lists", value)).getLines().mkString // Weak point
      Ok(result)
    }
  }

  def bad4(value:String) = Action {
    if (!Files.exists(Paths.get("public/lists/" + value))) {
      NotFound("File not found")
    } else {
      var filename1 = "public/lists/"
      val filename = filename1.concat(value)
      // ruleid: scala-path-traversal
      val result = Source.fromFile(filename).getLines().mkString // Weak point
      Ok(result)
    }
  }

  def ok(value:String) = Action {
    val filename = "public/lists/" + FilenameUtils.getName(value)

    if (!Files.exists(Paths.get(filename))) {
      NotFound("File not found")
    } else {
      // ok: scala-path-traversal
      val result = Source.fromFile(filename).getLines().mkString // Fix
      Ok(result)
    }
  }
}

class SpotbugsPathTraversal extends HttpServlet { // DETECTS: PT_ABSOLUTE_PATH_TRAVERSAL
  @Override
  @throws[ServletException]
  @throws[IOException]
  override protected def doGet(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input = req.getParameter("input")
    // ruleid:scala-path-traversal
    new File(input + "/abs/path") // BAD, DETECTS: PT_RELATIVE_PATH_TRAVERSAL
  }
  @throws[ServletException]
  @throws[IOException]
  protected def danger2(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input1 = req.getParameter("input1")
    // ruleid:scala-path-traversal
    new File(input1) // BAD
  }
  @throws[ServletException]
  @throws[IOException]
  @throws[URISyntaxException]
  protected def danger3(req: HttpServletRequest, resp: HttpServletResponse): Unit = {
    val input = req.getParameter("test")
    // ruleid:scala-path-traversal
    new File(input)
    // ruleid:scala-path-traversal
    new File("test/" + input, "misc.jpg")
    // ruleid:scala-path-traversal
    new RandomAccessFile(input, "r") // BAD, DETECTS: PT_ABSOLUTE_PATH_TRAVERSAL
    new File(new URI(input))
    new FileReader(input)
    new FileInputStream(input)
    // false positive test
    // ok:scala-path-traversal
    new RandomAccessFile("safe", input)
    new FileWriter("safe".toUpperCase)
    new File(new URI("safe"))
    File.createTempFile(input, "safe")
    File.createTempFile("safe", input)
  }
}

class FileUploadFileName {
  @throws[FileUploadException]
  def handleFileCommon(req: HttpServletRequest): Unit = {
    val upload = new ServletFileUpload(new DiskFileItemFactory())
    val fileItems = upload.parseRequest(req)
    for (item <- fileItems.asScala) {
      // ruleid:scala-path-traversal
      println("Saving " + item.getName() + "...")
    }
  }
}

class FileUploadFileName {
  @throws[FileUploadException]
  def handleFileCommon(req: HttpServletRequest): Unit = {
    val upload = new ServletFileUpload(new DiskFileItemFactory())
    val fileItems = upload.parseRequest(req)
    for (item <- fileItems.asScala) {
      val filename = FilenameUtils.getName(item.getName()) // Get only the filename without the path
      // ok: scala-path-traversal
      println("Saving " + filename + "...")
      // Process the file using the sanitized filename
    }
  }
}

class DevAssetsController(val environment: Environment, val controllerComponents: ControllerComponents)
    extends BaseController
    with ImplicitControllerExecutionContext {
  def sampleabc(path: String): Action[AnyContent] = Action { implicit request =>
      val assetPath = if (conf.Configuration.assets.useHashedBundles) {
        findHashedAsset.lift(path)
      } else {
        findDevAsset.lift(path)
      }

      // ok: scala-path-traversal
      val file = assetPath.map(path => new File(path))
  }
}