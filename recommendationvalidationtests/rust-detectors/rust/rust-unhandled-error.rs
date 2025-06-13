use std::fs::File;

fn noncompliant1() {
     //ruleid: rust-unhandled-error
    let result: Result<i32, &str> = Err("Error occurred");
    let value = result.unwrap(); 
    println!("Value: {}", value);
}

fn noncompliant2() {
     //ruleid: rust-unhandled-error
    let option: Option<i32> = None;
    let value = option.unwrap(); 
    println!("Value: {}", value);
}

fn noncompliant3() {
      //ruleid: rust-unhandled-error
    let result: Result<i32, &str> = Ok(42);
    let value = result.expect("Error occurred"); 
    println!("Value: {}", value);
}

fn compliant1() {
    //ok: rust-unhandled-error
    let option: Option<i32> = Some(42);
    let value = option.unwrap_or_default(); 
    println!("Value: {}", value);
}

fn compliant2() {
     //ok: rust-unhandled-error
    let result: Result<i32, &str> = Ok(42);
    if let Ok(value) = result { 
        println!("Value: {}", value);
    } else {
        eprintln!("Error occurred");
    }
}

fn compliant3() {
    //ok: rust-unhandled-error
    let result: Result<i32, &str> = Ok(42); 
    match result {
        Ok(value) => {
            println!("Value: {}", value);
        }
        Err(error_message) => {
            eprintln!("Error occurred: {}", error_message);
        }
    }
}
