package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader2 = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func websocketMissingOriginCheckNoncompliant(w http.ResponseWriter, r *http.Request) {
	// Noncompliant: A CheckOrigin function not used to validate the request origin.
	// ruleid: rule-gorilla-websocket-checkorigin-notset
	conn, err := upgrader2.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
}

func websocketMissingOriginCheckCompliant2(w http.ResponseWriter, r *http.Request) {
	upgrader2.CheckOrigin = func(r *http.Request) bool { return true }
	// Compliant: A CheckOrigin function used to validate the request origin.
	// ok: rule-gorilla-websocket-checkorigin-notset
	conn, err := upgrader2.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
}