package main

import (
	"fmt"
	"os"
)

func nonCompliant1() {
    var ptr *int
    // ruleid: rule-nil-pointer-dereference
    fmt.Println(*ptr)
}


func compliant1() {
    var ptr *int
    if ptr != nil {
       // ok: rule-nil-pointer-dereference
        fmt.Println(*ptr)
    } else {
        fmt.Println("Pointer is nil")
    }
}

func nonCompliant2(input string) {
	ptr, err := os.Open(input)
    // ruleid: rule-nil-pointer-dereference
	fmt.Printf("Opened %v\n", *ptr)
	if err != nil {
		fmt.Printf("Bad input: %s\n", input)
	}
}

func compliant2(input string) {
	ptr, err := os.Open(input)
	if err != nil {
		fmt.Printf("Bad input: %s\n", input)
		return
	}
	// ok: rule-nil-pointer-dereference
	fmt.Printf("Result was %v\n", *ptr)
}
