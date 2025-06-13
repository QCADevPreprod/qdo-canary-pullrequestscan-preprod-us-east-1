use std::process::Command;
use std::io;

fn noncompliant1() {
    println!("Enter a command:");
    let mut input = String::new();
    io::stdin().read_line(&mut input).expect("Failed to read input");
    //ruleid: rust-std-process-command
    let _output = Command::new("sh")
      .arg("-c")
      .arg(input.trim())
      .output()
      .expect("failed to execute process");
}

fn noncompliant2() {
    let user_input = std::env::args().nth(1).expect("No argument provided");
    //ruleid: rust-std-process-command
    let _output = std::process::Command::new("echo")
      .arg(user_input)
      .output()
      .expect("failed to execute process");
}

fn noncompliant4() {
    println!("Enter the command:");
    let mut command = String::new();
    io::stdin().read_line(&mut command).expect("Failed to read command");
    //ruleid: rust-std-process-command
    let _output = Command::new("sh")
        .args(["-c", &command])
        .output()
        .map_err(|e| format!("Failed to execute process: {}", e));
}

fn compliant1() {
    let source_dso = "/path/to/source_dso";
    let target_dso = "/path/to/target_dso";
    //ok: rust-std-process-command
    let _symlink = Command::new("ln")
        .args(&["-s", "-f", source_dso, target_dso])
        .output()
        .expect("failed to execute process");
}

fn compliant2() {
    //ok: rust-std-process-command
    let _output = Command::new("ls")
        .arg("-l")
        .output()
        .expect("failed to execute process");
}

fn compliant3() {
    //ok: rust-std-process-command
    let _output = Command::new("/bin/sh")
        .arg("-c")
        .arg("echo Hello, world!")
        .output()
        .expect("failed to execute process");
}

fn compliant4(index: &str, command: &str) -> bool {
    //ok: rust-std-process-command
    let status = Command::new("git")
        .current_dir(index)
        .args(command.split_whitespace())
        .status()
        .expect("Failed to execute git command");
    status.success()
}

fn main(){}
