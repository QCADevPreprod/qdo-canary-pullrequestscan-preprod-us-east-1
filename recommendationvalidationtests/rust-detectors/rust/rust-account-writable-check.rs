use std::fs;
use std::io::Error;
use std::io::{self, Write};
use crate::policy::QuestionPolicy;
use std::os::unix::fs::PermissionsExt;
use std::fs::{File, OpenOptions};
use std::path::{Path, PathBuf};

fn noncompliant1() -> io::Result<()> {
    let file_path = "/etc/passwd";
    //ruleid: rust-account-writable-check
    let file = OpenOptions::new().write(true).open(file_path)?;
    if let Err(e) = writeln!(file, "This is sensitive data!") {
        eprintln!("Error writing to file: {}", e);
    } else {
        println!("Data written successfully!");
    }
    Ok(())
	 }

fn noncompliant2() -> io::Result<()> {
    let dir_path = "/etc/"; 
    let file_name = "new_file.txt";
    let file_path = format!("{}{}", dir_path, file_name);
    //ruleid: rust-account-writable-check
    let file = OpenOptions::new().write(true).create(true).open(file_path)?;
    if let Err(e) = writeln!(file, "Sensitive data!") {
        eprintln!("Error writing to file: {}", e);
    } else {
        println!("Data written successfully!");
    }
    Ok(())
}

fn compliant1() -> io::Result<()> {
let file_path = PathBuf::from("example.txt");
if !file_path.exists() || file_path.metadata()?.permissions().mode() & 0o222 != 0 {
   //ok: rust-account-writable-check 
    let file = OpenOptions::new().write(true).create(true).open(&file_path)?;
    if let Err(e) = writeln!(file, "This is some data.") {
        eprintln!("Error writing to file: {}", e);
    } else {
        println!("Data written successfully!");
    }
} else {
    eprintln!("Error: You do not have permission to write to the file at {:?}", file_path);
}
Ok(())
}

pub fn compliant2(path: std::path::PathBuf, name: &str) -> Result<File, String> {
    let mut full_path = PathBuf::from("/safe/directory/");
    full_path.push(path);
    if full_path.to_str().unwrap().contains("../") || full_path.to_str().unwrap().contains("..\\") {
        return Err(format!("Invalid path: {}", path.display()));
    }
	//ok: rust-account-writable-check
    match OpenOptions::new().write(true).open(&full_path) {
        Ok(file) => Ok(file),
        Err(err) => {
            println!("Error: {}", err);
            println!("Not having access to create device, try as root!");
            Err(format!("Error opening file: {}", err))
        }
    }
}

fn user_wants_to_overwrite(path: &Path, question_policy: QuestionPolicy) -> io::Result<Option<bool>> {
  
    Ok(Some(true)) 
}

pub fn compliant3(path: &Path, question_policy: QuestionPolicy) -> Result<Option<File>, Error> {
        //ok: rust-account-writable-check
    match OpenOptions::new().write(true).create_new(true).open(path) {
        Ok(w) => Ok(Some(w)),
        Err(e) if e.kind() == std::io::ErrorKind::AlreadyExists => {
            if user_wants_to_overwrite(path, question_policy)?.is_some() {
                utils::remove_file_or_dir(path)?;
                Ok(Some(fs::File::create(path)?))
            } else {
                Ok(None)
            }
        }
        Err(e) => Err(Error::from(e)),
    }
}

fn compliant4() {
    let file = tempfile::tempfile().expect("Failed to create temporary file");
    //ok: rust-account-writable-check
    let mut options = OpenOptions::new();
    options.write(true);
    match options.open(file.path()) {
        Ok(_) => println!("Temporary file is writable."),
        Err(_) => println!("Temporary file is not writable."),
    }
}

fn main()
{
    
}
