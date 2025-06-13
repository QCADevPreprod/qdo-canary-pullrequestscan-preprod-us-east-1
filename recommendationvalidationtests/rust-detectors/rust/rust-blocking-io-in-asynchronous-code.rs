use std::net::{TcpListener, TcpStream,IpAddr, Ipv4Addr,SocketAddr, SocketAddrV4};
use std::net::ToSocketAddrs;
use std::net::UdpSocket;
use tokio::task;
use std::fs;

async fn write_to_file_blocking(file_path: &str, content: &str) {
    task::spawn_blocking(move || {
			//ruleid: rust-blocking-io-in-asynchronous-code
        fs::write(file_path, content).unwrap();
    }).await.unwrap();
}

async fn create_directory_blocking(dir_path: &str) {
    task::spawn_blocking(move || {
			//ruleid: rust-blocking-io-in-asynchronous-code
        fs::create_dir(dir_path).unwrap();
    }).await.unwrap();
}

async fn delete_file_blocking(file_path: &str) {
    task::spawn_blocking(move || {
		//ruleid: rust-blocking-io-in-asynchronous-code
        fs::remove_file(file_path).unwrap();
    }).await.unwrap();
}

async fn start_listener_blocking(addr: &str) {
    task::spawn_blocking(move || {
		//ruleid: rust-blocking-io-in-asynchronous-code
        let listener = TcpListener::bind(addr).unwrap();
        for stream in listener.incoming() {
            handle_client(stream.unwrap());
        }
    }).await.unwrap();
}

async fn start_listener_blocking(addr: &str) {
    task::spawn_blocking(move || {
		//ruleid: rust-blocking-io-in-asynchronous-code
        let listener = TcpListener::bind(addr).unwrap();
        for stream in listener.incoming() {
            handle_client(stream.unwrap());
        }
    }).await.unwrap();
}

fn fun(){
let mut request_context = RequestContext::new(); 
    request_context.authentication_succeeded(&AuthenticationInfo {
        caller_id: "caller-id".into(),
        access_key_id: "AKIDEXAMPLE".into(),
        user_agent: "user-agent".into(),
        //ok: rust-blocking-io-in-asynchronous-code
        source_ip: Some(IpAddr::V4(Ipv4Addr::LOCALHOST)),
        authn_success: None,
    });
}

fn compliant()
{
    //ok: rust-blocking-io-in-asynchronous-code
  let _addr = SocketAddr::V4(SocketAddrV4::new(Ipv4Addr::new(127, 0, 0, 1), 8080));
}

use tokio::fs;
use tokio::net::{TcpListener, TcpStream};
use tokio::stream::StreamExt;

async fn read_file_blocking(file_path: &str) -> String {
    tokio::task::spawn_blocking(move || {
			//ok: rust-blocking-io-in-asynchronous-code
        net::read_to_string(file_path).unwrap()
    }).await.unwrap()
}

async fn read_file_non_blocking(file_path: &str) -> Result<String, std::io::Error> {
   //ok: rust-blocking-io-in-asynchronous-code
    fs::read_to_string(file_path).await
}

async fn start_listener_non_blocking(addr: &str) {
	//ok: rust-blocking-io-in-asynchronous-code
    let listener = TcpListener::bind(addr).await.unwrap();
    let mut incoming = listener.incoming();
    while let Some(stream) = incoming.next().await {
        let stream = stream.unwrap();
        tokio::spawn(async move {
            handle_client(stream).await;
        });
    }
}
