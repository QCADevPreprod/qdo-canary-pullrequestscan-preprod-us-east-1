package main

import "tawesoft.co.uk/go/dialog"

func nonCompliant(username string) {
    // ruleid: rule-avoid-alert-dialog
    dialog.Alert("Hello ", username)
}

func compliant() {
    // ok: rule-avoid-alert-dialog
    dialog.Alert("Hello world!")
    // ok: rule-avoid-alert-dialog
    dialog.Alert("There are %d balls.", 2)
}
