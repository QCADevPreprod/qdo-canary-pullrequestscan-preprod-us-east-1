
#include <iostream>
#include <array>
#include <cstring>
#include <vector>
#include <stack>
#include <queue>

void noncompliant1()
{

    // Declaring an array named id_sequence with a size of 3 integers
    int id_sequence[3] = {1, 2, 3};

    // Error: Attempting to assign a value to the fourth element (out of bounds)
    // ruleid:cpp-out-of-bounds-write
    id_sequence[4] = 456;
}

void noncompliant2()
{

    // Using incorrect index in a loop
    int arr[3] = {1, 2, 3};

    for (int i = 0; i <= 3; ++i)
    {
        // ruleid:cpp-out-of-bounds-write
        arr[i] = i * 2; // Accessing index 3 (out of bounds)
    }
}

void noncompliant3()
{

    // Writing beyond the allocated memory
    char *str = new char[10];
    // ruleid:cpp-out-of-bounds-write
    strcpy(str, "Hello, world!"); // String is longer than allocated memory
}

void noncompliant4()
{

    // Writing into a string buffer without bounds checking
    char buffer[20];
    std::string data = "Some data to copy into buffer";
    // ruleid:cpp-out-of-bounds-write
    data.copy(buffer, data.length() + 1); // May exceed buffer size
}

void noncompliant5()
{

    // Writing outside the bounds due to incorrect pointer arithmetic
    int arr[3] = {1, 2, 3};
    int *ptr = &arr[0];
    ptr += arr[4]; // Moving the pointer out of the bounds of arr
    // ruleid:cpp-out-of-bounds-write
    *ptr = 10; // Writing at an invalid memory location
}

void noncompliant6()
{

    // Writing outside the bounds due to incorrect pointer arithmetic
    std::vector<int> vec = {1, 2, 3};
    int *ptr = &vec[0];
    ptr += 5; // Moving the pointer out of the bounds of arr
    // ruleid:cpp-out-of-bounds-write
    *ptr = 10; // Writing at an invalid memory location
}

int compliant1()
{

    // Using std::array with a size of 4 integers
    std::array<int, 4> id_sequence = {123, 234, 345, 456};

    // using std::array provides more safety features, including bounds checking and size() to determine array size
    //  Displaying the values of the id_sequence array
    // ok:cpp-out-of-bounds-write
    for (int i = 0; i < id_sequence.size(); ++i)
    {
        std::cout << "id_sequence[" << i << "] = " << id_sequence[i] << std::endl;
    }

    return 0;
}

void compliant2()
{

    // Ensuring correct loop bounds
    int arr[3] = {1, 2, 3};
    // ok:cpp-out-of-bounds-write
    for (int i = 0; i < 3; ++i)
    {
        arr[i] = i * 2; // Accessing indices within array bounds
    }
}

void compliant3()
{

    // Properly allocating memory for string
    char str[20];
    // ok:cpp-out-of-bounds-write
    strcpy(str, "Hello, world!"); // String fits within allocated memory
}

void compliant4()
{

    // Using safe functions with bounds checking
    char buffer[20];
    std::string data = "Some data to copy into buffer";
    // ok:cpp-out-of-bounds-write
    data.copy(buffer, sizeof(buffer)); // Ensures no overflow beyond buffer size
}

void compliant5()
{

    //  Avoiding pointer arithmetic that moves out of bounds
    std::vector<int> vec = {1, 2, 3};
    int *ptr = &vec[2];
    // ok:cpp-out-of-bounds-write
    if (ptr >= vec.data() && ptr < vec.data() + vec.size())
    {
        *ptr = 10; // Writing within the bounds using pointer validity check
    }
}

int noncompliant7(char *username)
	{
		char buf[1024];

		strcpy(buf, "username is: ");
		// ruleid: cpp-out-of-bounds-write
		strncat(buf, username, sizeof(buf));

		log("%s\n", buf);

		return 0;
	}

	int noncompliant8(char *username)
	{
		char buf[1024];

		strcpy(buf, "username is: ");
		// ruleid: cpp-out-of-bounds-write
		strncat(buf, username, 1024);

		log("%s\n", buf);

		return 0;
	}

	int noncompliant9(char *username)
	{
		char buf[1024];

		strcpy(buf, "username is: ");
		// ruleid: cpp-out-of-bounds-write
		strncat(buf, username, sizeof(buf) - strlen(buf));

		log("%s\n", buf);

		return 0;
	}

	int compliant6(char *username)
	{
		char buf[1024];

		strcpy(buf, "username is: ");
		// ok: cpp-out-of-bounds-write
		strncat(buf, username, sizeof(buf) - strlen(buf) - 1);

		log("%s\n", buf);

		return 0;
	}


int main()
{
    // Write C++ code here
    std::cout << "Hello world!";

    return 0;
}
