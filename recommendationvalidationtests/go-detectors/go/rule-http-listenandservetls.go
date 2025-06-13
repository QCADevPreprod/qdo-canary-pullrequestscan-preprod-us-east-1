package main

import (
    "net/http"
    "fmt"
)

func Handler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    w.write([]byte("Hello, world!"))
}

func useTlsNoncompliant() {
    http.HandleFunc("/index", Handler)
    // Noncompliant: `certFile`, `keyFile` not used while calling `http.ListenAndServe`
	// ruleid: rule-http-listenandservetls
    http.ListenAndServe(":80", nil)
}

func useTlsNoncompliant() {
    http.HandleFunc("/index", Handler)
    // Compliant: `certFile`, `keyFile` used while calling `http.ListenAndServe`
	// ok: rule-http-listenandservetls
    http.ListenAndServeTLS(":80", certFile, keyFile, nil)
}