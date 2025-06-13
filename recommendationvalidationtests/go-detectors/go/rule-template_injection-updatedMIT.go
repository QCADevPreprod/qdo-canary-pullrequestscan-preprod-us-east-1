package main

import (
	"html/template"
	"net/http"
)

const tmpl = ""

func unescapedDataInHtmlattrNoncompliant(r *http.Request) template.HTML {
	customerId := r.URL.Query().Get("id")
	tmpl := "<html><body><h1>" + customerId + "</h1></body></html>"
	// Noncompliant: tainted input passed
	// ruleid: rule-template_injection-updatedMIT
	return template.HTMLAttr(tmpl)
}

func unescapedDataInHtmlattrCompliant(String customerId) template.HTML {
	tmpl := "<html><body><h1>" + customerId + "</h1></body></html>"
	// Noncompliant: input passed
	// ruleid: rule-template_injection-updatedMIT
	return template.HTMLAttr(tmpl)
}