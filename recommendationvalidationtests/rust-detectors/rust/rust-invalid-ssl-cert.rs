use openssl::ssl::{SslMethod, SslConnectorBuilder, SSL_VERIFY_NONE};
use reqwest; 

let mut connector = SslConnectorBuilder::new(SslMethod::tls()).unwrap();


// ruleid: rust-invalid-ssl-cert
connector.builder_mut().set_verify(SSL_VERIFY_NONE); 



// ok: rust-invalid-ssl-cert
connector.builder_mut().set_verify(SSL_VERIFY_PEER);


let openssl = OpenSsl::from(connector.build());

use reqwest::header;


// ruleid: rust-invalid-ssl-cert
let client = reqwest::Client::builder()
    .danger_accept_invalid_hostnames(true)
    .build();


    

    async fn main() -> Result<(), reqwest::Error> {
    // ok: rust-invalid-ssl-cert
    let client = reqwest::Client::builder()
        .build()?;

    let res = client.get("https://example.com").send().await?;
    println!("Status: {}", res.status());

    Ok(())
}



// ruleid: rust-invalid-ssl-cert
let client = reqwest::Client::builder()
    .danger_accept_invalid_certs(true)
    .build();


    async fn main() -> Result<(), reqwest::Error> {
    // ok: rust-invalid-ssl-cert
    let client = reqwest::Client::builder()
        .build()?; 
    let res = client.get("https://example.com").send().await?;
    println!("Status: {}", res.status());
    
    return Ok(());
}




// ruleid: rust-invalid-ssl-cert
let client = reqwest::Client::builder()
    .user_agent("USER AGENT")
    .cookie_store(true)
    .danger_accept_invalid_hostnames(true)
    .build();




    async fn main() -> Result<(), reqwest::Error> {
    // ok: rust-invalid-ssl-cert
    let client = reqwest::Client::builder()
        .user_agent("USER AGENT")
        .cookie_store(true)
        .build()?; 
    let response = client.get("https://example.com").send().await?;

    println!("Status: {}", response.status());

    Ok(())
}



// ruleid: rust-invalid-ssl-cert
let client = reqwest::Client::builder()
    .user_agent("USER AGENT")
    .cookie_store(true)
    .danger_accept_invalid_certs(true)
    .build();



// ok: rust-invalid-ssl-cert
let client = reqwest::Client::builder()
    .user_agent("USER AGENT")
    .build();





    use rustls::{RootCertStore, Certificate, ServerCertVerified, TLSError, ServerCertVerifier};

let verifier = MyServerCertVerifie;

// ruleid: rust-invalid-ssl-cert
let mut c2 = rustls::client::DangerousClientConfig {cfg: &mut cfg};
c2.set_certificate_verifier(verifier);


// ok: rust-invalid-ssl-cert
let mut c1 = rustls::client::ClientConfig::new();






let mut c3 = rustls::client::ClientConfig::new();

// ruleid: rust-invalid-ssl-cert
c3.dangerous().set_certificate_verifier(verifier);



// ok: rust-invalid-ssl-cert
let roots = rustls::RootCertStore::from_pem_file("path/to/trusted_roots.pem").unwrap();
let verifier = rustls::client::WebPKIVerifier::new(roots);
c3.set_certificate_verifier(verifier);



// ruleid: rust-invalid-ssl-cert
let mut c4 = rustls::client::ClientConfig::dangerous(&mut ());
c4.set_certificate_verifier(verifier);



let mut c5 = rustls::client::ClientConfig::new();
// ok: rust-invalid-ssl-cert
let roots = rustls::RootCertStore::from_pem_file("path/to/trusted_roots.pem").unwrap();
let verifier = rustls::client::WebPKIVerifier::new(roots);
c5.set_certificate_verifier(verifier);
