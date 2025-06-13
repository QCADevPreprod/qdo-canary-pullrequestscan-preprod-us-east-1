use ftp::{FtpError, FtpStream};
use std::{io::Cursor, str};

// ruleid: rust-ftp
let mut ftp_stream = FtpStream::connect((addr, 21)).unwrap();
let _ = ftp_stream.login("Doe", "mumble").unwrap();

// ruleid: rust-ftp
let mut ftp_stream = FtpStream::connect("127.1.2.3:45").unwrap();
println!("Welcome message: {:?}", ftp_stream.get_welcome_msg());
let _ = ftp_stream.login("Doe", "mumble").unwrap();

// ruleid: rust-ftp
let mut ftp_stream = FtpStream::connect("example.com").unwrap();
ftp_stream.login("anonymous", "me@example.com").unwrap();

impl FtpConnection {
    pub fn connect(&mut self, config: Config) {
// ruleid: rust-ftp
        let mut new_stream = FtpStream::connect(format!("{}:{}", &config.address, &config.port)).unwrap();
        new_stream.login(&config.username, &config.password).unwrap();

        self.stream = Some(new_stream);
    }
}

use suppaftp::FtpStream;

// ok: rust-ftp
let mut ftp_stream = FtpStream::connect("example.com").unwrap();
ftp_stream.login("anonymous", "me@example.com").unwrap();

fn main()
{}
