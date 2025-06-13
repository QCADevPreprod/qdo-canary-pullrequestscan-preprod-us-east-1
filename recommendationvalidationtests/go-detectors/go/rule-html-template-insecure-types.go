package main

import "fmt"
import "html/template"
import "os"

func htmlTemplateInsecureTypesNoncompliant() {
	// Noncompliant : insecure template is used
    // ruleid: rule-html-template-insecure-types
    const tmpl template.HTML = fmt.Sprintf("<a href=%q>url</a>")
}

func htmlTemplateInsecureTypesCompliant() {
    // Compliant : insecure template is not used
    // ok: rule-html-template-insecure-types
    tmpl, err := template.New("tst").ParseFiles("example.txt")
}