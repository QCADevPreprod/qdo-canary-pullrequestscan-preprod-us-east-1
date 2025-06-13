use std::env;
use clap::{App, Arg};
    
    // ruleid: rust-avoid-stdenv-for-security
    let exe = env::current_exe();
    
    // ruleid: rust-avoid-stdenv-for-security
    let dir = env::temp_dir();
    
    // ruleid: rust-avoid-stdenv-for-security
    let args = env::args();

   // ruleid: rust-avoid-stdenv-for-security
    let args = env::args_os();

    // ok: rust-avoid-stdenv-for-security
    let mut temp_file = tempfile().expect("Failed to create temporary file");

    // ok: rust-avoid-stdenv-for-security
    let matches = App::new("MyApp")
