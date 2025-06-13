package main

import (
	"crypto/rand"
	"crypto/rsa"
	"fmt"
)

func deprecatedKeyGeneratorNoncompliant() {
	// Noncompliant: Generate Private Key with deprecated method
	// ruleid: rule-deprecatedkeygenerator
	pvk, err := rsa.GenerateMultiPrimeKey(rand.Reader, 3, 2048)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(pvk)
}

func deprecatedKeyGeneratorCompliant() {
	// Compliant: Generate Private Key with proper method
	// ok: rule-deprecatedkeygenerator
	pvk, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(pvk)
}