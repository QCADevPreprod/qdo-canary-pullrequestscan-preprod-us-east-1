
// ruleid: rust-unsafe-usage
let pid = unsafe { libc::getpid() as u32 };


// ok: rust-unsafe-usage
let pid = libc::getpid() as u32;


unsafe fn noncompliant2() {
    let ptr: *const i32 = std::ptr::null();
    // ruleid: rust-unsafe-usage
    let val = unsafe { *ptr }; 
}


unsafe fn compliant2() {
    let ptr: *const i32 = std::ptr::null();
    // ok: rust-unsafe-usage
    if !ptr.is_null() {
        let val = unsafe { *ptr }; 
    }
}


unsafe fn noncompliant3() {
    let mut uninitialized_val: i32;
    // ruleid: rust-unsafe-usage
    let val = unsafe { uninitialized_val = std::mem::uninitialized() }; 

}


unsafe fn compliant3() {
    // ok: rust-unsafe-usage
        let mut initialized_val: i32 = 0;
        let val = unsafe { initialized_val = std::mem::zeroed() }; 
    }


unsafe fn noncompliant4() {
    let ptr = 0 as *const i32;
    // ruleid: rust-unsafe-usage
    unsafe {
        println!("Value: {}", *ptr); 
    }
    
    }


    unsafe fn compliant4() {
        let x = 10;
        // ok: rust-unsafe-usage
        let ptr = &x as *const i32; 
        unsafe {
            println!("Value: {}", *ptr); 
        }
        
        }

    impl Drop for CompiledTestFile {
        fn drop(&mut self) {
            // Freeing the module's memory erases the compiled functions.
            // This should be safe since their pointers never leave this struct.
            // ok: rust-unsafe-usage
            unsafe { self.module.take().unwrap().free_memory() }
        }
    }
    

fn main() {
    println!("Try programiz.pro");
}
