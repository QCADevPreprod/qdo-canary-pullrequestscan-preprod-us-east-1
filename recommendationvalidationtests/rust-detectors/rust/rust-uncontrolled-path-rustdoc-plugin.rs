use std::process::Command;


fn non_compliant_relative_path() {
    // ruleid: rust-uncontrolled-path-rustdoc-plugin
    let output = Command::new("external_utility")
        .arg("documentation_file")
        .output()
        .expect("Failed to execute external utility");
    println!("Documentation processed successfully: {:?}", output);
}


fn compliant_explicit_plugin_path() {
    // ok: rust-uncontrolled-path-rustdoc-plugin
    let output = Command::new("rustdoc")
        .arg("--plugin")
        .arg("my_plugin")
        .arg("--plugin-path")
        .arg("/path/to/plugins")
        .output()
        .expect("Failed to execute rustdoc with plugin");
    println!("Documentation processed successfully: {:?}", output);
}




fn non_compliant_user_controlled_plugin_path(plugin_name: &str) {
    // ruleid: rust-uncontrolled-path-rustdoc-plugin
    let output = Command::new("rustdoc")
        .arg("--plugin")
        .arg(plugin_name)
        .output()
        .expect("Failed to execute rustdoc with plugin");
    println!("Documentation processed successfully: {:?}", output);
}


fn compliant_panic_safe_plugin_path_handling() {
     // ok: rust-uncontrolled-path-rustdoc-plugin
    let output = Command::new("rustdoc")
        .arg("--plugin")
        .arg("my_plugin")
        .arg("--plugin-path")
        .arg(std::env::current_exe().unwrap().parent().unwrap())
        .output()
        .expect("Failed to execute rustdoc with plugin");
    println!("Documentation processed successfully: {:?}", output);
}





fn non_compliant_insecure_env_variable() {
    // ruleid: rust-uncontrolled-path-rustdoc-plugin
    let output = Command::new(std::env::var("EXTERNAL_UTILITY").unwrap_or("external_utility".to_string()))
        .arg("documentation_file")
        .output()
        .expect("Failed to execute external utility");
    println!("Documentation processed successfully: {:?}", output);
}


fn compliant_least_privilege_principle() {
    // ok: rust-uncontrolled-path-rustdoc-plugin
    let output = Command::new("rustdoc")
        .arg("--plugin")
        .arg("my_plugin")
        .output()
        .expect("Failed to execute rustdoc with plugin");
    println!("Documentation processed successfully: {:?}", output);
}



fn main() {
    println!("Try programiz.pro");
}
