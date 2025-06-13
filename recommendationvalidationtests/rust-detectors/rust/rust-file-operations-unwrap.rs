
use std::fs::File;
use std::io::Read;


// ruleid: rust-file-operations-unwrap
let mut f = std::fs::File::open("../monsterdata_test.mon").unwrap();
let mut buf = Vec::new();


// ok: rust-file-operations-unwrap
let mut f = std::fs::File::open(filename)?;
let mut buf = Vec::new();
// {/fact}




// ruleid: rust-file-operations-unwrap
let log_file = std::fs::File::open(log_file_path).unwrap();
let mut first_line = String::new();




let file_path = "data.txt";
// ruleid: rust-file-operations-unwrap
let file = std::fs::File::open(file_path).expect("Failed to open file");  // Ignoring error message




let file_path = "data.txt";
// ok: rust-file-operations-unwrap
let file = std::fs::File::open(file_path).unwrap_or_else(|err| {
    eprintln!("Failed to open file: {}", err);
    std::process::exit(1);  
});




let file_path = "data.txt";
let mut contents = String::new();
// ruleid: rust-file-operations-unwrap
std::fs::File::open(file_path).unwrap().read_to_string(&mut contents).unwrap();  



fn read_file_contents(file_path: &str) -> std::io::Result<String> {
    // ok: rust-file-operations-unwrap
    let mut file = std::fs::File::open(file_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}


fn main() {
    println!("Try programiz.pro");
}
