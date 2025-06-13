#include <iostream>
#include <fstream>
#include <cstdio>
#include <string>
#include <limits>
#include <iomanip>
#include <cstdlib>
#include <cstring>

void noncompliant1()
{
    // User input without validation
    std::string userInput;
    std::cout << "Enter input: ";
    std::getline(std::cin, userInput);
    //ruleid:cpp-improper-input-validation
    std::cout << " input is: " << userInput << std::endl;
}

void noncompliant2()
{
    int Input;
    std::cin >> Input;
    // Partial validation: only checks if input is negative
    if (Input < 0)
    {
        //ruleid: cpp-improper-input-validation
        std::cout << " Negative input is: " << Input << std::endl;
    }
}

void noncompliant3()
{

    // Test Case 2: Lack of length check for string input
     const char* userInputEnv = std::getenv("Lack of length check for string input");// Accepts any length of input without validation
    std::cout << "Enter input: ";
    // Processing user input without validating length
    //ruleid:cpp-improper-input-validation
    std::cout << "Received input: " << userInputEnv << std::endl;
    // Unvalidated input length can lead to buffer overflows or other issues
}




void noncompliant4(char buffer[20], char* argv[] )
{
    // User input without buffer size validation
    std::cout << "Enter text: ";
    //ruleid:cpp-improper-input-validation
    std::cout << "Text is: " << argv[1] << std::endl;
}

void compliant1()
{
    // User input with validation and sanitation
    std::string userInput;
    std::cout << "Enter input: ";
    std::getline(std::cin, userInput);

    // Sanitize input by trimming leading and trailing whitespace
    userInput.erase(0, userInput.find_first_not_of(" \t\r\n"));
    userInput.erase(userInput.find_last_not_of(" \t\r\n") + 1);
    // ok:cpp-improper-input-validation
    std::cout << "Sanitized input is: " << userInput << std::endl;
}

int compliant2()
{

    int input;
    while (true)
    {
        std::cout << "Enter a valid number: ";
        if (std::cin >> input)
        {
            // Input validation function
            // ok:cpp-improper-input-validation
            if (input >= 0)
            {
                return input;
            }
        }
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Invalid input. Please try again." << std::endl;
    }
}

void compliant3()
{

    const char* userInputEnv = std::getenv("Lack of length check for string input");
    std::cout << "Enter your username: ";

    // ok:cpp-improper-input-validation
    if (userInputEnv != nullptr && std::strlen(userInputEnv) > 0 && std::strlen(userInputEnv) <= 20)
    {
        std::cout << "Valid username entered: " << userInputEnv << std::endl;
        // Process the valid username input further if needed
    }
    else
    {
        std::cout << "Invalid username entered. Please enter a username within 20 characters." << std::endl;
    }

    // Additional compliant test cases can be added with different data types, input formats, etc.
}

void compliant4(const char buffer[20], char* argv[]) {
    // User input with buffer size validation
    if (argv[1] != nullptr && std::strlen(argv[1]) <= 19) { // Validate input length
        std::cout << "Enter text: ";
        std::cout << "Text is: " << argv[1] << std::endl;
    } else {
        std::cout << "Invalid or too large input. Please enter text within 19 characters." << std::endl;
    }
}

void do_get(FILE* request, FILE* response) {
      char page[1024];
      //ruleid: cpp-improper-input-validation
      fgets(page, 1024, request);

      char buffer[1024];
      strcat(buffer, "The page \"");
      strcat(buffer, page);
      strcat(buffer, "\" was not found.");

      fputs(buffer, response);
}

void do_get(FILE* request, FILE* response) {
      char user_id[1024];
      //ruleid: cpp-improper-input-validation
      fgets(user_id, 1024, request);

      char buffer[1024];
      strcat(buffer, "SELECT * FROM user WHERE user_id='");
      strcat(buffer, user_id);
      strcat(buffer, "'");

      // ...
    }

void do_get(FILE* request, FILE* response) {
      char user_id[1024];
      //ok: cpp-improper-input-validation
      fgets(user_id, 1024, "request");

      char buffer[1024];
      strcat(buffer, "SELECT * FROM user WHERE user_id='");
      strcat(buffer, user_id);
      strcat(buffer, "'");

      // ...
}

void count()
{
    int count=0;
    c++;
       //ok: cpp-improper-input-validation
    cout<<"count is : "<<count<<std::endl;
}

void constValue()
{
    static const std::string APPLICATION_NAME_1 = "Row-1";
    std::string appName_11 = APPLICATION_NAME_1;
     //ok: cpp-improper-input-validation
    std::cout << "AppName: " << appName_11 << std::endl;

}

int main()
{
    // Write C++ code here
    std::cout << "Hello world!";

    return 0;
}