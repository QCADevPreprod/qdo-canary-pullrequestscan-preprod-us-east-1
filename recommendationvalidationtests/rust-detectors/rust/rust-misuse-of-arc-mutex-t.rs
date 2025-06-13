use std::sync::{Arc, Mutex,RwLock};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;

let data = Arc::new(Mutex::new(0));

for _ in 0..10 {
   let data_clone = Arc::clone(&data);
   thread::spawn(move || {
       //ruleid: rust-misuse-of-arc-mutex-t
       let mut guard = data_clone.lock().unwrap();
       *guard += 1;
   });
}


for _ in 0..10 {
   let data_clone = Arc::clone(&data);
   thread::spawn(move || {
       {
           let mut guard = data_clone.lock().unwrap();
           *guard += 1;
       } //ok: rust-misuse of Arc<Mutex<T>>
       // Mutex released at the end of the scope
       // Continue with other operations outside the lock
   });
}



let info = Arc::new(Mutex::new(Vec::new()));
for _ in 0..10 {
   let data_clone = Arc::clone(&info);
   thread::spawn(move || {
       //ruleid: rust-misuse-of-arc-mutex-t
       let mut guard = data_clone.lock().unwrap();
       //ruleid: rust-misuse-of-arc-mutex-t
       guard.push(1);
   });
}


for _ in 0..10 {
   let data_clone = Arc::clone(&info);
   thread::spawn(move || {
       {
           let mut guard = data_clone.lock().unwrap();
           guard.push(1);
       } //ok: rust-misuse of Arc<Mutex<T>>
       // Mutex released after critical operation
       // Continue with other operations outside the lock
   });
}



//ruleid: rust-misuse-of-arc-mutex-t
let data: Vec<Arc<Mutex<i32>>> = (0..10).map(|x| Arc::new(Mutex::new(x))).collect();


use std::sync::{Arc, RwLock};
let rwdata = Arc::new(RwLock::new(Vec::new()));
for _ in 0..10 {
   let data_clone = Arc::clone(&rwdata);
   thread::spawn(move || {
       {
           let mut guard = data_clone.write().unwrap();
           guard.push(1);
       } //ok: rust-misuse-of-arc-mutex-t   
   });
}

   fn compliant() {
        let data = Arc::new(Mutex::new(0));
        let t1 = {
            let data = Arc::clone(&data);
            thread::spawn(move || {
               //ok: rust-misuse-of-arc-mutex-t   
                let mut data = data.lock().unwrap();
                for _ in 0..1_000_000 {
                    *data += 1;
                }
            })
        };

        let t2 = {
            let data = Arc::clone(&data);
            thread::spawn(move || {
               //ok: rust-misuse-of-arc-mutex-t   
                let mut data = data.lock().unwrap();
                for _ in 0..1_000_000 {
                    *data -= 1;
                }
            })
        };
        t1.join().unwrap();
        t2.join().unwrap();

        println!("Final data value: {:?}", data.lock().unwrap());
   }

fn main() {
    println!("Try programiz.pro");
}
