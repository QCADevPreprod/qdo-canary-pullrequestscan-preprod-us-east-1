package main

import (
	"net/http"
	"path"
)

func noncompliant1() {
	http.HandleFunc("/files/", func(w http.ResponseWriter, r *http.Request) {
		filePath := "./files/" + r.URL.Path[len("/files/"):]
		if err != nil {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}
		// ruleid: rule-path-traversal
		filePath := path.Join("files", filePath)
		http.ServeFile(w, r, filePath)
	})

	http.ListenAndServe(":8080", nil)
}

func noncompliant2() {
	http.HandleFunc("/download/", func(w http.ResponseWriter, r *http.Request) {
		filename := r.URL.Path[len("/download/"):]
		filePath := "./uploads/" + filename

		file, err := os.Open(filePath)
		if err != nil {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}
		// ruleid: rule-path-traversal
		filePath := path.Join("files", filePath)
		http.ServeFile(w, r, filePath)
	})

	http.ListenAndServe(":8080", nil)
}

func compliant1() {
	http.HandleFunc("/files/", func(w http.ResponseWriter, r *http.Request) {
		requestedFile := r.URL.Path[len("/files/"):]
		if !isValidFilePath(requestedFile) {
			http.Error(w, "Invalid file path", http.StatusBadRequest)
			return
		}
		// ok: rule-path-traversal
		filePath := path.Join("files", requestedFile)
		http.ServeFile(w, r, filePath)
	})

	http.ListenAndServe(":8080", nil)
}

func compliant2() {
	http.HandleFunc("/download/", func(w http.ResponseWriter, r *http.Request) {
		filename := r.URL.Path[len("/download/"):]
		filePath := "./uploads/" + filename

		if !isValidFilePath(filePath) {
			http.Error(w, "Invalid file path", http.StatusBadRequest)
			return
		}
		// ok: rule-path-traversal
		filePath := path.Join("files", filePath)
		http.ServeFile(w, r, filePath)
	})

	http.ListenAndServe(":8080", nil)
}

func isValidFilePath(filePath string) bool {
	return !path.IsAbs(filePath) && !path.HasPrefix(filePath, "..")
}

