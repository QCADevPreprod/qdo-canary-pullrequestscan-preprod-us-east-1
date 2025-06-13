package main

import (
    "context"
    "fmt"
    "os"
    "os/exec"
    "time"
)

func subprocNoncompliant(input string) {
    // Noncompliant: Command constructed via user input
    // ruleid: rule-subproc-updatedMIT
    cmd := exec.Command(input, "foobar")

    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stdout

    if err := cmd.Run(); err != nil {
        fmt.Println("Error:", err)
    }
}

func subprocCompliant(input string) {
    javaPath, _ := exec.LookPath("java")
    // Compliant: Command constructed via hardcoded string
    // ok: rule-subproc-updatedMIT
    cmd := exec.Command(javaPath, "version")

    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stdout

    if err := cmd.Run(); err != nil {
        fmt.Println("Error:", err)
    }
}