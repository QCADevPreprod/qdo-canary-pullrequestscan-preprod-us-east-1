
#include <iostream>
#include <optional>
#include <vector>
#include <memory>
#include <deque>

// Accessing optional without checking if it has value:
int noncompliant1()
{
    std::optional<int> opt;
    // ruleid: cpp-optional-empty-access
    int value = *opt; // Accessing without checking if opt has value
    std::cout << "Value: " << value << std::endl;
    return 0;
}

// Accessing optional with .value() method without checking:
int noncompliant2()
{
    std::optional<int> opt;
    // ruleid: cpp-optional-empty-access
    int value = opt.value(); // Accessing without checking if opt has value
    std::cout << "Value: " << value << std::endl;
    return 0;
}

// Accessing optional with .at() method without checking:
int noncompliant3()
{
    std::optional<std::vector<int>> opt;
    // ruleid: cpp-optional-empty-access
    int value = opt->at(0); // Accessing without checking if opt has value
    std::cout << "Value: " << value << std::endl;
    return 0;
}

// Dereferencing a pointer without checking for null:
void nonCompliant4(std::shared_ptr<int> ptr)
{

    // ruleid: cpp-optional-empty-access
    std::cout << "Value: " << *ptr << std::endl; // No check for null pointer
}

std::optional<int> return_empty()
{

    return {};
}

int noncompliant5()
{
    std::optional<int> o = return_empty();
    // ruleid: cpp-optional-empty-access
    return o.value(); // Access the value if it exists,
}

void noncompliant6(int a)
{
    if (a == 4)
    {                           // Check if the input argument 'a' is equal to 4
        std::optional<int> foo; // Declare an optional integer variable 'foo'
        // ruleid: cpp-optional-empty-access
        int _ = foo.value(); // Attempt to access the value stored in 'foo'
    }
}

void nonCompliant7(std::optional<int> &opt)
{

    // ruleid: cpp-optional-empty-access
    std::cout << "Value: " << *opt << std::endl; // No check for emptiness
}

// Accessing optional with .front() method without checking:
int nonCompliant8()
{
    std::optional<std::deque<int>> opt;
    // ruleid: cpp-optional-empty-access
    int value = opt->front(); // Accessing without checking if opt has value
    std::cout << "Value: " << value << std::endl;
    return 0;
}

// Accessing optional with .operator[] without checking
int nonCompliant9()
{
    std::optional<std::vector<int>> opt;
    // ruleid: cpp-optional-empty-access
    int value = (*opt)[0]; // Accessing without checking if opt has value
    std::cout << "Value: " << value << std::endl;
    return 0;
}

// Checking if optional has value before accessing:
int compliant1()
{
    std::optional<int> opt;
    // ok: cpp-optional-empty-access
    if (opt.has_value())
    {
        int value = *opt;
        std::cout << "Value: " << value << std::endl;
    }
    else
    {
        std::cout << "Optional does not have value." << std::endl;
    }
    return 0;
}

// Using std::optional::value_or to provide a default value:
int compliant2()
{
    std::optional<int> opt;
    // ok: cpp-optional-empty-access
    int value = opt.value_or(0);
    std::cout << "Value: " << value << std::endl;
    return 0;
}

// Using std::optional::operator-> with a member function:
int compliant3()
{
    std::optional<std::vector<int>> opt;
    // ok: cpp-optional-empty-access
    if (opt)
    {
        int value = opt->at(0);
        std::cout << "Value: " << value << std::endl;
    }
    else
    {
        std::cout << "Optional does not have value." << std::endl;
    }
    return 0;
}

// Utilizing safe dereferencing operator (?. in C++20) for pointers
void compliant4(std::shared_ptr<int> ptr)
{
    // Using the safe dereferencing operator to check and access the value
    // ok: cpp-optional-empty-access
    std::cout << "Value: " << (ptr ? *ptr : -1) << std::endl;
}

int compliant5()
{
    std::optional<int> o = return_empty();
    // ok: cpp-optional-empty-access
    if (o.has_value())
    {
        return o.value(); // Access the value only if it exists
    }
    else
    {
        // Handle the case where the optional is empty
        return 0; // For example, return a default value
    }
}

void compliant6(int a)
{
    if (a == 4)
    {                           // Check if the input argument 'a' is equal to 4
        std::optional<int> foo; // Declare an optional integer variable 'foo'
        // ok: cpp-optional-empty-access
        if (foo.has_value())
        {                        // Check if 'foo' has a value
            int _ = foo.value(); // Access the value stored in 'foo'
        }
    }
}

void compliant7(std::optional<int> &opt)
{
    // ok: cpp-optional-empty-access
    if (opt.has_value())
    {
        std::cout << "Value before reset: " << *opt << std::endl;
        opt.reset(); // Clears the optional
    }
    else
    {
        std::cout << "Optional is already empty" << std::endl;
    }
}

// Using std::optional::value_or with a custom default value:
int compliant8()
{
    std::optional<int> opt;
    int defaultValue = -1;
    // ok: cpp-optional-empty-access
    int value = opt.value_or(defaultValue);
    std::cout << "Value: " << value << std::endl;
    return 0;
}

// Using std::optional::reset to clear optional value:
int compliant9()
{
    std::optional<int> opt = 10;
    std::cout << "Before reset: " << *opt << std::endl;
    opt.reset();
    // ok: cpp-optional-empty-access
    if (opt.has_value())
    {
        std::cout << "After reset: " << *opt << std::endl;
    }
    else
    {
        std::cout << "Optional does not have value after reset." << std::endl;
    }
    return 0;
}

int main()
{
    // Write C++ code here
    std::cout << "Hello world!";

    return 0;
}
