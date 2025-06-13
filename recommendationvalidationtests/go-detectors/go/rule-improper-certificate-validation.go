package main

import (
	"crypto/tls"
	"net/http"
)

func nonCompliant1(authReq *http.Request) *http.Response {
	
	tr := &http.Transport{
		// ruleid: rule-improper-certificate-validation
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	res, _ := client.Do(authReq)
	return res
}
func nonCompliant2()
{
	tr := &http.Transport{
    TLSClientConfig: &tls.Config{
	    Certificates: []tls.Certificate{cert},
		// ruleid: rule-improper-certificate-validation
		InsecureSkipVerify: true
	},
}
}

func nonCompliant3()
{
	tc := &tls.Config{
	Certificates: []tls.Certificate{cert},
	// ruleid: rule-improper-certificate-validation
	InsecureSkipVerify: true
}
tr := &http.Transport{
    TLSClientConfig: tc,
}
}

func nonCompliant4()
{
	// ruleid: rule-improper-certificate-validation
	TLSClientConfig.InsecureSkipVerify = true
}
func compliant1(authReq *http.Request) *http.Response {
	
	tr := &http.Transport{
		// ok: rule-improper-certificate-validation
		TLSClientConfig: &tls.Config{InsecureSkipVerify: false},
	}
	client := &http.Client{Transport: tr}
	res, _ := client.Do(authReq)
	return res
}
