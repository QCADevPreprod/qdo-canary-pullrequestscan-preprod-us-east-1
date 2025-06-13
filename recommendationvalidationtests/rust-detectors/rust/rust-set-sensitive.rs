use reqwest::header;
use reqwest::{blocking::Client, header::HeaderMap, header::HeaderValue, Url};

let mut headers = HeaderMap::new();
let header = HeaderValue::from_static("secret");
// ruleid: rust-set-sensitive
headers.insert(header::AUTHORIZATION, header);

let mut headers = HeaderMap::new();
let header = HeaderValue::from_static("secret");
// ruleid: rust-set-sensitive
headers.insert(AUTHORIZATION, header);

let mut headers = HeaderMap::new();
let header = HeaderValue::from_static("secret");
// ruleid: rust-set-sensitive
headers.insert("Authorization", header);

let mut headers = HeaderMap::new();
let header = HeaderValue::from_static("secret").map_err(|e| {
    Error::Generic(format!(
        "Error"
    ))
});
// ruleid: rust-set-sensitive
headers.insert(AUTHORIZATION, header);

let mut headers = HeaderMap::new();
// ruleid: rust-set-sensitive
headers.insert(header::AUTHORIZATION, HeaderValue::from_static("secret"));

let mut headers = header::HeaderMap::new();
let header = header::HeaderValue::from_static("secret");
header.set_sensitive(true);
// ok: rust-set-sensitive
headers.insert(header::AUTHORIZATION, header);
