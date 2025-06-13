use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Mutex, mpsc};
use std::thread;
fn noncompliant1() {
    let mut data = 0;
    //ruleid: rust-concurrency-issues-and-data-races
    let t1 = thread::spawn(move || {
        for _ in 0..1_000_000 {
            data += 1;
        }
    });
 //ruleid: rust-concurrency-issues-and-data-races
    let t2 = thread::spawn(move || {
        for _ in 0..1_000_000 {
            data -= 1;
        }
    });

    t1.join().unwrap();
    t2.join().unwrap();

    println!("Final data value: {}", data);
}

static COUNTER: AtomicUsize = AtomicUsize::new(0);

fn noncompliant2() {
    let mut handles = vec![];

    for _ in 0..10 {
         //ruleid: rust-concurrency-issues-and-data-races
        let handle = thread::spawn(|| {
            for _ in 0..1_000 {
                COUNTER.fetch_add(1, Ordering::Relaxed); // Data race occurs here
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", COUNTER.load(Ordering::Relaxed));
}

fn compliant1() {
    let data = Arc::new(Mutex::new(0));

    let t1 = {
        let data = Arc::clone(&data);
        //ok: rust-concurrency-issues-and-data-races
        thread::spawn(move || {
            let mut data = data.lock().unwrap();
            for _ in 0..1_000_000 {
                *data += 1;
            }
        })
    };

    let t2 = {

        let data = Arc::clone(&data);
        //ok: rust-concurrency-issues-and-data-races
        thread::spawn(move || {
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

fn compliant2() {
    let lock1 = Arc::new(Mutex::new(0));
    let lock2 = Arc::new(Mutex::new(0));
    let lock1_clone = Arc::clone(&lock1);
    let lock2_clone = Arc::clone(&lock2);
    //ok: rust-concurrency-issues-and-data-races
    let t1 = thread::spawn(move || {
        let _guard1 = lock1.lock().unwrap();
        thread::sleep(std::time::Duration::from_secs(1));
        let _guard2 = lock2_clone.lock().unwrap();
        println!("Thread 1 acquired lock1 and lock2.");
    });
    //ok: rust-concurrency-issues-and-data-races
    let t2 = thread::spawn(move || {
        let _guard1 = lock1_clone.lock().unwrap();
        thread::sleep(std::time::Duration::from_secs(1));
        let _guard2 = lock2.lock().unwrap();
        println!("Thread 2 acquired lock1 and lock2.");
});

    t1.join().unwrap();
    t2.join().unwrap();
}

fn compliant3() {
    let data = Arc::new(Mutex::new(vec![1, 2, 3]));
    let mut threads = Vec::new();

    for _ in 0..3 {
        let data_clone = Arc::clone(&data);
         //ok: rust-concurrency-issues-and-data-races
        let thread = thread::spawn(move || {
            let mut data_guard = data_clone.lock().unwrap();
        });
        threads.push(thread);
    }

    for thread in threads {
        thread.join().unwrap();
    }

    println!("Modified data: {:?}", data.lock().unwrap());
}

#[test]
fn compliant4() {
    let (tx, rx) = mpsc::channel();
    //ok: rust-concurrency-issues-and-data-races
    thread::spawn(move || {
        let val = String::from("42");
        tx.send(val).unwrap();  
    });
    let received = rx.recv().unwrap();
    println!("*** Rx: Got: {}", received);  
}

fn compliant5() {
    let numbers: Vec<_> = (0..100u32).collect();
    let shared_numbers = Arc::new(numbers);
    let mut joinhandles = Vec::new();

    for offset in 0..8 {
        let child_numbers = Arc::clone(&shared_numbers);
        //ok: rust-concurrency-issues-and-data-races
        joinhandles.push(thread::spawn(move || {
            let sum: u32 = child_numbers.iter().filter(|n| *n % 8 == offset).sum();
            println!("Sum of offset {} is {}", offset, sum);
        }));
    }
    for handle in joinhandles.into_iter() {
        handle.join().unwrap();
    }
}

fn main(){}
