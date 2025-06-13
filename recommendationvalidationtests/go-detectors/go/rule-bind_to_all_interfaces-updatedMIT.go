package main

import (
	"log"
	"net"
)

func avoidBindToAllInterfacesNoncompliant() {
    // Noncompliant: `0.0.0.0` IP address used
	// ruleid: rule-bind_to_all_interfaces-updatedMIT
	l, err := net.Listen("tcp", "0.0.0.0:2000")
	if err != nil {
		log.Fatal(err)
	}
	defer l.Close()
}

func avoidBindToAllInterfacesCompliant() {
    // Compliant: `192.168.1.101` IP address used
	//ok: rule-bind_to_all_interfaces-updatedMIT
	l, err := net.Listen("tcp", "192.168.1.101:2000")
	if err != nil {
		log.Fatal(err)
	}
	defer l.Close()
}
