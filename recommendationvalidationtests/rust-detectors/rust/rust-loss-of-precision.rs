use rug::Float;
use std::process::Command;

//ruleid: rust-loss-of-precision
fn try_round_u64(value: f64) -> Option<u64> {
    Some(value.round() as u64)
}

//ruleid: rust-loss-of-precision
fn try_round_u32(value: f32) -> Option<u32> {
    if value >= 0.0 && value <= u32::MAX as f32 {
        Some(value.round() as u32)
    } else {
        None
    }
}

//ruleid: rust-loss-of-precision
fn try_floor_u64(value: f64) -> Option<u64> {
    let mut rug_float = rug::Float::with_val(53, value);
    rug_float = rug_float.floor();
    Some(rug_float.to_u64().unwrap())
}

//ok: rust-loss-of-precision
fn try_floor_u64(value: f64) -> Option<u64> {
    let mut rug_float = rug::Float::with_val(53, value);
    rug_float = rug_float.floor();
    if rug_float >= 0.0 && rug_float <= u64::MAX as f64 {
        Some(rug_float.to_u64().unwrap()) 
    } else {
        None 
    }
}

//ok: rust-loss-of-precision
fn try_floor_u64(value: f64) -> Option<u64> {
    if value.is_sign_negative() || value.is_nan() {
        None 
    } else {
        let rounded = value.floor();
        if rounded >= 0.0 && rounded <= u64::MAX as f64 {
            Some(rounded as u64)
        } else {
            None 
        }
    }
}

//ok: rust-loss-of-precision
fn try_round_u32(value: f32) -> Option<u32> {
    
    if value >= 0.0 && value <= u32::MAX as f32 {
       
        let rounded = value.round();
        
        if rounded >= 0.0 && rounded <= u32::MAX as f32 {
            Some(rounded as u32)
        } else {
            None 
        }
    } else {
        None 
    }
}

//ok: rust-loss-of-precision
fn try_floor_u64(value: f64) -> Option<u64> {
    let mut rug_float = rug::Float::with_val(53, value);
    rug_float = rug_float.floor();
    if rug_float >= 0.0 && rug_float <= u64::MAX as f64 {
        Some(rug_float.to_u64().unwrap()) 
    } else {
        None 
    }
}
