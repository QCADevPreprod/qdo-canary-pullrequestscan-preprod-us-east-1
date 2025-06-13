

#include <stdio.h>
#include <string.h>
#include <cstdlib>
#include <stdint.h>
#include <iostream>
#include <vector>
#include <set>

#define BUFSIZE 256

void noncompliant1()
{
    int id_sequence[3];

    id_sequence[0] = 123;
    id_sequence[1] = 234;
    id_sequence[2] = 345;
    // Attempting to access index 3 out of bound
    //  ruleid: cpp-off-by-one
    id_sequence[3] = 456;
}

void noncompliant2(uint8_t *s, size_t sz)
{
    uint8_t buf[1024];
    memset(buf, 0x0, sizeof(buf));
    memcpy(buf, s, sizeof(buf));
    // sizeof(buf) returns the size of the array in bytes, not the index of the last element
    // the assignment is actually writing outside the bounds of the buf array,
    //  ruleid: cpp-off-by-one
    buf[sizeof(buf)] = '\0';
}

void die(const char *message)
{
    std::cerr << message << std::endl;
    exit(EXIT_FAILURE);
}

void noncompliant3(char *user)
{
    char buf[1024];
    // the comparison is incorrect and may lead to a buffer overflow
    //  ruleid: cpp-off-by-one
    if (strlen(user) > sizeof(buf))
        die("error: user string too long\n");

    strcpy(buf, user);
}

int noncompliant4(int argc, char *argv[])
{
    char buf[10];

    // ruleid: cpp-off-by-one
    *(buf + 10) = 'A';

    return 0;
}

int noncompliant5(int argc, char *argv[])
{
    char bStr[10];
    // accessing elements outside the bounds of the array bStr, causing undefined behavior.
    // ruleid: cpp-off-by-one
    for (unsigned i = 1; i <= 10; ++i)
    {
        bStr[i] = (char)i + 'a';
    }
    return 0;
}

struct LabelText
{
    int count;
};

void noncompliant6(struct line *whichLine, char *data)
{

    struct line *temp = (struct line *)(uintptr_t)whichLine->next;
    struct line *newLine = (struct line *)malloc(sizeof(struct line));
    temp->prev = newLine;
    whichLine->next = newLine;
    newLine->next = temp;
    newLine->prev = whichLine;
    // ruleid: cpp-off-by-one
    newLine->data = (char *)malloc(strlen(data));
    strcpy(newLine->data, data);
    newLine->length = strlen(data);
    countTabs(newLine);
    currentBuffer->numLines++;
}

void noncompliant7(const char *input)
{
    char *copy;
    // strcpy expects space for the null terminator.
    // strlen function returns the length of the input string excluding the null terminator.
    //  ruleid: cpp-off-by-one
    copy = (char *)malloc(strlen(input));
    strcpy(copy, input);
}

void noncompliant8(int argc, char *argv[])
{

    char buffer[1][256];
    // code attempts to access buffer[0][256], which is the 257th element in a 256-element array.
    //  ruleid: cpp-off-by-one
    buffer[0][256] = '!';
}

void nonCompliant9()
{
    // Incorrect loop boundary causing off-by-one error:
    //  ruleid: cpp-off-by-one
    for (int i = 0; i < 10; ++i)
    { // Off-by-one error
        std::cout << i << " ";
    }
}

void noncompliant10(char *string)
{
    char firstname[20];
    char lastname[20];
    char fullname[40];

    fullname[0] = '\0';

    // ruleid: cpp-off-by-one
    strncat(fullname, firstname, 40);
}

void nonCompliant11()
{
    int arr[5] = {1, 2, 3, 4, 5};
    // ruleid: cpp-off-by-one
    for (int i = 0; i <= 5; ++i)
    { // Off-by-one error
        std::cout << arr[i] << " ";
    }
}

