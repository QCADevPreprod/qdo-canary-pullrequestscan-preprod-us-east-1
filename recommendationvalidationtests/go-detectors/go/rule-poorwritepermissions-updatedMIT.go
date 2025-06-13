package main

import (
	"fmt"
	"io/ioutil"
	"os"
)

func main() {
}

func IncorrectDefaultPermissionNoncompliant() {
	// Noncompliant: file permissions set higher than `0600`
	// ruleid: rule-poorwritepermissions-updatedMIT
	err := os.Chmod("/tmp/somefile", 0777)
	if err != nil {
		fmt.Println("Error when changing file permissions!")
		return
	}
}

func IncorrectDefaultPermissionCompliant() {
	// Compliant: file permissions set less than `0600`
	// ok: rule-poorwritepermissions-updatedMIT
	err := os.Chmod("/tmp/somefile", 0400)
	if err != nil {
		fmt.Println("Error when changing file permissions!")
		return
	}
}
