package main

import (
    "fmt"
	"github.com/dgrijalva/jwt-go"
)
// {fact rule=protection-mechanism-failure@v1.0 defects=1}
func nonCompliant1(tokenString string) {
    // ruleid: rule-jwt-go-parse-unverified
    token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
    if err != nil {
        fmt.Println(err)
        return
    }

    if claims, ok := token.Claims.(jwt.MapClaims); ok {
        fmt.Println(claims["foo"], claims["exp"])
    } else {
        fmt.Println(err)
    }
}
func nonCompliant2() {
    invalidToken := "invalid.token.string"
    // ruleid: rule-jwt-go-parse-unverified
    token, _, err := new(jwt.Parser).ParseUnverified(invalidToken, jwt.MapClaims{})
    if err != nil {
        fmt.Println(err)
        return
    }
}
func nonCompliant3(){
    for k, v := range props {
    tokenString := fmt.Sprint(v)
    tokenKey := fmt.Sprint(cfg.AuthKey)
    if (k == "custom_token_header") && strings.Contains(tokenString, tokenKey) {
        tokenString = strings.Replace(tokenString, "Bearer ", "", -1)
        // ruleid: rule-jwt-go-parse-unverified
        token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
        if err != nil {
            fmt.Println(err)
            return nil, nil
        }
    }
}
}
// {/fact}

// {fact rule=protection-mechanism-failure@v1.0 defects=0}
func compliant1(tokenString string, keyFunc Keyfunc) {
    // ok: rule-jwt-go-parse-unverified
    token, err := new(jwt.Parser).ParseWithClaims(tokenString, jwt.MapClaims{}, keyFunc)
    if err != nil {
        fmt.Println(err)
        return
    }

    if claims, ok := token.Claims.(jwt.MapClaims); ok {
        fmt.Println(claims["foo"], claims["exp"])
    } else {
        fmt.Println(err)
    }
}
func compliant2() {
    // ok: rule-jwt-go-parse-unverified
    validToken := "valid.token.string"
    keyFunc := func(token *jwt.Token) (interface{},error){
        return []byte("your-secret-key"),nil
    }
    token, err := new(jwt.Parser).ParseWithClaims(validToken, jwt.MapClaims{}, keyFunc)
    if err != nil {
        fmt.Println(err)
        return
    }
}
// {/fact}
