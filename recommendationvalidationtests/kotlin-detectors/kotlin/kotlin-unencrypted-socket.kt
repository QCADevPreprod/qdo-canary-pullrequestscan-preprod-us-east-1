package testcode.crypto

import javax.net.ssl.SSLServerSocketFactory
import java.io.*
import java.net.InetAddress
import java.net.Socket
import java.net.ServerSocket
import javax.net.ServerSocketFactory
import javax.net.ssl.SSLSocketFactory

class UnencryptedSocket {

    fun socket_non_conformant_1() {
        // Prefer sockets from the SSLSocketFactory as they are encrypted
        // ruleid: kotlin-unencrypted-socket
        val soc: Socket = Socket("www.google.com", 80)
        doGetRequest(soc)
    }

    fun byteArrayOfInts(vararg ints: Int) = ByteArray(ints.size) {
        pos -> ints[pos].toByte()
    }

    fun socket_non_conformant_2() {
        // Prefer sockets from the SSLSocketFactory as they are encrypted
        // ruleid: kotlin-unencrypted-socket
        val soc1: Socket = Socket("www.google.com", 80, true)
        doGetRequest(soc1)

    }

    fun socket_non_conformant_3() {
        val address: ByteArray = byteArrayOfInts(127, 0, 0, 1)
        // Prefer sockets from the SSLSocketFactory as they are encrypted
        // ruleid: kotlin-unencrypted-socket
        val soc2: Socket = Socket("www.google.com", 80, InetAddress.getByAddress(address), 13337)

        doGetRequest(soc2)
    }

    fun socket_non_conformant_4() {
        val remoteAddress: ByteArray = byteArrayOfInts(74, 125, 226, 193)
        // Prefer sockets from the SSLSocketFactory as they are encrypted
        // ruleid: kotlin-unencrypted-socket
        val soc3: Socket = Socket(InetAddress.getByAddress(remoteAddress), 80)

        doGetRequest(soc3)
    }

    fun socket_conformant_1() {
        // ok: kotlin-unencrypted-socket
        val soc:Socket = SSLSocketFactory.getDefault().createSocket("www.google.com", 443)
        doGetRequest(soc)
    }

    private fun doGetRequest(soc: Socket) {
        println("")
        soc.close()
    }


    fun server_socket_conformant_1() {
        // This is an encrypted socket
        // ok: kotlin-unencrypted-socket
        val ssoc: ServerSocket = SSLServerSocketFactory.getDefault().createServerSocket(1234)
        ssoc.close()
    }

    fun server_socket_conformant_2() {
        // This is an encrypted socket
        // ok: kotlin-unencrypted-socket
        val ssocFactory: ServerSocketFactory = SSLServerSocketFactory.getDefault()
        val ssoc: ServerSocket = ssocFactory.createServerSocket(5678)
        ssoc.close()
    }

    fun server_socket_conformant_3() {
        // This is an encrypted socket
        // ok: kotlin-unencrypted-socket
        val port: Int = 1234
        val ssoc: ServerSocket = SSLServerSocketFactory.getDefault().createServerSocket(port)
        ssoc.close()
    }

    fun server_socket_non_conformant_1() {
        // ruleid: kotlin-unencrypted-socket
        val ssoc: ServerSocket = ServerSocket(1234)
        ssoc.close()
    }


    fun server_socket_non_conformant_2() {
        // ruleid: kotlin-unencrypted-socket
        val ssoc1: ServerSocket = ServerSocket()
        ssoc1.close()
    }

    fun server_socket_non_conformant_3() {
        // ruleid: kotlin-unencrypted-socket
        val ssoc2: ServerSocket = ServerSocket(1234, 10)
        ssoc2.close()
    }

    fun server_socket_non_conformant_4() {
        val address: ByteArray = byteArrayOfInts(127, 0, 0, 1)
        // ruleid: kotlin-unencrypted-socket
        val ssoc3: ServerSocket = ServerSocket(1234, 10, InetAddress.getByAddress(address))
        ssoc3.close()
    }

}
