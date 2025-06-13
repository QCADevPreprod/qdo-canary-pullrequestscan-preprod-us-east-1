package main

import (
    "fmt"
    "os"
    "os/exec"
)

func codeInjectionNoncompliant(userInput string) {
    cmdPath,_ := userInput;

    // Noncompliant:path not sanitized
	// ruleid: rule-code-injection
    cmd := &exec.Cmd {
        Path: cmdPath,
        Args: []string{ "foo", "bar" },
        Stdout: os.Stdout,
        Stderr: os.Stdout,
    }

    cmd.Start();
}

func codeInjectionCompliant(userInput string) {
    cmdPath,_ := exec.LookPath("go");

    // Compliant:path sanitized
	// ok: rule-code-injection
    cmd := &exec.Cmd {
        Path: cmdPath,
        Args: []string{ cmdPath, "bar" },
        Stdout: os.Stdout,
        Stderr: os.Stdout,
    }

    cmd.Start();
}