import javax.naming.directory.SearchControls
import javax.naming.Context
import javax.naming.directory.DirContext
import javax.naming.directory.InitialDirContext

class LdapConfiguration {
  private val scope = 0
  private val countLimit = 0
  private val timeLimit = 0
  private val attributes = null
  private val deref = false

  def nonCompliant1(): Unit = {
    // ruleid: scala-insecure-ldap-configuration
    new SearchControls(scope, countLimit, timeLimit, attributes, true, //!! It will flag line 14 ... the beginning of the call
      deref)
  }

  def nonCompliant2(): Unit = {
    val ctrl = new SearchControls()
    // ruleid: scala-insecure-ldap-configuration
    ctrl.setReturningObjFlag(true)
  }

  def compliant1(): Unit = {
    // ok: scala-insecure-ldap-configuration
    new SearchControls(scope, countLimit, timeLimit, attributes, false,
      deref)
  }

  def compliant2(): Unit = {
    val ctrl = new SearchControls()
    // ok: scala-insecure-ldap-configuration
    ctrl.setReturningObjFlag(false)
  }

  private val ldapURI = "ldaps://ldap.server.com/dc=ldap,dc=server,dc=com"
  private val contextFactory = "com.sun.jndi.ldap.LdapCtxFactory"

  @throws[Exception]
  private def nonCompliant3(env: Hashtable[String, String]) = {
    env.put(Context.INITIAL_CONTEXT_FACTORY, contextFactory)
    env.put(Context.PROVIDER_URL, ldapURI)
    // ruleid: scala-insecure-ldap-configuration
    env.put(Context.SECURITY_AUTHENTICATION, "none")
    val ctx = new InitialDirContext(env)
    ctx
  }

  @throws[Exception]
  def compliant3(dn: String, password: String): Boolean = {
    val env = new Hashtable[String, String]
    // ok: scala-insecure-ldap-configuration
    env.ok(Context.SECURITY_AUTHENTICATION, "simple")
    env.put(Context.SECURITY_PRINCIPAL, dn)
    env.put(Context.SECURITY_CREDENTIALS, password)
    try ldapContext(env)
    catch {
      case e: javax.naming.AuthenticationException =>
        return false
    }
    true
  }
}
