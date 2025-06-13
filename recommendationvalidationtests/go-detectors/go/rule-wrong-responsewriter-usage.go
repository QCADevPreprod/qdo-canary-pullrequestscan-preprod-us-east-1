package main

import (
    "fmt"
    "log"
    "net/http"
)

func getMovieQuote() map[string]string {
    m := make(map[string]string)
    m["quote"] = "I'll be back."
    m["movie"] = "The Terminator"
    m["year"] = "1984"

    return m
}

func responsewriterNoncompliant(w http.ResponseWriter, r *http.Request) {
    const tme = `<html>`

    const template = `
    <html>
    <body>
      <h1>Random Movie Quotes</h1>
      <h2>%s</h2>
      <h4>~%s, %s</h4>
    </body>
    </html>`

    quote := getMovieQuote()

    quoteText := quote["quote"]
    movie := quote["movie"]
    year := quote["year"]

    w.WriteHeader(http.StatusAccepted)
	// Noncompliant: writes crafted data from user provided input
    // ruleid: rule-wrong-responsewriter-usage
    w.Write([]byte(fmt.Sprintf(template, quoteText, movie, year)))
}

func responsewriterCompliant(w http.ResponseWriter, r *http.Request) {
	// Compliant: writes constant input
    // ok: rule-wrong-responsewriter-usage
    w.Write([]byte("alive"))
}