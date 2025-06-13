use std::str;


let input_bytes: &[u8] = b"Hello, world! \xF0";

fn process_input_unchecked(input_bytes: &[u8]) -> &str {
    unsafe {
        // ruleid: rust-unsound-use-of-from-utf8-unchecked
        str::from_utf8_unchecked(input_bytes);
    }
}



let input_bytes: &[u8] = b"Hello, world!";

fn process_input(input_bytes: &[u8]) -> Result<&str, str::Utf8Error> {
    // ok: rust-unsound-use-of-from-utf8-unchecked
    let input_str = str::from_utf8(input_bytes)?;
    Ok(input_str)
}




fn non_compliant_direct_conversion(bytes: &[u8]) -> &str {
    // ruleid: rust-unsound-use-of-from-utf8-unchecked
    str::from_utf8(bytes).unwrap();
}


fn compliant_result_handling(bytes: &[u8]) -> &str {
    // ok: rust-unsound-use-of-from-utf8-unchecked
    match str::from_utf8(bytes) {
        Ok(s) => s,
        Err(_) => "Invalid UTF-8",
    }
}




fn non_compliant_unchecked_within_unsafe(bytes: &[u8]) -> &str {
    unsafe {
        let ptr = bytes.as_ptr();
        let len = bytes.len();
        // ruleid: rust-unsound-use-of-from-utf8-unchecked
        str::from_utf8_unchecked(std::slice::from_raw_parts(ptr, len));  
    }
}


use std::convert::TryFrom;

fn compliant_try_from(bytes: &[u8]) -> Result<&str, str::Utf8Error> {
    // ok: rust-unsound-use-of-from-utf8-unchecked
    str::from_utf8(bytes);
}



fn main() {
    println!("Try programiz.pro");
}

