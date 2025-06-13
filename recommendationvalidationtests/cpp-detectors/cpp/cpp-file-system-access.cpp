

#include <iostream>
#include <fstream>
#include <thread>
#include <mutex>
#include <unistd.h>
#include <fcntl.h>
#include <shared_mutex>
#include <atomic>
#include <cstdio>
#include <cstdlib>
#include <unistd.h>
#include <cerrno>

std::mutex mtx;
std::atomic_flag lock = ATOMIC_FLAG_INIT;

// Non-Compliant1: Simultaneous read and write without synchronization
void nonCompliant1(const std::string &filename)
{
    std::ifstream fileIn(filename);
    std::string data;
    fileIn >> data;
    std::ofstream fileOut(filename, std::ios::app);
    // Simultaneous read and write without proper synchronization
    // ruleid: cpp-file-system-access
    fileOut << "New data appended: " << data << std::endl;
    fileOut.close();
    fileIn.close();
}

// Non-Compliant2: Shared file descriptor leads to race condition
void nonCompliant2(const std::string &filename, const std::string &content)
{
    // shared file descriptor leads to race condition
    int fd = open(filename.c_str(), O_WRONLY | O_APPEND); // Open file for writing (shared file descriptor)
    // Write content to the file using the shared file descriptor
    // ruleid: cpp-file-system-access
    write(fd, content.c_str(), content.size());
    close(fd); // Close the file descriptor
}

// Non-Compliant Test Case 3 (No Locking Mechanism)
// Mutexes are meant for synchronizing access to shared resources within a single process and aren't designed for file locking across different processes or threads.

void nonCompliant3(const std::string &filename, const std::string &content)
{
    mtx.lock(); // Acquire the mutex lock (not suitable for file locking)
    std::ofstream file(filename, std::ios::app);
    // ruleid: cpp-file-system-access
    file << content << std::endl;
    file.close();
    mtx.unlock(); // Release the mutex lock
}

// Declaration or definition of the operate function
void operate(FILE *file)
{
    // Your code to perform operations on the file
    // For example:
    fprintf(file, "Hello, file!\n");
}

void nonCompliant4(const char *file)
{
    if (!access(file, W_OK))
    {
        // ruleid: cpp-file-system-access
        FILE *f = fopen(file, "w+");
        operate(f);
    }
    else
    {
        fprintf(stderr, "Unable to open file %s.\n", file);
    }
}

// Compliant1: Using std::unique_lock for synchronization
void Compliant1(const std::string &filename, const std::string &content)
{
    // Using std::unique_lock for synchronization
    //ok:cpp-file-system-access
    std::unique_lock<std::mutex> lock(mtx);
    std::ofstream file(filename, std::ios::app);
    file << content << std::endl;
    file.close();
}

// Compliant Test Case 2 (Using File Locks):
void Compliant2(const std::string &filename, const std::string &content)
{
    int fd = open(filename.c_str(), O_WRONLY | O_APPEND);
    struct flock fl;
    // flock(fd, LOCK_EX); // Acquire an exclusive lock on the file
    // ok:cpp-file-system-access
    fcntl(fd, F_SETLKW, &fl); // Acquire an exclusive lock on the file
    write(fd, content.c_str(), content.size());
    fcntl(fd, F_SETLK, &fl); // Unlock the file
    close(fd);
}

// Compliant Test Case 3 (Using std::shared_mutex)
std::shared_mutex tx;

void Compliant3(const std::string &filename, const std::string &content)
{
    // ok:cpp-file-system-access
    std::unique_lock<std::shared_mutex> lock(tx); // Obtain unique lock for write access
    std::ofstream file(filename, std::ios::app);
    file << content << std::endl;
    file.close();
    // The lock is automatically released when 'lock' goes out of scope
}

// Compliant function with proper error handling
void compliant4(const char *file)
{
    FILE *f = fopen(file, "a"); // Open the file in append mode
    if (f != nullptr)
    {
        operate(f); // Perform operations on the file using the operate function
        fclose(f);  // Close the file
    }
    else
    {
        perror("Unable to open file"); // Print error message based on errno
        // Handle the error, e.g., return or exit the function
    }
}

int main()
{
    // Write C++ code here
    std::cout << "Hello world!";

    std::thread t1(nonCompliant1, "file.txt");
    std::thread t2(nonCompliant1, "file.txt");
    t1.join();
    t2.join();

    std::thread t3(Compliant1, "file.txt");
    std::thread t4(Compliant1, "file.txt");
    t3.join();
    t4.join();

    // Declare the filename before using it
    std::string filename = "file.txt";

    std::thread t5(nonCompliant2, filename, "Data from Thread 1\n");
    std::thread t6(nonCompliant2, filename, "Data from Thread 2\n");

    t5.join();
    t6.join();

    std::thread t7(Compliant2, "file.txt", "Data from Thread 1\n");
    std::thread t8(Compliant2, "file.txt", "Data from Thread 2\n");

    t7.join();
    t8.join();

    std::thread t9(nonCompliant3, "file.txt", "Data from Thread 1");
    std::thread t10(nonCompliant3, "file.txt", "Data from Thread 2");

    t9.join();
    t10.join();

    std::thread t11(Compliant3, "file.txt", "Data from Thread 1");
    std::thread t12(Compliant3, "file.txt", "Data from Thread 2");

    t11.join();
    t12.join();

    return 0;
}

 void handle_accept(const asio::error_code& ec)
  {
    if (!ec)
    {
      io_context_.notify_fork(asio::io_context::fork_prepare);
    }
    else
    {
         //ok:cpp-file-system-access
      std::cerr << "Accept error: " << ec.message() << std::endl;
      start_accept();
    }
  }

  static std::string verify_remoteproc_dir(const std::string &remoteproc_id)
{
    const std::string remoteproc_dir("/sys/kernel/debug/remoteproc/remoteproc" + remoteproc_id);

    std::int32_t dir_fd;
    std::error_code error = os::open(dir_fd, remoteproc_dir, { os::open_as::Directory, os::open_as::ReadOnly });

    if (error) {
              //ok:cpp-file-system-access
        std::cerr << "Error: `" << remoteproc_dir << "` " << error.message() << std::endl;
        return {};
    } else {
        os::close(dir_fd);
        return remoteproc_dir;
    }
}