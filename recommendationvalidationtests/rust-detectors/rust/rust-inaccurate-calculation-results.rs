

fn nonCompliant1(a: f64, b: f64) -> bool {
    // ruleid: rust-inaccurate-calculation-results
        a == b;
    }
    
    
    
    fn compliant1(a: f64, b: f64, epsilon: f64) -> bool {
    // ok: rust-inaccurate-calculation-results
        (a - b).abs() < epsilon;
    }
    
    
    
    fn nonCompliant2(values: &[f64]) -> f64 {
        let mut sum = 0.0;
        for &value in values {
        // ruleid: rust-inaccurate-calculation-results
            sum += value;  
        }
        sum
    }

    
    
    fn compliant2(a: i32, b: i32) -> Option<i32> {
    // ok: rust-inaccurate-calculation-results
        a.checked_add(b);
    }
    

    

   
    fn nonCompliant3(a: f64, b: f64) -> f64 {
    // ruleid: rust-inaccurate-calculation-results
        a / b;
    }
    
    
    fn compliant3(a: f64, b: f64) -> Option<f64> {
        if b != 0.0 {
            Some(a / b)
        }
        // ok: rust-inaccurate-calculation-results
        else {
            None  
        }
    }
    


    
    fn nonCompliant4(principal: f64, rate: f64, years: u32) -> f64 {
    // ruleid: rust-inaccurate-calculation-results
        principal * (1.0 + rate).powi(years as i32); 
    }
    
    
    use decimal::d128;
    fn compliant4(principal: d128, rate: d128, years: u32) -> d128 {
    // ok: rust-inaccurate-calculation-results
        principal * (d128::from(1.0) + rate).powi(years as i32);
    }
    
    

    
    
    fn nonCompliant5(a: i32, b: i32) -> i32 {
    // ruleid: rust-inaccurate-calculation-results
        a / b;
    }
    
    
    
    fn  compliant5(a: i32, b: i32) -> Option<i32> {
        if b != 0 {
            Some(a / b)
        }
        // ok: rust-inaccurate-calculation-results
        else {
            None  
        }
    }
    
    
    
    fn main() {
        println!("Try programiz.pro");
    }
