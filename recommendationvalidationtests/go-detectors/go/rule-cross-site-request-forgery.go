package main

import (
    "fmt"
    "net/http"
    "html/template"
    "crypto/rand"
    "encoding/base64"
)

func noncompliant1(w http.ResponseWriter, r *http.Request) {
    
    newPassword := r.FormValue("password")
	// ruleid: rule-cross-site-request-forgery
    fmt.Fprintf(w, "Password changed to: %s", newPassword)
}

func noncompliant2(w http.ResponseWriter, r *http.Request) {
    
    newUsername := r.FormValue("username")
    // ruleid: rule-cross-site-request-forgery
    fmt.Fprintf(w, "Username changed to: %s", newUsername)
}

func compliant1(w http.ResponseWriter, r *http.Request) {
    csrfTokenFromForm := r.FormValue("csrf_token")
    if csrfTokenFromForm != csrfToken {
        http.Error(w, "Invalid CSRF token", http.StatusForbidden)
        return
    }
    
    newPassword := r.FormValue("password")
	// ok: rule-cross-site-request-forgery
    fmt.Fprintf(w, "Password changed to: %s", newPassword)
}

func compliant2(w http.ResponseWriter, r *http.Request) {
    cookieCsrfToken, err := r.Cookie("csrfToken")
	requestCsrfToken := r.Form.Get("csrfToken")

    if err != nil || cookieCsrfToken.Value != requestCsrfToken {
		w.WriteHeader(http.StatusForbidden)
		return
	}
    newPassword := r.FormValue("password")
	// ok: rule-cross-site-request-forgery
    fmt.Fprintf(w, "Password changed to: %s", newPassword)
}