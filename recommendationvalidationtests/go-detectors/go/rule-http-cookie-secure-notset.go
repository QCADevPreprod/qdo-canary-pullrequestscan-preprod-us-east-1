package util

import (
	"net/http"
	"time"
)

func cookieMissingHttponlyNoncompliant(w http.ResponseWriter, name, value string){
    // Noncompliant: `Secure` not set
    //ruleid: rule-http-cookie-secure-notset
	cookie := http.Cookie{
		Name: name,
		Value: value,
	}
	http.SetCookie(w, &cookie)
}

func cookieMissingHttponlyCompliant(w http.ResponseWriter, name, value string){
    // Noncompliant: `Secure` set true
    //ok: rule-http-cookie-secure-notset
	cookie := http.Cookie{
        Secure: true,
        HttpOnly: true,
		Name: name,
		Value: value,
	}
	http.SetCookie(w, &cookie)
}
