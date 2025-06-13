#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>

void noncompliant1()
{
	double *foo;

	// ruleid: cpp-incorrect-use-of-sizeof
	foo = (double *)malloc(sizeof(foo));
}

void noncompliant2(char *buf)
{
	size_t size;

	// ruleid: cpp-incorrect-use-of-sizeof
	size = sizeof(buf);
}

char *username = "admin";

void noncompliant3()
{
	// ruleid: cpp-incorrect-use-of-sizeof
	printf("Sizeof username = %d\n", sizeof(username));
}

void noncompliant4()
{
    double *userid;
	// ruleid: cpp-incorrect-use-of-sizeof
	printf("Sizeof userid = %d\n", sizeof(userid));
}

void compliant1()
{
	double *foo;

	// ok: cpp-incorrect-use-of-sizeof
	foo = (double *)malloc(sizeof(*foo));
}

void compliant2()
{
	char buf[256];
	size_t size;

	// ok: cpp-incorrect-use-of-sizeof
	size = sizeof(buf);
}

void compliant3(char *mom)
{
    // ok: cpp-incorrect-use-of-sizeof
    memset( mom, 0, sizeof(*mom) );
}

void debug_print(printf_buffer_t *buf, block_magic_t magic) {
    buf->appendf("block_magic{");
    char *bytes = magic.bytes;
    // ok: cpp-incorrect-use-of-sizeof
    debug_print_quoted_string(buf, reinterpret_cast<uint8_t *>(bytes), sizeof(magic.bytes));
    buf->appendf("}");
}


int main (int argc, char **argv)
{
	int authResult;

	if (argc < 3) {
		perror("Usage: Provide a username and password");
	}
	noncompliant4();
	return 0;
}
