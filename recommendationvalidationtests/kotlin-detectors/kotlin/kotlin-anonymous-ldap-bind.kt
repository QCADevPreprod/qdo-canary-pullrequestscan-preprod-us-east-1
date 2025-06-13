import javax.naming.Context
import javax.naming.InitialDirContext

class LDAP {

    fun noncompliant1(env: Environment): Void {
            // ruleid:kotlin-anonymous-ldap-bind
            env.put(Context.SECURITY_AUTHENTICATION, "none")
            val ctx: DirContext = InitialDirContext(env)
        }

    fun noncompliant2(env: Environment): DirContext? {
        // ruleid:kotlin-anonymous-ldap-bind
        env[Context.SECURITY_AUTHENTICATION] = "none"
        return InitialDirContext(env)
    }

    fun compliant1(env: Environment): Void {
            // ok:kotlin-anonymous-ldap-bind
            env.put(Context.SECURITY_AUTHENTICATION, "simple")
            val ctx: DirContext = InitialDirContext(env)
        }

    fun compliant2(env: Environment): DirContext? {
        // ok:kotlin-anonymous-ldap-bind
        env[Context.SECURITY_AUTHENTICATION] = "simple"
        return InitialDirContext(env)
    }

}
