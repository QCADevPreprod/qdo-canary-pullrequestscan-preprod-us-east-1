package main

import (
	"fmt"
	"net/http"
	"github.com/gorilla/mux"
)

func noncompliant1(){
    r := mux.NewRouter()

	// ruleid: rule-unrestricted-request-mapping
	r.PathPrefix("/unrestricted").HandlerFunc(unrestrictedHandler)

    http.Handle("/", r)
}

func noncompliant2(){
    r := mux.NewRouter()

	// ruleid: rule-unrestricted-request-mapping
	r.Path("/unrestricted").HandlerFunc(unrestrictedHandler)

    http.Handle("/", r)
}

func noncompliant3(){
    r := mux.NewRouter()

	// ruleid: rule-unrestricted-request-mapping
	r.HandleFunc("/not-allowed-path1", unrestrictedHandler).Methods("POST")

    http.Handle("/", r)
}

func noncompliant4(){
    r := mux.NewRouter()

	// ruleid: rule-unrestricted-request-mapping
	r.HandleFunc("/not-allowed-path1", unrestrictedHandler).Methods(http.MethodPost)

    http.Handle("/", r)
}

func compliant1(){
    r := mux.NewRouter()

	// ok: rule-unrestricted-request-mapping
	r.HandleFunc("/allowed-path1", compliantHandler).Methods(http.MethodGet)

    http.Handle("/", r)
}

func compliant2(){
    r := mux.NewRouter()

	// ok: rule-unrestricted-request-mapping
	r.HandleFunc("/allowed-path1", compliantHandler).Methods("GET")

    http.Handle("/", r)
}

func unrestrictedHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "This is an unrestricted request mapping example!")
}

func compliantHandler(w http.ResponseWriter, r *http.Request) {
    // Handle the request for specific paths and secure methods
    // ...
}
