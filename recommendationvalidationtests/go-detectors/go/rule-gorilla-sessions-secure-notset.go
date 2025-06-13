package session

import (
	"log"
	"fmt"
	"net/http"
	"govwa/util/config"
	"github.com/gorilla/sessions"
)

type Self struct{}

func New() *Self {
	return &Self{}
}

var store = sessions.NewCookieStore([]byte(config.Cfg.Sessionkey))

func (self *Self) SessionCookieMissingSecureNoncompliant(w http.ResponseWriter, r *http.Request, data map[string]string) {
	session, err := store.Get(r, "govwa")

	if err != nil {
		log.Println(err.Error())
	}
    // Noncompliant: `Secure` flag set to `false`.
	// ruleid: rule-gorilla-sessions-secure-notset
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: false,
        Secure: false,
	}
	session.Values["govwa_session"] = true

	//create new session to store on server side
	if data != nil {
		for key, value := range data {
			session.Values[key] = value
		}
	}
	err = session.Save(r, w) //safe session and send it to client as cookie

		if err != nil {
			log.Println(err.Error())
		}
}

func (self *Self) SessionCookieMissingSecureCompliant(w http.ResponseWriter, r *http.Request, data map[string]string) {
	session, err := store.Get(r, "govwa")

	if err != nil {
		log.Println(err.Error())
	}
    // Compliant: `Secure` flag set to `true`.
	//ok: rule-gorilla-sessions-secure-notset
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
        Secure: true,
	}
	session.Values["govwa_session"] = true

	//create new session to store on server side
	if data != nil {
		for key, value := range data {
			session.Values[key] = value
		}
	}
	err = session.Save(r, w) //safe session and send it to client as cookie

		if err != nil {
			log.Println(err.Error())
		}
}

