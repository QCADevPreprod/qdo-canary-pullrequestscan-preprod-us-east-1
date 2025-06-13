package main

import (
    "fmt"
    "github.com/dgrijalva/jwt-go"
)
func jwtGoNoneAlgorithmNoncompliant() {
    claims := jwt.StandardClaims{
        ExpiresAt: 15000,
        Issuer:    "test",
    }

    // Noncompliant: `jwt.SigningMethodNone` used.
    // ruleid: rule-jwt-none-algorithm
    token := jwt.NewWithClaims(jwt.SigningMethodNone, claims)

    // Noncompliant: `jwt.UnsafeAllowNoneSignatureType` used.
    // ruleid: rule-jwt-none-algorithm
    ss, err := token.SignedString(jwt.UnsafeAllowNoneSignatureType)
    fmt.Printf("%v %v\n", ss, err)
}

func jwtGoNoneAlgorithmCompliant(key []byte) {
    claims := jwt.StandardClaims{
        ExpiresAt: 15000,
        Issuer:    "test",
    }

    // Compliant: `jwt.SigningMethodHS256` used.
    // ok: rule-jwt-none-algorithm
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    ss, err := token.SignedString(key)
    fmt.Printf("%v %v\n", ss, err)
}
