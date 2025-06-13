package main

import (
	"crypto/tls"
)

func minMaxTlsVersionNoncompliant() {
	config := &tls.Config{}
	// Noncompliant : SSL 3.0 is a non-secure version of the protocol
	// ruleid: rule-tlsversion-updatedMIT
	config.MinVersion = tls.VersionSSL30
}

func minMaxTlsVersionCompliant() {
	config := &tls.Config{}
	// Compliant : TLS 1.3 is a secure version of the protocol
	// ok: rule-tlsversion-updatedMIT
	config.MinVersion = tls.VersionTLS13
}