package util

import (
	"net/http"
	"time"
)

func cookieMissingHttponlyNoncompliant(w http.ResponseWriter, name, value string){
//ruleid: rule-http-cookie-httponly-notset
	cookie := http.Cookie{
		Name: name,
		Value: value,
	}
	http.SetCookie(w, &cookie)
}

func cookieMissingHttponlyCompliant(w http.ResponseWriter, name, value string){
//ok: rule-http-cookie-httponly-notset
	cookie := http.Cookie{
        Secure: true,
        HttpOnly: true,
		Name: name,
		Value: value,
	}
	http.SetCookie(w, &cookie)
}