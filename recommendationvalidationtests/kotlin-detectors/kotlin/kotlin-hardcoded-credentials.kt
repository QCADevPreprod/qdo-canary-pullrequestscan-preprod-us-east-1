import java.sql.Connection
import java.sql.DriverManager
import java.sql.SQLException
import java.util.Properties
import javax.mail.PasswordAuthentication
import java.net.PasswordAuthentication as NetPasswordAuthentication
import javax.mail.Authenticator
import javax.mail.Session

class HardcodedCredentials {

    fun noncompliant1() {
        val username = "dbuser"
        val password = "dbpassword123"
        // ruleid:kotlin-hardcoded-credentials
        val connectionString = "jdbc:mysql://localhost:3306/mydatabase?user=$username&password=$password"
    }


    fun noncompliant2() {
        val params = "password=xxxx" // Sensitive
        val writer = OutputStreamWriter(getOutputStream())
        // ruleid:kotlin-hardcoded-credentials
        writer.write(params)
        writer.flush()
    }

    fun noncompliant3() {
        val username = "admin"
        val password = "password123"
        val ssh = SSHClient()
        // ruleid:kotlin-hardcoded-credentials
        ssh.authPassword(username, password)
    }

    fun noncompliant4() {
        val host = "smtp.example.com"
        val port = 587
        val username = "user@example.com"
        val password = "emailpassword123"
        // ruleid:kotlin-hardcoded-credentials
        val email = Email(host, port, username, password)
    }

    fun noncompliant5(args: Array<String>) { 
        // ruleid:kotlin-hardcoded-credentials
        val creds: AWSCredentials = BasicAWSCredentials("ACCESS_KEY", "SECRET_KEY") //sensitive call
    }


    fun noncompliant6() {
        val server = "ftp.example.com"
        val username = "ftpuser"
        val password = "ftppassword123"
        val ftpClient = FTPClient()
        ftpClient.connect(server)
        // ruleid:kotlin-hardcoded-credentials
        ftpClient.login(username, password)
    }


    fun compliant1() {
        val username = System.getenv("USERNAME_ENV_VARIABLE") 
        val password = System.getenv("PASSWORD_ENV_VARIABLE") 
        // ok:kotlin-hardcoded-credentials
        val connectionString = "jdbc:mysql://localhost:3306/mydatabase?user=$username&password=$password"
    }


    fun compliant2() {
        val params = System.getenv("PASSWORD_ENV_VARIABLE") 
        val writer = OutputStreamWriter(getOutputStream())
        // ok:kotlin-hardcoded-credentials
        writer.write(params)
        writer.flush()
    }

    fun compliant3() {
        val username = System.getenv("SSH_USERNAME")
        val password = System.getenv("SSH_PASSWORD")

        val ssh = SSHClient()
        // ok:kotlin-hardcoded-credentials
        ssh.authPassword(username, password)
    }

    fun compliant4(){
        val host = "smtp.example.com"
        val port = 587
        val username = System.getenv("EMAIL_USERNAME")
        val password = System.getenv("EMAIL_PASSWORD")
        // ok:kotlin-hardcoded-credentials
        val email = Email(host, port, username, password)
    }

    fun compliant5(args: Array<String>) {
        val accessKey = System.getenv("AWS_ACCESS_KEY")
        val secretKey = System.getenv("AWS_SECRET_KEY")
        // ok:kotlin-hardcoded-credentials
        val creds: AWSCredentials = BasicAWSCredentials(accessKey, secretKey)
    }

    fun compliant6() {
        val server = "ftp.example.com"
        val username = System.getenv("USERNAME")
        val password = System.getenv("PASSWORD")
        val ftpClient = FTPClient()
        ftpClient.connect(server)
        // ok:kotlin-hardcoded-credentials
        ftpClient.login(username, password)
    }

    fun complaint7() {
        val _macKeymapXml = repositoryDir.resolve("${getOsFolderName()}/keymap.xml")
        val content = """
        <application>
            <component name="KeymapManager">
            <active_keymap name="macOS System Shortcuts" />
            </component>
        </application>
        """
        // ok:kotlin-hardcoded-credentials
        _macKeymapXml.write(content)
        val keymapXml = repositoryDir.resolve("keymap.xml")
        // ok:kotlin-hardcoded-credentials
        keymapXml.write(content)
    }

    // hardcoded database password
    private val PASSWORD = "pass123"

    @Throws(SQLException::class)
    fun noncompliant7(): Connection {
        val props = Properties()
        props.setProperty("user", "TestUser")
        props.setProperty("password", PASSWORD)
        //ruleid: kotlin-hardcoded-credentials
        val conn = DriverManager.getConnection("dbUrl", props)
        return conn
    }

    @Throws(SQLException::class)
    fun noncompliant8(): Connection {
        val urlname = "jdbc:xyz"
        val username = "TestUser"
        val passwd = "pass123"
        //ruleid: kotlin-hardcoded-credentials
        return DriverManager.getConnection(urlname, username, passwd)
    }

    @Throws(SQLException::class)
    fun noncompliant9() {
        //ruleid: kotlin-hardcoded-credentials
        val conn = DriverManager.getConnection(
            "connectionUrl",
            "TestUser",
            "Password123"
        )
        conn.close()
    }

