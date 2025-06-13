#include <stdio.h>
#include<iostream>
#include <string.h>
#include <cstdarg>
#include <stdlib.h>

#define BUFSIZE 256
#define FMT "whatever"


void noncompliant1(char *string, int number)
    {
        char buf[BUFSIZE];

        // ruleid: cpp-insecure-api-sprintf-vsprintf
        sprintf(buf, "string: %s\n", string);

    }



void noncompliant2(char *string, int number)
{
    char buf[BUFSIZE];

    //it uses sprintf without specifying the maximum buffer size.
    // ruleid: cpp-insecure-api-sprintf-vsprintf
    sprintf(buf, "%s", string);  // Non-compliant: No buffer size specified

}



void noncompliant3(char *string, int number)
    {
char buf[BUFSIZE];
char fmt[] = "whatever";

// ruleid: cpp-insecure-api-sprintf-vsprintf
sprintf(buf, fmt, string);

    }


void noncompliant4(char *string, int number)
{
   char buf[BUFSIZE];

// ruleid: cpp-insecure-api-sprintf-vsprintf
sprintf(buf, string);

}



void nonCompliant5() {
    char buffer[100];
    int value = 42;

    // Initialize a va_list object
    va_list args;
    // The subsequent arguments should match the format specifiers in the format string
    // ruleid:cpp-insecure-api-sprintf-vsprintf
    vsprintf(buffer, "%d", args);
}




void nonCompliant6(const char* input) {
    char buffer[100];
    //Using vsprintf with user input without validation:
    // ruleid:cpp-insecure-api-sprintf-vsprintf
    vsprintf(buffer, input, 0); // Pass additional argument(s) to match the format specifier
}




void nonCompliant7() {
    char* buffer = new char[100];
    int value = 42;

    // Initialize a va_list object
    va_list args;
    // ruleid:cpp-insecure-api-sprintf-vsprintf
    vsprintf(buffer, "%d", args);

    delete[] buffer;
}



void compliant1(char *string, int number)
    {
        char buf[BUFSIZE];

        // ok:cpp-insecure-api-sprintf-vsprintf
        snprintf(buf, BUFSIZE, "number: %d\n", number);

}




void compliant2(char *string, int number)
{
char buf[BUFSIZE];
//snprintf, which allows specifying the maximum buffer size. The snprintf function ensures that at most BUFSIZE - 1 characters are written to the buffer buf, leaving room for the null-terminator
// ok:cpp-insecure-api-sprintf-vsprintf
snprintf(buf, BUFSIZE, "%s", string);

}




void compliant3(char *string, int number)
{
    char buf[BUFSIZE];
    char fmt[] = "whatever";
    // {fact rule=insecure-buffer-access@v1.0 defects=0}
    // ok:cpp-insecure-api-sprintf-vsprintf
    snprintf(buf, BUFSIZE, fmt, string);
    // {/fact}
}



void compliant4(char *string, int number)
{
    char buf[BUFSIZE];

    // ok:cpp-insecure-api-sprintf-vsprintf
    snprintf(buf, BUFSIZE, "%s", string);

}





void compliant5() {
    char buffer[100];
    int value = 42;

    // Initialize a va_list object
    va_list args;
    // ok:cpp-insecure-api-sprintf-vsprintf
    vsnprintf(buffer, sizeof(buffer), "%d", args);

}





void compliant6(const char* input) {
    char buffer[100];
    // Initialize a va_list object
    va_list args;

    // ok:cpp-insecure-api-sprintf-vsprintf
    vsnprintf(buffer, sizeof(buffer), input, args);

}





void compliant7() {
    char* buffer = new char[100];
    int value = 42;
    // Using vsnprintf with dynamically allocated buffer:
    // ok:cpp-insecure-api-sprintf-vsprintf
    va_list args;
    vsnprintf(buffer, 100, "%d", args);
    delete[] buffer;
}





int main() {
    // Write C++ code here
    std::cout << "Hello world!";

    return 0;
}
