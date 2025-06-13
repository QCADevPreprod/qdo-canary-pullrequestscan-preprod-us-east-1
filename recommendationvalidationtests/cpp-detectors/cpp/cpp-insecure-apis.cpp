#include <iostream>
#include <cstdlib>
#include <cstdio>
#include <fstream>
#include <iostream>

using namespace std;

void nonompliantMktempExample() {
    char templateName[] = "/tmp/fileXXXXXX";
	FILE* file = fopen(templateName, "w");
    // ruleid: cpp-insecure-apis
    mktemp(templateName);
    fprintf(file, "This is unsafe content.\n");
    fclose(file);
}

void nonompliantTmpnamExample() {
	// ruleid: cpp-insecure-apis
    char* filename = tmpnam(nullptr);
    FILE* file = fopen(filename, "w");
    fprintf(file, "This is unsafe content.\n");
    fclose(file);
}


void nonompliantTempnamExample() {
	// ruleid: cpp-insecure-apis
    char* filename = tempnam("/tmp", "file");
    FILE* file = fopen(filename, "w");
    fprintf(file, "This is unsafe content.\n");
    fclose(file);
    free(filename);
}


void compliantMkstempExample() {
    char templateName[] = "fileXXXXXX";
    int fileDescriptor = mkstemp(templateName);
    FILE* file = fdopen(fileDescriptor, "w");
	// Compliant: `mkstemp` creates a unique file and returns a file descriptor.
    // ok: cpp-insecure-apis
    fprintf(file, "This is safe content.\n");
    fclose(file);
}


void compliantTmpfileExample() {
    FILE* file = tmpfile();
	// Compliant: `tmpfile` creates a unique file.
    // ok: cpp-insecure-apis
    fprintf(file, "This is safe content.\n");
    fclose(file);
}

void compliantOfstreamExample() {
    std::ofstream file("file.txt");
	// Compliant: Standard library provides safer file handling.
    // ok: cpp-insecure-apis
    file << "This is safe content." << std::endl;
}

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}