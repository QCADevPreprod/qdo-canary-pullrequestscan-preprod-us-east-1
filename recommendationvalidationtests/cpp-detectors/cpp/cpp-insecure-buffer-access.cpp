#include <stdio.h>
#include<cstring>
#include<time.h>
#include <iostream>

using namespace std;

#define BUFSIZE 256
#define SIZE(x, y) (sizeof(x))

#define BUFFER_SIZE (1024)


void noncompliant1(char *string)
{
    char buf[BUFSIZE];
    size_t length;

    // Noncompliant: The `snprintf()`functions return the total length of the string they tried to create.
    // ruleid: cpp-insecure-buffer-access
    length = snprintf(buf, BUFSIZE, "%s", string);

    // use length to access buf
}


void noncompliant2(char *username, char* password)
{
    char buf[1024], *ptr;
    ptr = buf;
    // Noncompliant: The `snprintf()` functions return the total length of the string they tried to create.
    // ruleid: cpp-insecure-buffer-access
    ptr += snprintf(ptr, SIZE(buf, ptr), "user: %s\n", username);

    // Noncompliant: The `snprintf()` functions return the total length of the string they tried to create.
    // ruleid: cpp-insecure-buffer-access
    ptr += snprintf(ptr, SIZE(buf, ptr), "pass: %s\n", password);
}

void va_start(va_list ap, char* fmt){
    // do something
}

void va_end(va_list ap){
    //do something
}

void write_log(int fd, char* buffer, int len){
    //do something
}

int noncompliant3(int fd, char *fmt, ...)
{
    char buffer[BUFSIZE];
    int n;
    va_list ap;

    va_start(ap, fmt);
    // Noncompliant: The `vsnprintf()` functions return the total length of the string they tried to create.
    // ruleid: cpp-insecure-buffer-access
    n = vsnprintf(buffer, sizeof(buffer), fmt, ap);

    if (n >= BUFSIZE - 2)
        buffer[sizeof(buffer) - 2] = '\0';

    strcat(buffer, "\n");

    va_end(ap);

    write_log(fd, buffer, strlen(buffer));

    return 0;
}

void noncompliant4() {
    const char* prepend = "Prefix";
    const char* append = "Suffix";
    char buf[20] = "Initial";

    // Non-compliant: Potential buffer overflow vulnerability
    // ruleid: cpp-insecure-buffer-access
    sprintf(buf, "%s:%s:%s", prepend, buf, append);

}

void noncompliant5() {
    const char* prepend = "Prefix";
    const char* append = "Suffix";
    char buf[20] = "Initial";

    // Non-compliant: Potential buffer overflow vulnerability
    // ruleid: cpp-insecure-buffer-access
    snprintf(buf, sizeof(buf), "%s:%s:%s", prepend, buf, append);

}


int snprintf_s(char *buffer, size_t buf_size, const char *format, ...) {
    va_list args;
    int length = buf_size;
    if (length < 0 || (size_t)length >= buf_size) {
        // Handle error or truncate
        length = -1; // Indicate failure
    }
    return length;
}


int vsnprintf_s(char *buffer, size_t buf_size, const char *format, ...) {
    va_list args;
    int length = buf_size;
    if (length < 0 || (size_t)length >= buf_size) {
        // Handle error or truncate
        length = -1; // Indicate failure
    }
    return length;
}
void compliant1(char *string)
{
    char buf[BUFSIZE];
    size_t length;
    //Compliant: `snprintf_s` ensures that the formatted string is no longer than the size of the buffer minus one (for the null terminator).
    // ok: cpp-insecure-buffer-access
    length = snprintf_s(buf, BUFSIZE, "%s", string);

    // use length to access buf
}

void compliant2(char *username, char* password)
{
    char buf[1024], *ptr;
    ptr = buf;
    // ok: cpp-insecure-buffer-access
    ptr += snprintf_s(ptr, SIZE(buf, ptr), "user: %s\n", username);
    //Compliant: `snprintf_s` ensures that the formatted string is no longer than the size of the buffer minus one (for the null terminator).
    // ok: cpp-insecure-buffer-access
    ptr += snprintf_s(ptr, SIZE(buf, ptr), "pass: %s\n", password);
}

int compliant3(int fd, char *fmt, ...)
{
    char buffer[BUFSIZE];
    int n;
    va_list ap;

    va_start(ap, fmt);

    //Compliant: `vsnprintf_s` ensures that the formatted string is no longer than the size of the buffer minus one (for the null terminator).
    // ok: cpp-insecure-buffer-access
    n = vsnprintf_s(buffer, sizeof(buffer), fmt, ap);

    if (n >= BUFSIZE - 2)
        buffer[sizeof(buffer) - 2] = '\0';

    strcat(buffer, "\n");

    va_end(ap);

    write_log(fd, buffer, strlen(buffer));

    return 0;
}

void compliant4() {
    const char* prepend = "Prefix";
    const char* append = "Suffix";
    char buf[40];

    if (sizeof(buf) >= snprintf(nullptr, 0, "%s:%s:%s", prepend, buf, append) + 1) {
        // Compliant: Safe usage of snprintf to prevent buffer overflow
        // ok: cpp-insecure-buffer-access
        snprintf(buf, sizeof(buf), "%s:%s:%s", prepend, buf, append);
    }

}

void gets(char* buffer){
    //something
}
#define BUFFERSIZE (1024)

void echo_bad() {
    char buffer[BUFFERSIZE];
    // ruleid: cpp-insecure-buffer-access
    gets(buffer);
    printf("Input was: '%s'\n", buffer);
}

void echo_good() {
    char buffer[BUFFERSIZE];
    // ok: cpp-insecure-buffer-access
    fgets(buffer, BUFFERSIZE, stdin);
    printf("Input was: '%s'\n", buffer);
}

int is_morning_bad() {
    const time_t now_seconds = time(NULL);
    // ruleid: cpp-insecure-buffer-access
    struct tm *now = gmtime(&now_seconds);
    return (now->tm_hour < 12);
}

int is_morning_good() {
    const time_t now_seconds = time(NULL);
    struct tm now;
    // ok: cpp-insecure-buffer-access
    gmtime_r(&now_seconds, &now);
    return (now.tm_hour < 12);
}

void bad() {
    char buffer[BUFFER_SIZE];
    // BAD: Use of 'cin' without specifying the length of the input.
    // ruleid: cpp-insecure-buffer-access
    cin >> buffer;
    buffer[BUFFER_SIZE-1] = '\0';
}

void good() {
    char buffer[BUFFER_SIZE];
    // GOOD: Specifying the length of the input before using 'cin'.
    cin.width(BUFFER_SIZE);
    // ok: cpp-insecure-buffer-access
    cin >> buffer;
    buffer[BUFFER_SIZE-1] = '\0';
}

int main(){
    return 0;
}
