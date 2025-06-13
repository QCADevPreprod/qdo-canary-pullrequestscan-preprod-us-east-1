use std::net::{TcpListener, TcpStream};
use std::io::{Read, Write};

fn noncompliant1() {
    //ruleid: rust-std-net-tcplistener-with-unwrap
    let listener = TcpListener::bind("127.0.0.1:8080").unwrap();
}

fn noncompliant2() {
    //ruleid: rust-std-net-tcplistener-with-unwrap
    let listener = TcpListener::bind("127.0.0.1:8080").unwrap_or_else(|e| {
        panic!("Failed to bind: {}", e);
    });
}

fn noncompliant3() {
    //ruleid: rust-std-net-tcplistener-with-unwrap
    let listener = TcpListener::bind("127.0.0.1:8080").unwrap();
    for stream in listener.incoming() {
        let mut stream = match stream {
            Ok(s) => s,
            Err(e) => {
                eprintln!("Error accepting connection: {}", e);
                continue;
            }
        };
    }
}

fn compliant1() {
    //ok: rust-std-net-tcplistener-with-unwrap
    let listener = match TcpListener::bind("127.0.0.1:8080") {
        Ok(listener) => listener,
        Err(e) => {
            eprintln!("Failed to bind: {}", e);
            return; 
        }
    };
}

fn compliant2() {
    //ok: rust-std-net-tcplistener-with-unwrap
    let _listener = TcpListener::bind("127.0.0.1:8080").expect("Failed to bind");
}
