package main

import (
    "crypto/tls"
    "encoding/json"
    "encoding/hex"
    "fmt"
    "io/ioutil"
    "net/http"
    "net/url"
)

func ssrfNoncompliant(w http.ResponseWriter, r *http.Request) {
    tr := &http.Transport{
            TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
        }

    client := &http.Client{Transport: tr}

    url := fmt.Sprintf("https://%v/api", r.URL.Query().Get("proxy"))

    // Noncompliant: user-input crafted from `$REQUEST` is used as path
    // ruleid: rule-ssrf-updatedMIT
    resp, err := client.Post(url, "application/json", r.Body)

    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    defer resp.Body.Close()

    if resp.StatusCode != 200 {
        w.WriteHeader(500)
        return
    }

    w.Write([]byte(fmt.Sprintf("{\"host\":\"%v\"}", r.URL.Query().Get("proxy"))))
    return
}

func ssrfCompliant(w http.ResponseWriter, r *http.Request) {
    // Compliant: Hardcoded path is used in the request
    // ok: rule-ssrf-updatedMIT
    _, err := http.Get("https://example.com")
    if err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
}