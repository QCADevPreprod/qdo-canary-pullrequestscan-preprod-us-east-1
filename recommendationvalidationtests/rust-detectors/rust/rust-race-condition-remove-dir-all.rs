
use std::fs;
use std::thread;
use std::os::unix::fs as unix_fs;
use std::sync::{Mutex, Arc};


fn vulnerable_remove_dir_all(dir_path: &str) {
    if fs::metadata(dir_path).unwrap().is_dir() {
        // ruleid: rust-race-condition-remove-dir-all 
        fs::remove_dir_all(dir_path).unwrap();
    }
}


fn safe_remove_dir_all(dir_path: &str) {
    
    if let Ok(metadata) = fs::symlink_metadata(dir_path) {
    // ok: rust-race-condition-remove-dir-all 
        if metadata.file_type().is_dir() {
            unix_fs::symlink_metadata(dir_path).map(|metadata| {
                if metadata.file_type().is_symlink() {
                    fs::remove_file(dir_path).unwrap();
                }
            }).unwrap();
            fs::remove_dir_all(dir_path).unwrap();  
        }
   }
}



fn non_compliant_symbolic_link_handling(dir_path: &str) {
    if let Ok(metadata) = fs::symlink_metadata(dir_path) {
        if metadata.is_dir() {
        // ruleid: rust-race-condition-remove-dir-all 
            fs::remove_dir_all(dir_path).unwrap();
        }
    }
}


fn compliant_error_handling(dir_path: &str) -> Result<(), std::io::Error> {
    match fs::metadata(dir_path) {
        Ok(metadata) => {
            if metadata.is_dir() {
                fs::remove_dir_all(dir_path)?;
            }
        }
        // ok: rust-race-condition-remove-dir-all 
        Err(err) => {
            return Err(err);
        }
    }
    Ok(())
}



fn non_compliant_concurrent_delete(dir_path: &str) {
    if fs::metadata(dir_path).unwrap().is_dir() {
        thread::spawn(|| {
        // ruleid: rust-race-condition-remove-dir-all 
            fs::remove_dir_all(dir_path).unwrap();
        });
    }
}


fn compliant_synchronized_delete(dir_path: &str, lock: &Arc<Mutex<()>>) -> Result<(), std::io::Error> {
// ok: rust-race-condition-remove-dir-all 
    let _guard = lock.lock().unwrap(); // Acquire lock
    if fs::metadata(dir_path)?.is_dir() {
        fs::remove_dir_all(dir_path)?;
    }
    Ok(())
}



fn non_compliant_error_handling(dir_path: &str) {
    match fs::metadata(dir_path) {
        Ok(metadata) => {
            if metadata.is_dir() {
            // ruleid: rust-race-condition-remove-dir-all 
                fs::remove_dir_all(dir_path).unwrap();
            }
        }
        Err(err) => {
            println!("Error: {:?}", err);
            // Handle error appropriately
        }
    }
}


fn compliant_error_handling(dir_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    match fs::metadata(dir_path) {
        Ok(metadata) => {
            if metadata.is_dir() {
                fs::remove_dir_all(dir_path)?;
            }
            Ok(()) 
        }
        // ok: rust-race-condition-remove-dir-all 
        Err(err) => Err(err.into()),
    }
}


fn unsafe_remove_dir_all(dir_path: &str) {
    if let Ok(metadata) = fs::symlink_metadata(dir_path) {
        if metadata.file_type().is_dir() {
            std::thread::sleep(std::time::Duration::from_secs(1));
        // ruleid: rust-race-condition-remove-dir-all 
            fs::remove_dir_all(dir_path).unwrap();  
        }
    }
}

fn main() {
    println!("Try programiz.pro");
}
