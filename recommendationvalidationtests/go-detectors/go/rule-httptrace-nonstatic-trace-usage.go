package uhoh

import (
	"context"
	"net"
	"net/http"
	"net/http/httptrace"
)

func dynamicHttptraceClienttraceNoncompliant(req *http.Request, trace *httptrace.ClientTrace) *http.Request {
    // Noncompliant: ClientTrace used directly in request
	// ruleid: rule-httptrace-nonstatic-trace-usage
	return req.WithContext(httptrace.WithClientTrace(req.Context(), trace))
}

func dynamicHttptraceClienttraceCompliant(req *http.Request, trace *httptrace.ClientTrace) *http.Request {
	trace := &httptrace.ClientTrace{
		GetConn:      func(host string) { fmt.Println("Connecting to", host) },
		ConnectDone:  func(network, addr string, err error) { fmt.Println("TCP connection created:", network, addr,err) },
		GotConn:      func(info httptrace.GotConnInfo) { fmt.Println("CONNECTED!!! Info:", info) },
	}
	// Compliant: attach ClientTrace to the Context, and Context to request
	//ok: rule-httptrace-nonstatic-trace-usage
	ctx = httptrace.WithClientTrace(ctx, trace)
	req = req.WithContext(ctx)
	return req
}