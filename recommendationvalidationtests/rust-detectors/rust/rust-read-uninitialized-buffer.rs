use std::io::{self, Cursor, Error, Read};
use std::fs::File;
use std::io::BufRead;

fn non_compliant1(file_path: &str, buffer: &mut Vec<u8>) -> io::Result<()>{
    let mut file = File::open(file_path)?;
    // ruleid: rust-read-uninitialized-buffer
    file.read_to_end(buffer)?;
    Ok(())
}

fn noncompliant2(file_path: &str, buffer: &mut Vec<u8>) -> io::Result<()>{
    let mut file = File::open(file_path)?;
    let mut small_buffer = vec![0; 10]; 
    // ruleid: rust-read-uninitialized-buffer
    file.read_to_end(&mut small_buffer)?; 
    buffer.extend_from_slice(&small_buffer); 
    Ok(())
}

fn noncompliant3() {
    let mut cursor = Cursor::new(Vec::new());
    let  _buffer = [0u8; 10];
    // ruleid: rust-read-uninitialized-buffer
    let _ = cursor.fill_buf(); 
}

fn noncompliant4() {
    let mut cursor = Cursor::new(Vec::new());
    let _buffer: [u8; 10]; // Uninitialized buffer
    // ruleid: rust-read-uninitialized-buffer
    let _ = cursor.fill_buf().unwrap(); 
}

fn noncompliant5() {
    let mut cursor = Cursor::new(Vec::new());
    let _buffer: [u8; 10]; // Uninitialized buffer
    // ruleid: rust-read-uninitialized-buffer
    let _ = cursor.fill_buf(); 
}

fn compliant1(file_path: &str, buffer: &mut Vec<u8>) -> io::Result<()>{
    let mut file = File::open(file_path)?;
    let file_size = file.metadata()?.len() as usize;
    buffer.reserve(file_size); 
    // ok: rust-read-uninitialized-buffer
    file.read_to_end(buffer)?; 
    Ok(())
}

fn compliant2(file_path: &str, buffer: &mut Vec<u8>, max_size: usize) -> io::Result<()>{
    let mut file = File::open(file_path)?;
    let mut temp_buffer = Vec::with_capacity(max_size);
    // ok: rust-read-uninitialized-buffer
    file.read_to_end(&mut temp_buffer)?; 
    if temp_buffer.len() > max_size {
    return Err(io::Error::new(io::ErrorKind::InvalidInput, "File size exceeds max allowed size"));
    }
    buffer.extend_from_slice(&temp_buffer); 
    Ok(())
}

fn compliant3(file_path: &str, buffer: &mut Vec<u8>, max_size: usize) -> io::Result<()>{
    let file = File::open(file_path)?;
    let mut temp_buffer = Vec::with_capacity(max_size);
    // ok: rust-read-uninitialized-buffer
    file.take(max_size as u64).read_to_end(&mut temp_buffer)?; 
    buffer.extend_from_slice(&temp_buffer); 
    Ok(())    
}

struct Mmap(Vec<u8>); 

impl Mmap {
    #[inline]

pub unsafe fn map(mut file: File) -> io::Result<Self> {
    use std::io::Read;
    let mut data = Vec::new();
    // ok: rust-read-uninitialized-buffer
    file.read_to_end(&mut data)?;
    Ok(Mmap(data))
    }
}

fn compliant_error_handling_fill_buf() -> Result<(), Error> {
    let mut cursor = Cursor::new(Vec::new());
    let mut buffer = [0u8; 10]; 

    let bytes_read = cursor.read(&mut buffer)?;
 // ok: rust-read-uninitialized-buffer
    cursor.consume(bytes_read);

    Ok(())
}

fn compliant_safe_traits_usage_fill_buf() -> Result<(), Error> {
    let mut cursor = Cursor::new(Vec::new());
    let mut buffer = String::new(); 
 // ok: rust-read-uninitialized-buffer
    cursor.read_line(&mut buffer)?;

    Ok(())
}

fn read_buf(&mut self, mut cursor: BorrowedCursor<'_>) -> io::Result<()> {
    
        if self.buf.pos() == self.buf.filled() && cursor.capacity() >= self.capacity() {
            self.discard_buffer();
            return self.inner.read_buf(cursor);
        }
        let prev = cursor.written();
        // ok: rust-read-uninitialized-buffer
        let mut rem = self.fill_buf()?;
        rem.read_buf(cursor.reborrow())?;
        self.consume(cursor.written() - prev); 
        Ok(())
}

fn main() {

}
