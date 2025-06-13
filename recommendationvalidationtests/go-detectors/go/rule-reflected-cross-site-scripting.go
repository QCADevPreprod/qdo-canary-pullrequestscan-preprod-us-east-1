// Non-compliant

package main

import (
	"html/template"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

func noncompiant1(){
	r := mux.NewRouter()
	r.HandleFunc("/search", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query().Get("query")
		tmpl := template.Must(template.New("index").Parse(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>Search Results</title>
				<script>
					var query = "{{ .Query }}";
					document.getElementById("result").innerHTML = "Search results for: " + query;
				</script>
			</head>
			<body>
				<div id="result"></div>
			</body>
			</html>
		`))
		// ruleid: rule-reflected-cross-site-scripting
		tmpl.Execute(w, struct {
			Query string
		}{Query: query})
	})

	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}

func noncompiant2(){
	r := mux.NewRouter()
	r.HandleFunc("/greet", func(w http.ResponseWriter, r *http.Request) {
		name := r.URL.Query().Get("name")
		tmpl := template.Must(template.New("index").Parse(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>Greeting</title>
				<script>
					var name = "{{ .Name }}";
					document.getElementById("greeting").innerHTML = "Hello, " + name + "!";
				</script>
			</head>
			<body>
				<div id="greeting"></div>
			</body>
			</html>
		`))
		// ruleid: rule-reflected-cross-site-scripting
		tmpl.Execute(w, struct {
			Name string
		}{Name: name})
	})

	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}

func noncompiant3(){
	http.HandleFunc("/profile", func(w http.ResponseWriter, r *http.Request) {
		username := r.URL.Query().Get("username")

		user := User{
			Username: username,
		}
		userType := reflect.TypeOf(user)
		usernameField, _ := userType.FieldByName("Username")
		usernameValue := reflect.ValueOf(user).FieldByName("Username")
		// ruleid: rule-reflected-cross-site-scripting
		fmt.Fprintf(w, "Username: %s", usernameValue.Interface())
	})

	http.ListenAndServe(":8080", nil)
}

func noncompiant4(){
	http.HandleFunc("/profile", func(w http.ResponseWriter, r *http.Request) {
		username := r.URL.Query().Get("username")

		user := User{
			Username: username,
		}
		userValue := reflect.ValueOf(user)
		usernameValue := userValue.FieldByName("Username").String()
		// ruleid: rule-reflected-cross-site-scripting
		fmt.Fprintf(w, "Welcome, %s!", usernameValue)
	})

	http.ListenAndServe(":8080", nil)
}

func noncompiant5() {
	http.HandleFunc("/user", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		username := r.Form.Get("username")
		if !isValidUsername(username) {
			// ruleid: rule-reflected-cross-site-scripting
			fmt.Fprintf(w, "%q is an unknown user", username)
		} else {
			// TODO: Handle successful login
		}
	})
	http.ListenAndServe(":80", nil)
}

// Compliant

func compliant1(){
	r := mux.NewRouter()
	r.HandleFunc("/search", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query().Get("query")

		tmpl := template.Must(template.New("index").Parse(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>Search Results</title>
				<script>
					var query = "{{ .Query }}";
					document.getElementById("result").innerHTML = "Search results for: " + query;
				</script>
			</head>
			<body>
				<div id="result"></div>
			</body>
			</html>
		`))
		sanitizedQuery := template.HTMLEscapeString(query)
		// ok: rule-reflected-cross-site-scripting
		tmpl.Execute(w, struct {
			Query string
		}{Query: sanitizedQuery})
	})

	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}

func compliant2(){
	r := mux.NewRouter()
	r.HandleFunc("/greet", func(w http.ResponseWriter, r *http.Request) {
		name := r.URL.Query().Get("name")

		tmpl := template.Must(template.New("index").Parse(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>Greeting</title>
				<script>
					var name = "{{ .Name }}";
					document.getElementById("greeting").innerHTML = "Hello, " + name + "!";
				</script>
			</head>
			<body>
				<div id="greeting"></div>
			</body>
			</html>
		`))
		sanitizedName := template.JSEscapeString(name)
		// ok: rule-reflected-cross-site-scripting
		tmpl.Execute(w, struct {
			Name string
		}{Name: sanitizedName})
	})

	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}

func compliant3(){
	http.HandleFunc("/profile", func(w http.ResponseWriter, r *http.Request) {
		username := r.URL.Query().Get("username")
		sanitizedUsername := template.HTMLEscapeString(username)

		user := User{
			Username: sanitizedUsername,
		}
		// ok: rule-reflected-cross-site-scripting
		fmt.Fprintf(w, "Username: %s", user.Username)
	})

	http.ListenAndServe(":8080", nil)
}

func compliant4() {
	http.HandleFunc("/user", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		username := r.Form.Get("username")
		if !isValidUsername(username) {
			// ok: rule-reflected-cross-site-scripting
			fmt.Fprintf(w, "%q is an unknown user", html.EscapeString(username))
		} else {
			// TODO: do something exciting
		}
	})
	http.ListenAndServe(":80", nil)
}

