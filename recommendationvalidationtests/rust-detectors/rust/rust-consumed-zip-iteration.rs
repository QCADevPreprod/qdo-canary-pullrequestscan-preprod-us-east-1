
fn non_conformant_zip_buffer_overflow() {
    let vec1 = vec![1, 2, 3];
    let vec2 = vec![4, 5, 6];

    let zipped = vec1.iter().zip(vec2.iter());
    let zipped_vec: Vec<_> = zipped.collect();
    // ruleid: rust-consumed-zip-iteration
    let _ = zipped.collect::<Vec<_>>();
     
}


fn compliant_use_collected_vector() {
    let vec1 = vec![1, 2, 3];
    let vec2 = vec![4, 5, 6];

    let zipped = vec1.iter().zip(vec2.iter());
    let zipped_vec: Vec<_> = zipped.collect(); 
    // ok: rust-consumed-zip-iteration 
    let _ = zipped_vec.iter().collect::<Vec<_>>();
}



fn non_compliant_use_consumed_iterator() {
    let vec1 = vec![1, 2, 3];
    let vec2 = vec![4, 5, 6];

    let zipped = vec1.iter().zip(vec2.iter());
    let _ = zipped.collect::<Vec<_>>(); 
     // ruleid: rust-consumed-zip-iteration 
    let _ = zipped.next();
}


fn compliant_handle_iterator_lifetimes() {
    let vec1 = vec![1, 2, 3];
    let vec2 = vec![4, 5, 6];

    let zipped = vec1.iter().zip(vec2.iter());
    {
        let _ = zipped.collect::<Vec<_>>(); 
    }
        // ok: rust-consumed-zip-iteration
    let _ = vec1.iter().collect::<Vec<_>>();
    let _ = vec2.iter().collect::<Vec<_>>(); 
}



fn non_compliant_ignore_consumed_status() {
    let vec1 = vec![1, 2, 3];
    let vec2 = vec![4, 5, 6];

    let mut zipped = vec1.iter().zip(vec2.iter());
    let _ = zipped.collect::<Vec<_>>(); 
    // ruleid: rust-consumed-zip-iteration 
    let _ = zipped.size_hint();
}



fn compliant_reinitialize_iterators() {
    let vec1 = vec![1, 2, 3];
    let vec2 = vec![4, 5, 6];

    let mut zipped = vec1.iter().zip(vec2.iter());
    let _ = zipped.collect::<Vec<_>>(); 
     // ok: rust-consumed-zip-iteration
    let mut zipped = vec1.iter().zip(vec2.iter());
    let _ = zipped.collect::<Vec<_>>();
}



fn non_compliant_misuse_iterator_reference() {
    let vec1 = vec![1, 2, 3];
    let vec2 = vec![4, 5, 6];

    let zipped = vec1.iter().zip(vec2.iter());
    let _ = zipped.collect::<Vec<_>>(); 
    // ruleid: rust-consumed-zip-iteration 
    let ref_zip = &zipped;
    let _ = ref_zip.collect::<Vec<_>>();
}



fn compliant_avoid_direct_iterator_reuse() {
    let vec1 = vec![1, 2, 3];
    let vec2 = vec![4, 5, 6];

    let zipped = vec1.iter().zip(vec2.iter());
    let _ = zipped.collect::<Vec<_>>(); 
    // ok: rust-consumed-zip-iteration
    let _ = vec1.iter().zip(vec2.iter()).collect::<Vec<_>>();
}



fn main() {
    println!("Try programiz.pro");
}
