
#include <iostream>
#include <cstdlib>

void noncompliant1()
{
    int *ptr;
    // Non-Compliant: Dereferencing uninitialized pointer
    // ruleid: cpp-null-pointer-dereference
    int value = *ptr;
}

void noncompliant2()
{
    int *ptr = (int *)malloc(sizeof(int)); // Explicit cast to int*
    free(ptr);
    // Dereferencing freed pointer
    // ruleid: cpp-null-pointer-dereference
    int value = *ptr;
}

void noncompliant3()
{
    int *arr = NULL;
    // pointer arr is explicitly set to NULL, and an attempt is made to access the first arr element
    // ruleid: cpp-null-pointer-dereference
    int element = arr[0];
}

void processValue(int *ptr)
{
    // Dereferencing NULL pointer passed to a function
    int value = *ptr;
}

int noncompliant4()
{
    int *nullPtr = NULL;
    // Dereferencing NULL pointer passed to a function
    // ruleid: cpp-null-pointer-dereference
    processValue(nullPtr);
    return 0;
}

void noncompliant5()
{
    int *ptr = NULL;
    // Using NULL pointer in arithmetic operation
    // ruleid: cpp-null-pointer-dereference
    int result = 5 + *ptr;
}

void noncompliant6()
{
    int *arr = nullptr;
    // pointer arr is explicitly set to NULL, and an attempt is made to access the first arr element
    // ruleid: cpp-null-pointer-dereference
    int element = arr[0];
}

void noncompliant7()
{
    int *ptr = (int *)malloc(sizeof(int)); // Explicit cast to int*
    free(ptr);
    // Dereferencing freed pointer
    // ruleid: cpp-null-pointer-dereference
    int value = *ptr;
}

void noncompliant8()
{
    int *ptr;
    // Non-Compliant: Dereferencing uninitialized pointer
    // ruleid: cpp-null-pointer-dereference
    int value = *ptr;
}

void compliant1()
{
    int *ptr = NULL;
    // Compliant: Checking for NULL before dereferencing
    // ok: cpp-null-pointer-dereference
    if (ptr != NULL)
    {
        int value = *ptr;
    }
}

void compliant2()
{
    // Validating by conditional check and Using Dynamically Allocated Pointer
    // ok: cpp-null-pointer-dereference
    int *ptr = (int *)malloc(sizeof(int));
    if (ptr != NULL)
    {
        *ptr = 42;
        // free function is called to deallocate the memory
        free(ptr);
    }
}

void compliant3()
{
    int *arr = NULL;
    // Checking for NULL before array access
    // ok: cpp-null-pointer-dereference
    if (arr != NULL)
    {
        int element = arr[0];
    }
}

void processValuecheck(int *ptr)
{
    // Checking for NULL before dereferencing in a function
    if (ptr != NULL)
    {
        int value = *ptr;
    }
}

int noncompliant9()
{
    int *nullPtr = NULL;
    // ruleid: cpp-null-pointer-dereference
    processValuecheck(nullPtr);
    return 0;
}

void compliant5()
{

    int *ptr = NULL;
    // Avoiding NULL pointer in arithmetic operation
    // ok: cpp-null-pointer-dereference
    int result = (ptr != NULL) ? (5 + *ptr) : 0;
}

void compliant6()
{
    int *arr = nullptr;
    // Checking for NULL before array access
    // ok: cpp-null-pointer-dereference
    if (arr != nullptr)
    {
        int element = arr[0];
    }
}

void compliant7()
{
    // Validating by conditional check and Using Dynamically Allocated Pointer
    // ok: cpp-null-pointer-dereference
    int *ptr = (int *)malloc(sizeof(int));
    if (ptr != nullptr)
    {
        *ptr = 42;
        // free function is called to deallocate the memory
        free(ptr);
    }
}

void compliant8()
{
    int *ptr = nullptr;
    // Compliant: Checking for NULL before dereferencing
    // ok: cpp-null-pointer-dereference
    if (ptr != nullptr)
    {
        int value = *ptr;
    }
}

int compliant9()
{
    int *nullPtr = NULL;
    if(nullPtr!=NULL)
    {
// ok: cpp-null-pointer-dereference
    processValuecheck(nullPtr);
    }
    return 0;
}

int main()
{
    // Write C++ code here
    std::cout << "Hello world!";

    return 0;
}
