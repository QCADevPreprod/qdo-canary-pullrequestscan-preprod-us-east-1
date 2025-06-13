package main

import (
	"crypto/tls"
	"fmt"
	"net/http"
)

func badTlsSettingsNoncompliant() {
	tr := &http.Transport{
        // Noncompliant: insecure cipher with tls
		// ruleid: rule-badtlssettings-updatedMIT
		TLSClientConfig: &tls.Config{CipherSuites: []uint16{
			tls.TLS_RSA_WITH_RC4_128_SHA,
			tls.TLS_RSA_WITH_AES_128_CBC_SHA256,
		}},
	}
	client := &http.Client{Transport: tr}
	_, err := client.Get("https://golang.org/")
	if err != nil {
		fmt.Println(err)
	}
}


func badTlsSettingsCompliant() {
	tr := &http.Transport{
		// Compliant: secure cipher with tls
		// ok: rule-badtlssettings-updatedMIT
		TLSClientConfig: &tls.Config{CipherSuites: []uint16{
			tls.TLS_AES_128_GCM_SHA256,
			tls.TLS_AES_256_GCM_SHA384,
		}},
	}
	client := &http.Client{Transport: tr}
}