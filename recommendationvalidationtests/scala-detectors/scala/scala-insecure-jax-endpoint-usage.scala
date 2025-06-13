import javax.ws.rs.Path
import org.apache.commons.text.StringEscapeUtils
import javax.jws.WebMethod
import javax.jws.WebService


@Path("/test")
@WebService
class JaxEndpoint {

  @Path("/hello0")
  // ruleid: scala-insecure-jax-endpoint-usage
  def nonCompliant(user: String) = "Hello " + user

  @Path("/hello1")
  def nonCompliant1(user: String) = {
    val tainted = randomFunc(user)
    // ruleid: scala-insecure-jax-endpoint-usage
    "Hello " + tainted
  }

  @Path("/hello2")
  def nonCompliant3(user: String) = {
    // ruleid: scala-insecure-jax-endpoint-usage
    "Hello " + user
  }

  @Path("/hello2")
  def nonCompliant4(user: String): String = {
    // ruleid: scala-insecure-jax-endpoint-usage
    return "Hello " + user
  }

  @Path("/hello2")
  def compliant1(user: String) = {
    // ok: scala-insecure-jax-endpoint-usage
    val sanitized = StringEscapeUtils.unescapeJava(user)
    // ok: scala-insecure-jax-endpoint-usage
    "Hello " + sanitized 
  }

  def compliant2(user: String): String = {
    // ok: scala-insecure-jax-endpoint-usage
    return "Hello " + user
  }

  @WebMethod(operationName = "timestamp")
  // ok: scala-insecure-jax-endpoint-usage
  def ping = System.currentTimeMillis

  @WebMethod
  // ruleid: scala-insecure-jax-endpoint-usage
  def nonCompliant5(user: String) = "Hello " + user

  @WebMethod
  def nonCompliant6(user: String) = {
    val tainted = randomFunc(user)
    // ruleid: scala-insecure-jax-endpoint-usage
    "Hello " + tainted
  }

  @WebMethod
  def nonCompliant7(user: String) = {
    // ruleid: scala-insecure-jax-endpoint-usage
    "Hello " + user
  }

  @WebMethod(action="/hello2")
  def compliant3(user: String) = {
    // ok: scala-insecure-jax-endpoint-usage
    val sanitized = StringEscapeUtils.unescapeJava(user)
    // ok: scala-insecure-jax-endpoint-usage
    "Hello " + sanitized
  }

  def compliant4(user: String): String = {
    // ok: scala-insecure-jax-endpoint-usage
    return "Hello " + user
  }

  @WebMethod
  def compliant5(user: String) = {
    // ok: scala-insecure-jax-endpoint-usage
    val sanitized = StringEscapeUtils.unescapeJava(user)
    "Hello " + sanitized
  }

  @POST
  @Path("/create")
  @Consumes(Array(MediaType.MULTIPART_FORM_DATA))
  def createDataset(
      @Auth user: SessionUser,
      @FormDataParam("datasetName") datasetName: String,
      @FormDataParam("datasetDescription") datasetDescription: String,
      @FormDataParam("isDatasetPublic") isDatasetPublic: String,
      @FormDataParam("initialVersionName") initialVersionName: String,
      files: FormDataMultiPart
  ): DashboardDataset = {

    withTransaction(context) { ctx =>
      val uid = user.getUid
      val datasetOfUserDao: DatasetUserAccessDao = new DatasetUserAccessDao(ctx.configuration())

      val dataset: Dataset = new Dataset()
      dataset.setName(datasetName)
      dataset.setDescription(datasetDescription)
      dataset.setIsPublic(isDatasetPublic.toByte)
      dataset.setOwnerUid(uid)

      val createdDataset = ctx
        .insertInto(DATASET)
        .set(ctx.newRecord(DATASET, dataset))
        .returning()
        .fetchOne()

      val did = createdDataset.getDid
      val datasetPath = PathUtils.getDatasetPath(did)

      val datasetUserAccess = new DatasetUserAccess()
      datasetUserAccess.setDid(createdDataset.getDid)
      datasetUserAccess.setUid(uid)
      datasetUserAccess.setPrivilege(DatasetUserAccessPrivilege.WRITE)
      datasetOfUserDao.insert(datasetUserAccess)

      // initialize the dataset directory
      GitVersionControlLocalFileStorage.initRepo(datasetPath)

      // create the initial version of the dataset
      val createdVersion =
        createNewDatasetVersionFromFormData(ctx, did, uid, initialVersionName, files)

      createdVersion match {
        case Some(_) =>
        case None    =>
          // none means creation failed, user does not submit any files when creating the dataset
          throw new BadRequestException(ERR_DATASET_CREATION_FAILED_MESSAGE)
      }

      DashboardDataset(
        new Dataset(
          createdDataset.getDid,
          createdDataset.getOwnerUid,
          createdDataset.getName,
          createdDataset.getIsPublic,
          createdDataset.getDescription,
          createdDataset.getCreationTime
        ),
        DatasetUserAccessPrivilege.WRITE,
        isOwner = true
      )
    }
  }
}
