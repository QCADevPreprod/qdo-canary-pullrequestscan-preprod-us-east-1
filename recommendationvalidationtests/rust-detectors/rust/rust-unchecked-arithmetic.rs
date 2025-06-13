fn noncompliant1() {
    let a: u32 = std::u32::MAX;
    let b: u32 = 1;
    //ruleid: rust-unchecked-arithmetic
    let result = a + b; 
    println!("Result: {}", result);
}

fn noncompliants1() {
    let mut b=0;
    let mut a=0;
    //ruleid: rust-unchecked-arithmetic
    let result = a + b; 
    println!("Result: {}", result);
}

fn noncompliant2() {
    let a: u32 = 0;
    let b: u32 = 1;
    //ruleid: rust-unchecked-arithmetic
    let result = a - b; 
    println!("Result: {}", result);
}

fn noncompliant3() {
    let a: u32 = std::u32::MAX;
    let b: u32 = 2;
    //ruleid: rust-unchecked-arithmetic
    let result = a * b; 
    println!("Result: {}", result);
}

fn noncompliant4() {
    let a: u32 = 10;
    let b: u32 = 2;
    //ruleid: rust-unchecked-arithmetic
    let result = a / b; 
    println!("Result: {}", result);
}

fn noncompliant5() {
    let mut result: u32 = 1;
    let mut nodes_count: u32 = 0;
    for _ in 0..10 {
        //ruleid: rust-unchecked-arithmetic
        result *= 10; 
        //ruleid: rust-unchecked-arithmetic
        nodes_count -= 1;
    }
    println!("Result: {}", result);
}

fn compliant1() {
    let a: u32 = std::u32::MAX;
    let b: u32 = 1;
    //ok: rust-unchecked-arithmetic
    let result = a.checked_add(b); 
    match result {
        Some(val) => println!("Result: {}", val),
        None => println!("Addition overflowed"),
    }
}

fn compliant2() {
    let a: u32 = 0;
    let b: u32 = 1;
    //ok: rust-unchecked-arithmetic
    let result = a.checked_sub(b); 
    match result {
        Some(val) => println!("Result: {}", val),
        None => println!("Subtraction underflowed"),
    }
}

fn compliant3() {
    let a: u32 = std::u32::MAX;
    let b: u32 = 2;
    //ok: rust-unchecked-arithmetic
    let result = a.checked_mul(b); 
    match result {
        Some(val) => println!("Result: {}", val),
        None => println!("Multiplication overflowed"),
    }
}

fn compliant4() {
    let a: u32 = 10;
    let b: u32 = 0;
    //ok: rust-unchecked-arithmetic
    let result = a.checked_div(b); 
    match result {
        Some(val) => println!("Result: {}", val),
        None => println!("Division by zero"),
    }
}

fn compliant5()
{
    let mut ordered_params = "<".to_string();
    let mut index=0;
    //ok: rust-unchecked-arithmetic
    ordered_params += ">";
    //ok: rust-unchecked-arithmetic
    index += 1;
    //ok: rust-unchecked-arithmetic
    let a=ordered_params+index.to_string();
    //ok: rust-unchecked-arithmetic
    let add= index.to_string()+ ordered_params;
        let request = 11;
    //ok: rust-unchecked-arithmetic
    let expected_response = request * request;
 
}

fn main()
{
    
}
