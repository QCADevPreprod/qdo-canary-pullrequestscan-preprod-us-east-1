#include <stdio.h>
#include <stdlib.h>
#include <time.h>

enum { len = 12 };


void noncompliant1(void)
{
	char id[len];
	int r;
	int num;

	// ...

	// ruleid: cpp-incorrect-pseudorandom-number-generator
	r = rand();
	num = snprintf(id, len, "ID%-d", r);

	// ...
}

void noncompliant2() {
	// ruleid: cpp-incorrect-pseudorandom-number-generator
    int random_int = std::rand(); // Sensitive
}

void noncompliant3(void)
{
	char id[len];
	int r;
	int num;

	// ...

	// ruleid: cpp-incorrect-pseudorandom-number-generator
	r = srand();
	num = snprintf(id, len, "ID%-d", r);

	// ...
}


void compliant1(void)
{
	char id[len];
	int r;
	int num;


	struct timespec ts;
	if (timespec_get(&ts, TIME_UTC) == 0) {
		/* handle error */
	}
	// ok: cpp-incorrect-pseudorandom-number-generator
	srandom(ts.tv_nsec ^ ts.tv_sec);

	// ok: cpp-incorrect-pseudorandom-number-generator
	r = random();
	num = snprintf(id, len, "ID%-d", r);
	// ...
}

void randombytes_buf(char* chars, int num) {

}

uint32_t randombytes_uniform(int num) {

}

class Botan {
	public:
	class System_RNG {
		public:
		void randomize(char* chr, int num) {

		}
	};
};

void compliant2() {

      char random_chars[10];
	  // ok: cpp-incorrect-pseudorandom-number-generator
      randombytes_buf(random_chars, 10); // Compliant

	  //ok: cpp-incorrect-pseudorandom-number-generator
      uint32_t random_int = randombytes_uniform(10); // Compliant


      uint8_t random_chars_a[10];
      Botan::System_RNG system;
      // ok: cpp-incorrect-pseudorandom-number-generator
      system.randomize(random_chars, 10); // Compliant
}


int main()
{
	printf("Hello, World!");
	return 0;
}