    @Throws(Exception::class)
    fun noncompliant10() {
        //ruleid: kotlin-hardcoded-credentials
        val conn = DriverManager.getConnection("connectionUrl", "user", "")
        conn.close()
    }

    @Throws(Exception::class)
    fun complaint8() {
        //ok: kotlin-hardcoded-credentials
        val conn = DriverManager.getConnection("connectionUrl", "user", null)
        conn.close()
    }

    @Throws(Exception::class)
    fun complaint9(args: Array<String>) {
        var pw: String? = null
        try {
            pw = args[2]
        } catch (ex: IndexOutOfBoundsException) {
            System.exit(2)
        }
        //ok: kotlin-hardcoded-credentials
        val c = DriverManager.getConnection("url", "user", pw)
        c.toString()
    }

    @Throws(Exception::class)
    fun complaint10() {
        //ok: kotlin-hardcoded-credentials
        val connection = DriverManager.getConnection("connectionUrl", "user",
            System.getProperty("pwd"))
        connection.close()
    }

    fun complaint11(jdbcUrl: String, username: String, changeLogPath: String): DatabaseMigrator {
        // Ensure the driver is loaded.
        Class.forName("amazon.jdbc.driver.SecureDriver")

        val connectionProps = Properties()
        connectionProps["driverClass"] = "amazon.jdbc.driver.SecureDriver"
        connectionProps["user"] = username
        connectionProps["password"] = "{amzn-use-secure}"
        //ok: kotlin-hardcoded-credentials
        val connection = DriverManager.getConnection(jdbcUrl, connectionProps)

        val jdbcConnection = JdbcConnection(connection)
        val database = DatabaseFactory.getInstance().findCorrectDatabaseImplementation(jdbcConnection)
        database.setDefaultSchemaName("booker")
        val liquibase = Liquibase(changeLogPath, FileSystemResourceAccessor(), database)

        return DatabaseMigrator(liquibase)
    }


    @Throws(LoadDataFailException::class)
    fun complaint12(dataset: Dataset): Boolean {
        val props = Properties()

        props.setProperty("user", DBConfig.REDSHIFT_USERNAME)
        props.setProperty("password", DBConfig.REDSHIFT_PWD)
        //ok: kotlin-hardcoded-credentials
        conn = DriverManager.getConnection(datasetDBURL, props)
        return true
    }

    private val PASSWORD = "pass123"

    // Non-conforming cases
    fun noncompliant11() {
        //ruleid: kotlin-hardcoded-credentials
        val authentication = PasswordAuthentication("TestUser@xyz.com", "pass123")
    }

    fun noncompliant12() {
        val pwd = "pass123"
        //ruleid: kotlin-hardcoded-credentials
        val authentication = PasswordAuthentication("TestUser@xyz.com", pwd)
    }

    fun noncompliant13() {
        //ruleid: kotlin-hardcoded-credentials
        val authentication = PasswordAuthentication("TestUser@xyz.com", PASSWORD)
    }

    fun noncompliant14() {
        //ruleid: kotlin-hardcoded-credentials
        val authentication = NetPasswordAuthentication("TestUser@xyz.com", "pass123".toCharArray())
    }

    fun noncompliant15() {
        val pass = "pass123".toCharArray()
        //ruleid: kotlin-hardcoded-credentials
        val authentication = NetPasswordAuthentication("TestUser@xyz.com", pass)
    }

    fun noncompliant16() {
        //ruleid: kotlin-hardcoded-credentials
        val authentication = NetPasswordAuthentication("TestUser@xyz.com", PASSWORD.toCharArray())
    }

    // Conforming cases
    fun complaint13(password: String) {
        //ok: kotlin-hardcoded-credentials
        val authentication = PasswordAuthentication("TestUser@xyz.com", password)
    }

    fun complaint14(email: String, password: String) {
        //ok: kotlin-hardcoded-credentials
        val authentication = NetPasswordAuthentication(email, password)
    }

    fun complaint15() {
        val mailProperties = Properties().apply {
            put("mail.user", Settings.getSetting("Global", "SMTP Port"))
            put("mail.password", Settings.getSetting("Global", "SMTP Port"))
        }
        //ok: kotlin-hardcoded-credentials
        val authentication = PasswordAuthentication(
            mailProperties.getProperty("mail.user"),
            mailProperties.getProperty("mail.password")
        )
    }

    fun complaint16() {
        val props = Properties()
        val attrs = ref.all
        val attr = attrs.nextElement()
        val user = props.getProperty("mail.smtp.user")
        val password = attr.content as String
        //ok: kotlin-hardcoded-credentials
        val authentication = NetPasswordAuthentication(user, password)
    }

    fun complaint17() {
        val emailCredentials = OdinUtil.getCredentials(EMAIL_CREDENTIALS_ODIN)
        //ok: kotlin-hardcoded-credentials
        val authentication = PasswordAuthentication(
            emailCredentials[OdinUtil.PRINCIPAL], OdinUtil.CREDENTIAL
        )
    }

    fun complaint18() {
        val pwd = System.getenv("PWD")
        //ok: kotlin-hardcoded-credentials
        val authentication = PasswordAuthentication("TestUser@xyz.com", pwd)
    }

}
