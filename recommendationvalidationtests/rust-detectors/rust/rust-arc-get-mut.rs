use std::sync::{Arc, Mutex};
use std::thread;

fn non_compliant_unchecked_access(shared_data: Arc<Mutex<Vec<i32>>>) {
    let shared_data_clone = Arc::clone(&shared_data);
    let handle = thread::spawn(move || {
    // ruleid: rust-arc-get-mut
        let mut data = Arc::get_mut(&mut shared_data_clone).unwrap();
        data.push(4);
    });
    // ruleid: rust-arc-get-mut
    let mut data = Arc::get_mut(&mut shared_data).unwrap();
    data.push(5);
    handle.join().unwrap();
}

fn non_compliant_multiple_threads(shared_data: Arc<Mutex<Vec<i32>>>) {
    let mut handles = vec![];
    for _ in 0..2 {
        let shared_data_clone = Arc::clone(&shared_data);
        let handle = thread::spawn(move || {
    // ruleid: rust-arc-get-mut
            let mut data = Arc::get_mut(&mut shared_data_clone); 
            data.push(4); 
            
        });
        handles.push(handle);
    }
    for handle in handles {
        handle.join().unwrap();
    }
}

fn compliant_mutex_synchronization(shared_data: Arc<Mutex<Vec<i32>>>) {
    let shared_data_clone = Arc::clone(&shared_data);
    let handle = thread::spawn(move || {
    // ok: rust-arc-get-mut
        let mut data = shared_data_clone.lock().unwrap();
        data.push(4);
    });
    let mut data = shared_data.lock().unwrap();
    data.push(5);
    handle.join().unwrap();
}

fn compliant_immutable_data(shared_data: Arc<Mutex<Vec<i32>>>) {
    let shared_data_clone = Arc::clone(&shared_data);

    let handle = thread::spawn(move || {
    // ok: rust-arc-get-mut
        let data = shared_data_clone.lock().unwrap();
        println!("{:?}", *data);
    });
    let data = shared_data.lock().unwrap();
    println!("{:?}", *data);
    handle.join().unwrap();
}

fn compliant_avoid_arc_get_mut(shared_data: Arc<Mutex<Vec<i32>>>) {
    let shared_data_clone = Arc::clone(&shared_data);
    let handle = thread::spawn(move || {
    // ok: rust-arc-get-mut
        let mut data = shared_data_clone.lock().unwrap();
        data.push(4);
    });
    let mut data = shared_data.lock().unwrap();
    data.push(5);
    handle.join().unwrap();
}

#[test]
fn test_arc_get_mut() {
    let mut x = Arc::new(3);
    // ok: rust-arc-get-mut
    *Arc::get_mut(&mut x).unwrap() = 4;
    assert_eq!(*x, 4);
    let y = x.clone();
    assert!(Arc::get_mut(&mut x).is_none());
    drop(y);
    assert!(Arc::get_mut(&mut x).is_some());
    let _w = Arc::downgrade(&x);
    assert!(Arc::get_mut(&mut x).is_none());
}

fn main() {
}
