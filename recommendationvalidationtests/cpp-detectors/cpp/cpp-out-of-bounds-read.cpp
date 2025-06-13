
using namespace std;

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <iostream>
#include <vector>
#include <memory>

void noncompliant1() {
   int MAX = 10;
   char array1[MAX];
   int  array2[MAX];
   // The call to `memcpy()` reads memory from outside the allocated bounds of cArray, which contains MAX elements of type char, while iArray contains MAX elements of type int.
   // ruleid: cpp-out-of-bounds-read
   memcpy(array2, array1, sizeof(array2));
}

void noncompliant2(int argc, char** argv) {
  int MAX_PATH= 10;
  // Used an untrusted command line argument as the search buffer in a call to memchr() with a constant number of bytes to be analyzed.
  // ruleid: cpp-out-of-bounds-read
  char* ret = (char *)memchr(argv[0], 'x', MAX_PATH);
  printf("%s\n", ret);
}

int noncompliant3(int *array, int len, int index) {

    int value;
    if (index < len) {
        // This will allow a negative value to be accepted as the input array index.
        // ruleid: cpp-out-of-bounds-read
        value = array[index];
    }
    else {
    printf("Value is: %d\n", array[index]);
    value = -1;
    }

    return value;
}

void noncompliant4()
{
    wchar_t * data;
    data = NULL;
    data = new wchar_t[50];
    wmemset(data, L'A', 50-1);
    data[50-1] = L'\0';
    {
        size_t i, destLen;
        wchar_t dest[100];
        wmemset(dest, L'C', 100-1);
        dest[100-1] = L'\0';
        destLen = wcslen(dest);
        //using length of the dest where data could be smaller than dest causing buffer overread
        for (i = 0; i < destLen; i++)
        {
            // ruleid: cpp-out-of-bounds-read
            dest[i] = data[i];
        }
        dest[100-1] = L'\0';
    }
}

static int StaticGlobal[][3] = {
    {0, 0, 0}, {0, 0, 0}, {0, 0, 0}, {0, 0, 0}, {0, 0, 0}};

void noncompliant5() {
    // out-of-bounds read
    // ruleid: cpp-out-of-bounds-read
    int* p = StaticGlobal[10];
}

int noncompliant6(int argc, char** argv){
    uint8_t buf[8] = {0};
    for(int i = 0; i <sizeof(buf); ++i){
        // out-of-bounds read
        // ruleid: cpp-out-of-bounds-read
        buf[i+1] = 10;
    }

    buf[8] = 10;
    return 0;
}

void noncompliant7() {
    int size = 1;
    int a[size];

    int index = 0;

    while( index++ < size) // index at the time of comparing is 0 but right after it is 1
    {
        // ruleid: cpp-out-of-bounds-read
        a[index] = 0; // here we are going out of bounds because index is 1
    }
}

void noncompliant8() {
    int arr[5] = {1, 2, 3, 4, 5};
    // ruleid: cpp-out-of-bounds-read
    int sixth = arr[6]; // out-of-bounds read
}

void compliant1() {
    int arr[5] = {1, 2, 3, 4, 5};
    int index = 5;
    // ok: cpp-out-of-bounds-read
    if (index >= 0 && index < sizeof(arr)/sizeof(arr[0])) {
        int sixth = arr[index];
    }

}

void compliant2() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    int index = 5;
    // ok: cpp-out-of-bounds-read
    if (index >= 0 && index < vec.size()) {
        int sixth = vec[index];
    }

}

void compliant3() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    // ok: cpp-out-of-bounds-read
    for (int x : vec) {
        // do something with x
    }
}

void compliant4() {
    std::unique_ptr<int[]> arr(new int[5]{1, 2, 3, 4, 5});
    int index = 5;
    if (index >= 0 && index < 5) {
        // ok: cpp-out-of-bounds-read
        int sixth = arr[index];
    }
}

void compliant5() {
   int MAX = 10;
   int array1[MAX];
   int  array2[MAX];
   // ok: cpp-out-of-bounds-read
   memcpy(array2, array1, sizeof(array2));
}


void compliant6(){
    for (; j < size.width; j++)
        {
            // ok: cpp-out-of-bounds-read
            s32 srcVal = src[j];
            dst[j] = internal::saturate_cast<s16>(dst[j] + ((srcVal * srcVal) >> shift));
        }
}

