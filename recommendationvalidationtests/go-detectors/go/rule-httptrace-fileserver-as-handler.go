package main

import (
	"log"
	"net/http"
)

func fsDirectoryListingNoncompliant() {
	//Noncompliant: `http.FileServer` used
	// ruleid: rule-httptrace-fileserver-as-handler
	fs := http.FileServer(http.Dir(""))
	log.Fatal(http.ListenAndServe(":9000", fs))
}


func fsDirectoryListingCompliant() {
	h1 := func(w http.ResponseWriter, _ *http.Request) {
		w.Write([]byte("<h1>Home page</h1>"))
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/", h1)
	//Compliant: `http.FileServer` not used
	// ok: rule-httptrace-fileserver-as-handler
	log.Fatal(http.ListenAndServe(":9000", mux))
}