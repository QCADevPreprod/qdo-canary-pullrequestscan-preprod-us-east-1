use std::mem::MaybeUninit;


// ruleid: rust-uninitialized-memory
let value: i32 = std::mem::uninitialized();



fn compliant1() {
    let mut value = MaybeUninit::<i32>::uninit();
    unsafe {
         // ok: rust-uninitialized-memory
        value.as_mut_ptr().write(0); 
        let value = value.assume_init(); 
        println!("Value: {}", value);
    }
}


// ruleid: rust-uninitialized-memory
let value: i32 = std::mem::MaybeUninit::uninit().assume_init();


fn compliant2() {
    let mut value = MaybeUninit::<i32>::uninit();
    unsafe {
         // ok: rust-uninitialized-memory
        value.as_mut_ptr().write(10);  
        let value = value.assume_init(); 
        println!("Value: {}", value);
    }
}


fn test() {
    unsafe {
    let mut buf: [c_uchar; BSZ] = std::mem::uninitialized();
    // ok: rust-uninitialized-memory
    memset(buf.as_void(), 'a' as c_int, BSZ - 2);
    buf[BSZ - 2] = '\0' as u8;
    buf[BSZ - 1] = 'X' as u8;
    let fp = fmemopen(buf.as_ptr() as *mut c_void, BSZ, cstr!("w+"));
    if fp.is_null() {
    panic!("fmemopen failed");
    }
    }}
    

fn main() {
    println!("Try programiz.pro");
}
