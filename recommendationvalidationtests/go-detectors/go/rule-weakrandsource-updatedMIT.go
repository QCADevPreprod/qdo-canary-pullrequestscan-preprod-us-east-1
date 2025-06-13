
package main

import (
	"math/rand"
	"github.com/theckman/go-securerandom"
)

var charset = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func weakRandomNumberGenerationNoncompliant() string {
	s := make([]rune, 20)
	for i := range s {
		// Noncompliant : `math.rand` used for generating random number
		// ruleid: rule-weakrandsource-updatedMIT
		s[i] = charset[rand.Int63n(len(charset))]
	}
	return string(s)
}

func weakRandomNumberGenerationCompliant() string {
	s := make([]rune, 20)
	for i := range s {
		// Compliant : `go-securerandom` used for generating random number
		// ok: rule-weakrandsource-updatedMIT
		s[i] = charset[securerandom.Int64()]
	}
	return string(s)
}