void compliant7() {
    // ok: cpp-out-of-bounds-read
    accumulateSquareConstFunc funcs[16] =
    {
        accumulateSquareConst<0>,
        accumulateSquareConst<1>,
        accumulateSquareConst<2>,
        accumulateSquareConst<3>,
        accumulateSquareConst<4>,
        accumulateSquareConst<5>,
        accumulateSquareConst<6>,
        accumulateSquareConst<7>,
        accumulateSquareConst<8>,
        accumulateSquareConst<9>,
        accumulateSquareConst<10>,
        accumulateSquareConst<11>,
        accumulateSquareConst<12>,
        accumulateSquareConst<13>,
        accumulateSquareConst<14>,
        accumulateSquareConst<15>
    }, func = funcs[shift];
}

void compliant8() {
    for (ptrdiff_t j = 0; j < (ptrdiff_t)size.width; j++)
        {
            #define CANNY_SHIFT 15
            const s32 TG22 = (s32)(0.4142135623730950488016887242097*(1<<CANNY_SHIFT) + 0.5);
            // ok: cpp-out-of-bounds-read
            s32 m = _mag[j];
        }
}

void compliant9() {
    for (ptrdiff_t j = 0; j < (ptrdiff_t)size.width; j++)
        {
            #define CANNY_SHIFT 15
            const s32 TG22 = (s32)(0.4142135623730950488016887242097*(1<<CANNY_SHIFT) + 0.5);
            // ok: cpp-out-of-bounds-read
            s32 m = _mag[j];

            if (m > low)
            {
                // ok: cpp-out-of-bounds-read
                s32 xs = _x[j];
                // ok: cpp-out-of-bounds-read
                s32 ys = _y[j];
                s32 x = abs(xs);
                s32 y = abs(ys) << CANNY_SHIFT;
            }
        }
}


#define BUFSIZE 256


namespace{
	// {fact rule=out-of-bounds-read@v1.0 defects=1}
	void copy_string1(char *string)
	{
		char buf[BUFSIZE];

		// ruleid: cpp-out-of-bounds-read
		strncpy(buf, string, BUFSIZE);
	}
	// {/fact}

	// {fact rule=out-of-bounds-read@v1.0 defects=1}
	void copy_string2(char *string)
	{
		char buf[BUFSIZE];

		// ruleid: cpp-out-of-bounds-read
		stpncpy(buf, string, BUFSIZE);
	}
	// {/fact}

	// {fact rule=out-of-bounds-read@v1.0 defects=1}
	int test_func()
	{
		char longString[] = "String signifying nothing";
		char shortString[16];

		// ruleid: cpp-out-of-bounds-read
		strncpy(shortString, longString, 16);
		printf("The last character in shortString is: %c (%1$x)\n", shortString[15]);
		return 0;
	}
	// {/fact}

	void test_func2(int argc, char **argv)
	{
		char Filename[256];
		char Pattern[32];

		// ...
		// {fact rule=out-of-bounds-read@v1.0 defects=1}
		// ruleid: cpp-out-of-bounds-read
		strncpy(Filename, argv[1], sizeof(Filename));
		// {/fact}

		// {fact rule=out-of-bounds-read@v1.0 defects=1}
		// ruleid: cpp-out-of-bounds-read
		strncpy(Pattern, argv[2], sizeof(Pattern));
		// {/fact}

		printf("Searching file: %s for the pattern: %s\n", Filename, Pattern);
	}

	int read_integer(int sockfd){
		//do something
		return 0;
	}

	bool is_username_valid(char* user){
		// do something
		return true;
	}

	int authenticate(int sockfd)
	{
		char user[1024], *buffer;
		size_t size;
		int n, cmd;

		int MAX_PACKET = 1;

		cmd = read_integer(sockfd);
		size = read_integer(sockfd);
		if (size > MAX_PACKET)
			return -1;

		buffer = (char *)calloc(size + 1, sizeof(char));
		if(!buffer)
			return -1;

		// {fact rule=out-of-bounds-read@v1.0 defects=1}
		switch(cmd) {
		case 1:
			// ruleid: cpp-out-of-bounds-read
			strncpy(user, buffer, sizeof(user));
			if (!is_username_valid(user))
				return 0;
			break;
		// ...
		}
		// {/fact}
	}

	// {fact rule=out-of-bounds-read@v1.0 defects=1}
	int process_email(char *email)
	{
		char buf[1024], *domain;

		// ruleid: cpp-out-of-bounds-read
		strncpy(buf, email, sizeof(buf));

		domain = strchr(buf, '@');
		if(!domain)
			return -1;

		*domain++ = '\0';

		// ...
		return 0;
	}
	// {/fact}

}

int main()
{
    cout<<"Hello World";

    return 0;
}
