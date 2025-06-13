import java.time.Clock
import pdi.jwt.{JwtJson, JwtAlgorithm, JwtArgonaut, JwtCirce}
import play.api.libs.json.Json
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTCreationException

class FooBar {
  val secretKey = "foobar"

  def noncompliant1(token: String) = {
    val algo = JwtAlgorithm.HS256
    // Non-compliant: hardcoded JWT secret is used.
    // ruleid: scala-jwt-hardcoded-secret
    JwtArgonaut.decodeJson(token, secretKey, algo)
  }

  def noncompliant2() = {
    val claim = Json.obj(("user", 1), ("nbf", 1431520421))
    val key1 = "secretKey"
    val algo = JwtAlgorithm.HS256
    // Non-compliant: hardcoded JWT secret is used.
    // ruleid: scala-jwt-hardcoded-secret
    val token = JwtJson.encode(claim, key1, algo)
  }

  private val JWT_KEY = "foobar"

  def noncompliant3() = {
    val claim = Json.obj(("user", 1), ("nbf", 1431520421))
    val key2 = getSecretFromEnv()
    val algo = JwtAlgorithm.HS256
    // Non-compliant: hardcoded JWT secret is used.
    // ruleid: scala-jwt-hardcoded-secret
    val token = JwtCirce.encode(claim, this.JWT_KEY, algo)
    // Non-compliant: hardcoded JWT secret is used.
    // ruleid: scala-jwt-hardcoded-secret
    JwtCirce.decodeJson(token, this.JWT_KEY, Seq(JwtAlgorithm.HS256))
  }

  def noncompliant4() = {
      try {
          // Non-compliant: hardcoded JWT secret is used.
          // ruleid: scala-jwt-hardcoded-secret
          Algorithm algorithm = Algorithm.HMAC256("secret");
          String token = JWT.create()
              .withIssuer("auth0")
              .sign(algorithm);
      } catch (exception: JWTCreationException){
          //Invalid Signing configuration / Couldn't convert Claims.
      }
  }

  def compliant1(token: String) = {
    val algo = JwtAlgorithm.HS256
    // Compliant: getSecretFromEnv method used to get JWT secret.
    // ok: scala-jwt-hardcoded-secret
    JwtArgonaut.decodeJson(token, getSecretFromEnv(), algo)
  }

  def compliant2(secretKey: String) = {
      try {
          // Compliant: hardcoded JWT secret is not used.
          // ok: scala-jwt-hardcoded-secret
          Algorithm algorithm = Algorithm.HMAC256(secretKey);
          String token = JWT.create()
              .withIssuer("auth0")
              .sign(algorithm);
      } catch (exception: JWTCreationException){
          //Invalid Signing configuration / Couldn't convert Claims.
      }
  }


  def compliant3() = {
    val claim = Json.obj(("user", 1), ("nbf", 1431520421))
    // Compliant: Environment variable is used to get JWT secret.
    // ok: scala-jwt-hardcoded-secret
    JwtJson.decodeJson(token, keyFromEnv, Seq(JwtAlgorithm.HS256))
  }

  def compliant4() = {
    val claim = Json.obj(("user", 1), ("nbf", 1431520421))
    val key2 = getSecretFromEnv()
    val algo = JwtAlgorithm.HS256
    // Compliant: getSecretFromEnv method used to get JWT secret.
    // ok: scala-jwt-hardcoded-secret
    val token = JwtJson.encode(claim, key2, algo)
    // Compliant: getSecretFromEnv method used to get JWT secret.
    // ok: scala-jwt-hardcoded-secret
    JwtJson.decodeJson(token, key2, Seq(JwtAlgorithm.HS256))
  }

}