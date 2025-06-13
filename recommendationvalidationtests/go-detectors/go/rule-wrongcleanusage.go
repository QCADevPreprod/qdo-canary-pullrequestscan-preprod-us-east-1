package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"path"
	"strings"
)

const root = "/tmp"

func filepathCleanMisuseNoncompliant() {
	mux := http.NewServeMux()
	mux.HandleFunc("/bad1", func(w http.ResponseWriter, r *http.Request) {
		filename := filepath.Clean(r.URL.Path)
		filename := filepath.Join(root, strings.Trim(filename, "/"))
		// Noncompliant: filepath clean misused
		// ruleid: rule-wrongcleanusage
		contents, err := ioutil.ReadFile(filename)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		w.Write(contents)
	})
}

func filepathCleanMisuseCompliant() {
	mux.HandleFunc("/ok", func(w http.ResponseWriter, r *http.Request) {
		filename := r.URL.Path
		filename := filepath.Join(root, strings.Trim(filename, "/"))
		// Compliant: filepath clean not used
		// ok: rule-wrongcleanusage
		contents, err := ioutil.ReadFile(filename)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		w.Write(contents)
	})
}