static LabelText *noncompliant12(char *orig_str, int char_width)
{
    int i, j;
    char line[256]; /* a line should not exceed this length */
    int pos;
    int last_space;
    int new_line;
    LabelText *text = 0;
    char *str = 0;
    text = (LabelText *)calloc(1, sizeof(LabelText));

    str = strdup(orig_str);
    if (char_width > 0)
    {
        for (i = 0; i < strlen(str); i++)
            if (str[i] == 10)
                text->count++;

        // ruleid: cpp-off-by-one
        if (str[strlen(str) - 1] != 10)
            text->count++;
    }

    return NULL;
}

void *malloc(unsigned int) {

    }

    unsigned int get_size() {

    }

    void write_data(const unsigned char*, const unsigned char*) {

    }

     unsigned size = get_size();

    int noncompliant(int argc, char* argv[])
      {

        unsigned char *begin = (unsigned char*)malloc(size);
        if(!begin) return -1;

        unsigned char* end = begin + size;

        write_data(begin, end);
         // ruleid: cpp-off-by-one
        *end = '\0'; // BAD: Out-of-bounds write

      }


      int compliant(int argc, char* argv[])
      {

        unsigned char *begin = (unsigned char*)malloc(size);
        if(!begin) return -1;

        unsigned char* end = begin + size;
        write_data(begin, end);
        // ok: cpp-off-by-one
        *(end - 1) = '\0'; // GOOD: writing to the last byte

      }



void compliant1()
{
    // ok: cpp-off-by-one
    int id_sequence[4]; // Increase array size to accommodate the additional element

    id_sequence[0] = 123;
    id_sequence[1] = 234;
    id_sequence[2] = 345;
    id_sequence[3] = 456; // This is now a valid index within the bounds of the array
}

void compliant2(uint8_t *s, size_t sz)
{
    uint8_t buf[1024];
    memset(buf, 0x0, sizeof(buf));
    memcpy(buf, s, sz); // Corrected to use the actual size 'sz' instead of 'sizeof(buf)'
    // ok: cpp-off-by-one
    buf[sz - 1] = '\0'; // Null-terminate at the correct index
}

void compliant3(char *user)
{
    char buf[1024];
    // ok: cpp-off-by-one
    if (strlen(user) >= sizeof(buf)) // Corrected comparison
        die("error: user string too long\n");

    strcpy(buf, user);
}

int compliant4(int argc, char *argv[])
{
    char buf[10];
    // ok: cpp-off-by-one
    buf[9] = 'A'; // Access the 10th element of buf

    return 0;
}

int compliant5(int argc, char *argv[])
{
    char bStr[10];
    // Adjust loop bounds to iterate from 0 to 9
    // ok: cpp-off-by-one
    for (unsigned i = 0; i < 10; ++i)
    {
        bStr[i] = static_cast<char>(i) + 'a';
    }
    return 0;
}

struct line
{
    struct line *next;
    struct line *prev;
    char *data;
    int length;
};

void countTabs(struct line *line)
{
    // code
}
struct buffer
{
    int numLines;
};

struct buffer *currentBuffer;

void compliant6(struct line *whichLine, char *data)
{
    struct line *temp = whichLine->next;
    struct line *newLine = (struct line *)malloc(sizeof(struct line));
    temp->prev = newLine;
    whichLine->next = newLine;
    newLine->next = temp;
    newLine->prev = whichLine;
    // ok: cpp-off-by-one
    newLine->data = (char *)malloc(strlen(data) + 1);
    strcpy(newLine->data, data);
    newLine->length = strlen(data);
    countTabs(newLine);
    currentBuffer->numLines++;
}

void compliant7(const char *input)
{
    char *copy;

    // Allocate memory for the input string and the null terminator
    // ok: cpp-off-by-one
    copy = (char *)malloc(strlen(input) + 1);
    strcpy(copy, input);
}

void compliant8(int argc, char *argv[])
{

    char buffer[1][256];
    // Accessing within bounds
    // ok: cpp-off-by-one
    buffer[0][255] = '!'; // Accessing the last element of the array
}

void compliant9()
{
    std::string str = "Hello";
    // ok: cpp-off-by-one
    for (int i = 0; i < str.length(); ++i)
    { // Proper loop termination condition
        std::cout << str[i] << " ";
    }
}

int main()
{
    // Write C++ code here
    std::cout << "Hello world!";

    return 0;
}
