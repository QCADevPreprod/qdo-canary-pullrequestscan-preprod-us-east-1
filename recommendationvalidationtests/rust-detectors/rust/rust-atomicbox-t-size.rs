use std::sync::atomic::{AtomicBox, Ordering};
use std::thread;



fn non_compliant_unsized_type() {
  // ruleid: rust-atomicbox-t-size
    let atomic_box: AtomicBox<dyn Trait> = AtomicBox::new(ConcreteType {});
    thread::spawn(move || {
        // Do something with atomic_box
    });
}


fn non_compliant_unsafe_trait_bounds() {
    struct NonSendType;
    // ruleid: rust-atomicbox-t-size
    let atomic_box: AtomicBox<NonSendType> = AtomicBox::new(NonSendType {});
    thread::spawn(move || {
        // Do something with atomic_box
    });
}


fn non_compliant_unsized_type() {
    // ruleid: rust-atomicbox-t-size
    let atomic_box = AtomicBox::new(Box::new([0u8; 10])); // Unsized type: [u8]
    thread::spawn(move || {
        atomic_box.load().store(Box::new([1u8; 10]), Ordering::SeqCst);
    });
}


fn non_compliant_dynamic_allocation() {
    // ruleid: rust-atomicbox-t-size
    let atomic_box = AtomicBox::new(Box::new(vec![1, 2, 3])); 
    thread::spawn(move || {
        atomic_box.load().store(Box::new(vec![4, 5, 6]), Ordering::SeqCst);
    });
}





fn compliant_sized_type() {
    // ok: rust-atomicbox-t-size
    let atomic_box: AtomicBox<i32> = AtomicBox::new(42);
    thread::spawn(move || {
        // Do something with atomic_box
    });
}




fn compliant_safe_trait_bounds<T: Send + Sync>() {
    // ok: rust-atomicbox-t-size
    let atomic_box: AtomicBox<T> = AtomicBox::new(get_value());
    thread::spawn(move || {
        // Do something with atomic_box
    });
}



    fn compliant_sized_type() {
    // ok: rust-atomicbox-t-size
    let atomic_box = AtomicBox::new(Box::new(42)); 
    thread::spawn(move || {
        atomic_box.load().store(Box::new(99), Ordering::SeqCst);
    });
    }



fn main() {
    println!("Try programiz.pro");
}
