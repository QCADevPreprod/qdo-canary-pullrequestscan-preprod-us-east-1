
#include <iostream>
#include <cstdlib>
#include <cstdio>
#include <string>
#include <cstring>
#include <unistd.h>
#define CROW_MAIN

using namespace std;

int nonCompliant1() {
  std::string filename;
  std::cout << "Enter a filename: ";
  std::cin >> filename;
  std::string command = "ls " + filename;
  // Non-Compliant: Untrusted user input passed into `system` methods.
  // ruleid: cpp-os-command-injection
  system(filename.c_str());
  return 0;
}

int nonCompliant2() {
  std::string user_input_value = "file.txt";
  std::string command = "cat " + user_input_value;
  // Non-Compliant: Untrusted user input passed into `system` methods.
  // ruleid: cpp-os-command-injection
  system(command.c_str());
  return 0;
}

int nonCompliant3() {
  std::string userInput;
  std::cin >> userInput;
  char cmd[100];
  sprintf(cmd, "grep '%s' file.txt", userInput.c_str());
  // Non-Compliant: Untrusted user input passed into `system` methods.
  // ruleid: cpp-os-command-injection
  system(cmd);
  return 0;
}

int nonCompliant4() {
  std::string user_input_value;
  std::cin >> user_input_value;
  // Non-Compliant: Untrusted user input passed into `execl` methods.
  // ruleid: cpp-os-command-injection
  execl("/bin/sh", "sh", "-c", user_input_value.c_str(), NULL);
  return 1;
}

int nonCompliant5() {
  std::string user_input_value;
  std::cin >> user_input_value;
  // Non-Compliant: Untrusted user input passed into `popen` methods.
  // ruleid: cpp-os-command-injection
  FILE* fp = popen(user_input_value.c_str(), "r");
  pclose(fp);
  return 0;
}

int nonCompliant6() {
   crow::SimpleApp app;

   CROW_ROUTE(app, "/download/<path>")
       ([](const crow::request& req, crow::response& res, const std::string& filePath) {
           if (res.code = 200) {
           // Non-Compliant: Untrusted user input passed into `execl` methods.
           // ruleid: cpp-os-command-injection
               system(res.cmd);
           } else {
               res.code = 400;
               res.write("Bad Request: Invalid file path");
               res.end();
           }
       });

   app.port(8080).multithreaded().run();
   return 0;
}

std::string getUserInput() {
  std::string input;
  std::cin >> input;
  return input;
}


bool isValid(const std::string& input) {
    // Implement here ...
    return true;
}

int nonCompliant7() {
    m_launchAgentInstallFile = "file.txt";
    std::string cmd = "/bin/launchctl load ";
    cmd += m_launchAgentInstallFile;

    // ruleid: cpp-os-command-injection
    system(cmd.c_str());

    return 0;
}

int compliant1() {
    std::string filename;
    std::cout << "Enter a filename: ";
    std::cin >> filename;

    if (isValid(filename)) {
        std::string command = "ls " + filename;
        // ok: cpp-os-command-injection
        system(command.c_str());
    }

    return 0;
}

int compliant2() {
    pid_t pid = fork();
    if (pid == 0) {
        // Child process
        char* args[] = {"ls", "-l", nullptr};
        // ok: cpp-os-command-injection
        execvp("ls", args);
    } else if (pid > 0) {
        // Parent process
        waitpid(pid, nullptr, 0);
    }
    return 0;
}

std::string sanitize(const std::string& input) {
    // Implement proper sanitization logic
    return input;
}

int compliant3() {
    std::string filename;
    std::cout << "Enter a filename: ";
    std::cin >> filename;

    std::string command = "ls " + sanitize(filename);
    // ok: cpp-os-command-injection
    system(command.c_str());

    return 0;
}

int compliant3() {
    std::string filename;
    std::cout << "Enter a filename: ";
    std::cin >> filename;

    std::string command = sanitize(filename);
    // ok: cpp-os-command-injection
    system(command.c_str());

    return 0;
}

int compliant4() {
    std::string file_input = "file.txt";
    std::string command = "cat " + file_input;
    // ok: cpp-os-command-injection
    FILE* fp = popen(command, "r");
    if (fp) {
        // Process the file pointer (fp) safely
        pclose(fp);
    }
    return 0;
}

int compliant5() {
    char* args[] = {"ls", "-l", nullptr};
    // ok: cpp-os-command-injection
    execvp("ls", args);
    return 0;
}

int compliant6() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/download/<path>")
        ([](const crow::request& req, crow::response& res, const std::string& filePath) {
            if (res.code = 200) {
            // ok: cpp-os-command-injection
                system("ls -l");
            } else {
                res.code = 400;
                res.write("Bad Request: Invalid file path");
                res.end();
            }
        });

    app.port(8080).multithreaded().run();
    return 0;
}

int compliant7() {
    m_launchAgentInstallFile = getenv("HOME");
    std::string cmd = "/bin/launchctl load ";
    cmd += m_launchAgentInstallFile;

    // ok: cpp-os-command-injection
    system(cmd.c_str());

    return 0;
}

int main()
{
    cout<<"Hello World";

    return 0;
}
