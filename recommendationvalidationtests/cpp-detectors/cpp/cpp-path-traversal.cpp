
using namespace std;
#define CROW_MAIN
#include <iostream>
#include <fstream>
#include <memory>
#include <crow_all.h>
#include <juce_core/juce_core.h>
#include <cstring>
#include <cstdio>

int noncompliant1() {
     crow::SimpleApp app;

     // Vulnerable route - does not properly validate file path
     CROW_ROUTE(app, "/download/<path>")
         ([](const crow::request& req, crow::response& res, const std::string& filePath) {
             ofstream file("uploads/" + filePath, ios::out);
             //ruleid: cpp-path-traversal
             if (file.is_open()) {
                 std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
                 res.write(content);
                 res.end();
             } else {
                 res.code = 404;
                 res.write("File not found");
                 res.end();
             }
         });

     app.port(8080).multithreaded().run();
     return 0;
}

int noncompliant2() {
     juce::File zipFile("example.zip");
     juce::File destinationDir("extracted_files");

     // Zip slip vulnerability - no path validation
     //ruleid: cpp-path-traversal
     juce::ZipFile::extractAllTo(zipFile, destinationDir);

     return 0;
}

int noncompliant3() {
     crow::SimpleApp app;

     // Vulnerable route - does not properly validate file path
     CROW_ROUTE(app, "/download/<path>")
         ([](const crow::request& req, crow::response& res, const std::string& filePath) {
             ifstream file("uploads/" + filePath, ios::in);
             //ruleid: cpp-path-traversal
             if (file.is_open()) {
                 std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
                 res.write(content);
                 res.end();
             } else {
                 res.code = 404;
                 res.write("File not found");
                 res.end();
             }
         });

     app.port(8080).multithreaded().run();
     return 0;
}

int noncompliant4() {
     crow::SimpleApp app;

     // Vulnerable route - does not properly validate file path
     CROW_ROUTE(app, "/download/<path>")
         ([](const crow::request& req, crow::response& res, const std::string& filePath) {
             std::fstream file("uploads/" + filePath);
             //ruleid: cpp-path-traversal
             if (file.is_open()) {
                 std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
                 res.write(content);
                 res.end();
             } else {
                 res.code = 404;
                 res.write("File not found");
                 res.end();
             }
         });

     app.port(8080).multithreaded().run();
     return 0;
}


int noncompliant5(char** argv){
    std::fstream file("upload/" + argv[1]);
    //ruleid: cpp-path-traversal
    if(file.is_open()){
        std::cout << "File Opened ." << std::endl;
    }

}

int noncompliant(int argc, char** argv) {
    char *userAndFile = argv[2];

    // {fact rule=path-traversal@v1.0 defects=1}
    char fileBuffer[FILENAME_MAX] = "/home/";
    char *fileName = fileBuffer;
    size_t len = strlen(fileName);
    strncat(fileName+len, userAndFile, FILENAME_MAX-len-1);
    // BAD: a string from the user is used in a filename
    //ruleid: cpp-path-traversal
    fopen(fileName, "wb+");
    // {/fact}
}

      int compliant(int argc, char** argv)  {
      char *userAndFile = argv[2];
        // {fact rule=path-traversal@v1.0 defects=0}
        char fileBuffer[FILENAME_MAX] = "/home/";
        char *fileName = fileBuffer;
        size_t len = strlen(fileName);
        // GOOD: use a fixed file
        //ok: cpp-path-traversal
        char* fixed = "jim/file.txt";
        strncat(fileName+len, fixed, FILENAME_MAX-len-1);
        fopen(fileName, "wb+");
        // {/fact}
      }


namespace {
    int main(int argc, char** argv) {
      char *userAndFile = argv[2];

      {
        // {fact rule=path-traversal@v1.0 defects=1}
        char fileBuffer[FILENAME_MAX] = "/home/";
        char *fileName = fileBuffer;
        size_t len = strlen(fileName);
        strncat(fileName+len, userAndFile, FILENAME_MAX-len-1);
        // BAD: a string from the user is used in a filename
        //ruleid: cpp-path-traversal
        fopen(fileName, "wb+");
        // {/fact}
      }

      {
        // {fact rule=path-traversal@v1.0 defects=0}
        char fileBuffer[FILENAME_MAX] = "/home/";
        char *fileName = fileBuffer;
        size_t len = strlen(fileName);
        // GOOD: use a fixed file
        //ok: cpp-path-traversal
        char* fixed = "jim/file.txt";
        strncat(fileName+len, fixed, FILENAME_MAX-len-1);
        fopen(fileName, "wb+");
        // {/fact}
      }
    }
}





 int compliant1() {
     crow::SimpleApp app;

     CROW_ROUTE(app, "/download/<path>")
         ([](const crow::request& req, crow::response& res, const std::string& filePath) {
             if (isValidFilePath(filePath)) {
                 std::ifstream file("uploads/" + filePath);
                 //ok: cpp-path-traversal
                 if (file.is_open()) {
                     std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
                     res.write(content);
                     res.end();
                 } else {
                     res.code = 404;
                     res.write("File not found");
                     res.end();
                 }
             } else {
                 res.code = 400;
                 res.write("Bad Request: Invalid file path");
                 res.end();
             }
         });

     app.port(8080).multithreaded().run();
     return 0;
 }


 int compliant2() {
     juce::File zipFile("example.zip");
     juce::File destinationDir("extracted_files");

     // Safely extract ZIP files with path validation
     juce::ZipFile zip(zipFile);

     for (int i = 0; i < zip.getNumEntries(); ++i) {
         juce::ZipFile::ZipEntry entry(zip.getEntry(i));
         juce::File extractedFile(destinationDir.getChildFile(entry.filename));

         // Validate the path before extracting
         if (isValidZipPath(entry.filename)) {
             //ok: cpp-path-traversal
             extractedFile.create();
             std::unique_ptr<juce::FileOutputStream> outputStream(extractedFile.createOutputStream());
             outputStream->write(zip.decompressEntry(i), entry.uncompressedSize);
         } else {
             std::cout << "Error: Invalid path in ZIP archive - " << entry.filename << std::endl;
         }
     }

     return 0;
 }
