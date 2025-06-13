use std::mem;


    let value: i32 = 42;
    let ptr = &value as *const i32;
    // ruleid: rust-use-of-mem-transmute
    let transmuted_ptr = unsafe { mem::transmute::<*const i32, *const u8>(ptr) };


    let value: i32 = 42;
    // ok: rust-use-of-mem-transmute
    let value_as_u8: u8 = value as u8;

    println!("Value as u8: {}", value_as_u8);



fn noncompliant2() {
    
    let num: u32 = 12345;
    // ruleid: rust-use-of-mem-transmute
    let bytes: [u8; 4] = unsafe { mem::transmute(num) }; 
    println!("{:?}", bytes);
}

fn compliant2() {
    let num: u32 = 12345;
    // ok: rust-use-of-mem-transmute
    let bytes: [u8; 4] = num.to_le_bytes(); 
    println!("{:?}", bytes);
}


fn noncompliant3() {
    let vec_data: Vec<u8> = vec![65, 66, 67];
     // ruleid: rust-use-of-mem-transmute
    let str_data: String = unsafe { mem::transmute(vec_data) }; 
    println!("{}", str_data);
}


fn compliant3() {
    let vec_data: Vec<u8> = vec![65, 66, 67];
    // ok: rust-use-of-mem-transmute
    let slice_data: &[u8] = &vec_data; 
    println!("{:?}", slice_data);
}


fn noncompliant4() {
    let num: u32 = 12345;
    // ruleid: rust-use-of-mem-transmute
    let bytes: [u8; 8] = unsafe { mem::transmute(num) }; 
    println!("{:?}", bytes);
}

fn compliant4() {
    let str_data: String = String::from("Hello");
    // ok: rust-use-of-mem-transmute
    let vec_data: Vec<u8> = str_data.into_bytes(); 
    println!("{:?}", vec_data);
}


fn noncompliant5() {
    let str_data: String = String::from("Hello");
    // ruleid: rust-use-of-mem-transmute
    let vec_data: Vec<u8> = unsafe { mem::transmute(str_data) }; 
    println!("{:?}", vec_data);
}

fn compliant5() {
    let vec_data: Vec<u8> = vec![72, 101, 108, 108, 111];
    // ok: rust-use-of-mem-transmute
    let str_data: String = String::from_utf8(vec_data).unwrap(); 
    println!("{}", str_data);
}


 let value: i32 = 42;
    // ok: rust-use-of-mem-transmute
    let ptr = &value as *const i32 as *const u8;
    println!("Transmuted Pointer as u8: {:?}", ptr);



 fn main() {
    println!("Try programiz.pro");
}
