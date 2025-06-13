import javax.net.ssl.SSLSocket

class AvoidTLSCiphersWithKnownSecurityIssues {

    fun nonConformant_1() {
        val suites = arrayOf("TLS_DH_anon_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_2() {
        val suites = arrayOf("TLS_AES_128_GCM_SHA256", "TLS_DH_anon_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_3() {
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(arrayOf("TLS_DH_anon_WITH_AES_256_GCM_SHA384"))
    }

    fun nonConformant_4() {
        val suites = arrayOf("TLS_DH_anon_WITH_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_5() {
        val suites = arrayOf("TLS_AES_128_GCM_SHA256:TLS_DH_anon_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_6() {
        val suites = arrayOf("TLS_DH_anon_WITH_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_7() {
        val suites = arrayOf("TLS_DH_ARIA_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_8() {
        val suites = arrayOf("TLS_DH_CAMELLIA_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_9() {
        val suites = arrayOf("TLS_DH_CBC_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_10() {
        val suites = arrayOf("TLS_DH_CCM_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_11() {
        val suites = arrayOf("TLS_DH_DES_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_12() {
        val suites = arrayOf("TLS_DH_EXP_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_13() {
        val suites = arrayOf("TLS_DH_IDEA_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_14() {
        val suites = arrayOf("TLS_DH_MD4_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_15() {
        val suites = arrayOf("TLS_DH_MD5_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_16() {
        val suites = arrayOf("TLS_DH_NULL_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_17() {
        val suites = arrayOf("TLS_DH_RC2_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_18() {
        val suites = arrayOf("TLS_DH_RC4_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_19() {
        val suites = arrayOf("TLS_DH_SEED_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_20() {
        val suites = arrayOf("TLS_DH_TLS_RSA_WITH_AES_256_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_21() {
        val suites = arrayOf("TLS_AES_128_GCM_SHA")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_22() {
        val suites = arrayOf("TLS_AES_128_GCM_SHA:TLS_AES_128_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun nonConformant_23() {
        val suites = arrayOf("TLS_AES_128_GCM_SHA", "TLS_AES_128_GCM_SHA384")
        // ruleid: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_1() {
        // ok: kotlin-avoid-tls-ciphers
        println(SSLSocket.getEnabledCipherSuites())
    }

    fun conformant_2() {
        val suites = arrayOf("TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_3() {
        val suites = arrayOf("TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_4() {
        val suites = arrayOf("TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_5() {
        val suites = arrayOf("TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_6() {
        val suites = arrayOf("TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_7() {
        val suites = arrayOf("TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_8() {
        val suites = arrayOf("TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_9() {
        val suites = arrayOf("TLS_AES_256_GCM_SHA384")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_10() {
        val suites = arrayOf("!anon")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_11() {
        val suites = arrayOf("!eNULL")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

    fun conformant_12() {
        val suites = arrayOf("!NULL")
        // ok: kotlin-avoid-tls-ciphers
        SSLSocket.setEnabledCipherSuites(suites)
    }

}
