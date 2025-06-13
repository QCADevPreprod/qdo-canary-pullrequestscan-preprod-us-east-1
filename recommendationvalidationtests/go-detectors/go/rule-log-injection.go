package main

import (
	"log"
	"net/http"
    "strings"
)

func nonCompliant1(req *http.Request) {
	username := req.URL.Query()["username"][0]
    // ruleid: rule-log-injection
	log.Printf("user %s logged in.\n", username)
}

func compliant(req *http.Request) {
	username := req.URL.Query()["username"][0]
	escapedUsername := strings.ReplaceAll(username, "\n", "")
	escapedUsername = strings.ReplaceAll(escapedUsername, "\r", "")
    // ok: rule-log-injection
	log.Printf("user %s logged in.\n", escapedUsername)
}

func nonCompliant2(req *http.Request){
    userInput := req.URL.Query().Get("userInput")
    // ruleid: rule-log-injection
    log.Fatal("Recieved user input:" + userInput)
}
