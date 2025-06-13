// Online C++ compiler to run C++ program online
#include <iostream>
#include <iostream>
#include <fstream>
#include <sys/stat.h>
#include <filesystem>
#include <unistd.h>

namespace
{
#define O_CREAT 1
#define S_IRUSR 2
#define S_IWUSR 3

    int open(int file, int permission)
    {
        return 1;
    }

    int open(int file, int permission, int mode)
    {
        return 1;
    }
}

inline int noncompliant1()
{
    int FILE;
    // BAD - this uses arbitrary bytes from the stack as mode argument
    // ruleid: cpp-loose-resource-permissions
    return open(FILE, O_CREAT);
}

using namespace std;

namespace
{
#define SECURITY_DESCRIPTOR_REVISION 1

    class SECURITY_DESCRIPTOR
    {
    };

    class SECURITY_ATTRIBUTES
    {
    };

    bool InitializeSecurityDescriptor(SECURITY_DESCRIPTOR *pSD, int a)
    {
        return true;
    }

    bool SetSecurityDescriptorDacl(SECURITY_DESCRIPTOR *pSD, bool a, bool b, bool c)
    {
        return true;
    }

}

int noncompliant2()
{
    SECURITY_DESCRIPTOR pSD;
    SECURITY_ATTRIBUTES SA;

    //  Missing initialization of the security descriptor
    // This may lead to undefined behavior when attempting to set the DACL
    // or perform other operations with the uninitialized security descriptor.
    // For demonstration purposes only; do not use in production code.
    // ruleid: cpp-loose-resource-permissions
    if (!SetSecurityDescriptorDacl(&pSD,true,NULL,false))
    {
        // error handling
    }
}

void nonCompliant3()
{
    //  Creating a file with world-writable permissions
    // Creating a file with overly permissive permissions:
    std::ofstream outfile("example.txt");
    if (outfile.is_open())
    {
        outfile << "This is a non-compliant test case.\n";
        outfile.close();
        // ruleid: cpp-loose-resource-permissions
        chmod("example.txt", S_IRWXU | S_IRWXG | S_IRWXO); // Make file world-writable
    }
    else
    {
        std::cerr << "Error opening file." << std::endl;
    }
}

void nonCompliant4()
{
    //  Setting overly permissive permissions on an existing file
    // ruleid: cpp-loose-resource-permissions
    chmod("existing_file.txt", S_IRWXU | S_IRWXG | S_IRWXO); // Make file world-writable
}

void nonCompliant5()
{
    // Creating a directory with world-writable permissions
    // ruleid: cpp-loose-resource-permissions
    mkdir("example_dir", S_IRWXU | S_IRWXG | S_IRWXO); // Make directory world-writable
}

void nonCompliant6()
{
    // Setting overly permissive permissions using system commands
	FILE *out_file = fopen(file, "w");
	// ruleid: cpp-loose-resource-permissions
    system(out_file); // Make file world-writable
}

void nonCompliant7()
{
    // Using system calls to change file permissions without proper validation
    // ruleid: cpp-loose-resource-permissions
    chmod("file.txt", 0777); // Make file world-writable
}

void nonCompliant8()
{
    // Assigning overly permissive permissions using fopen and chmod
    FILE *file = fopen("file.txt", "w");
    if (file != nullptr)
    {
        fclose(file);
        // ruleid: cpp-loose-resource-permissions
        chmod("file.txt", S_IRWXU | S_IRWXG | S_IRWXO); // Make file world-writable
    }
    else
    {
        std::cerr << "Error opening file." << std::endl;
    }
}

int fd;
void nonCompliant9()
{

    // Setting overly permissive permissions on an existing file
    // ruleid: cpp-loose-resource-permissions
    fchmod(fd, S_IRWXU | S_IRWXG | S_IRWXO); // Make file world-writable
}

int compliant1()
{
    int FILE;
    // GOOD - the mode argument is supplied
    // ok: cpp-loose-resource-permissions
    return open(FILE, O_CREAT, S_IRUSR | S_IWUSR);
}

int compliant2()
{

    SECURITY_DESCRIPTOR pSD;
    SECURITY_ATTRIBUTES SA;
    // ok: cpp-loose-resource-permissions
    if (!InitializeSecurityDescriptor(&pSD, SECURITY_DESCRIPTOR_REVISION))
    {
        // error handling
    }
    if (!SetSecurityDescriptorDacl(&pSD,
                                   true, // bDaclPresent - this value indicates the presence of a DACL in the security descriptor
                                   NULL, // pDacl - the pDacl parameter does not point to a DACL. All access will be allowed
                                   false))
    {
        // error handling
    }
}

void compliant3()
{
    // Creating a file with restricted permissions
    std::ofstream outfile("example.txt");
    // ok: cpp-loose-resource-permissions
    if (outfile.is_open())
    {
        outfile << "This is a compliant test case.\n";
        outfile.close();
        // Set file permissions to read and write for owner only
        chmod("example.txt", S_IRUSR | S_IWUSR);
    }
    else
    {
        std::cerr << "Error opening file." << std::endl;
    }
}

void compliant4()
{
    // Setting restricted permissions on an existing file
    // ok: cpp-loose-resource-permissions
    chmod("existing_file.txt", S_IRUSR | S_IWUSR); // Set file permissions to read and write for owner only
}

void compliant5()
{
    //  Creating a directory with restricted permissions
    // ok: cpp-loose-resource-permissions
    mkdir("example_dir", S_IRWXU | S_IRWXG); // Make directory accessible only by the owner
}

void compliant6()
{
    //  Using C++ filesystem library to set permissions
    // ok: cpp-loose-resource-permissions
    std::filesystem::permissions("file.txt", std::filesystem::perms::owner_read | std::filesystem::perms::owner_write);
}

void compliant7()
{
    // Using system calls with restricted permissions
    // ok: cpp-loose-resource-permissions
    chmod("file.txt", S_IRUSR | S_IWUSR); // Set file permissions to read and write for owner only
}

void compliant8()
{
    // Assigning restricted permissions using fopen without subsequent chmod
    FILE *file = fopen("file.txt", "w");
    if (file != nullptr)
    {
        fclose(file);
    }
    else
    {
        std::cerr << "Error opening file." << std::endl;
    }
}

void compliant9()
{
    // Setting restricted permissions on an existing file
    // ok: cpp-loose-resource-permissions
    fchmod(fd, S_IRWXU | S_IRWXG); // Set file permissions to read and write for owner only
}

int main()
{
    // Write C++ code here
    std::cout << "Try programiz.pro";

    return 0;
}


int main()
{
	char ch;
    item.push_back({"chips",20});
    item.push_back({"kurkure",50});
	intro();
	do
	{
		system("cls");//in stdlib.h
		cout<<"\n\n\n\tMAIN MENU";
		cout<<"\n\n\t01. NEW CUSTOMER";
		cout<<"\n\n\t02. ALL ITEMS";
		cout<<"\n\n\t03. ADD NEW ITEMS";
		cout<<"\n\n\t04. EDIT ITEM";
		cout<<"\n\n\t05. ALL CUSTOMERS LIST";
		cout<<"\n\n\t06. DELETE ITEM";
		cout<<"\n\n\t07. EXIT";
		cout<<"\n\n\tSelect Your Option (1-7) ";
		cin>>ch;
		system("cls");
		switch(ch)
		{
		case '1':
			write_account();
			break;
		case '2':
		    all_items();
            break;
		case '3':
            add_item();
			break;
		case '4':
            edit_item();
			break;
		case '5':
			display_all();
			break;
		case '6':
            delete_item();
			break;
		case '7':
			cout<<"\n\n\tThanks for using canteen management system";
			break;
		default :cout<<"\a"; // visible alert
		}
		cin.ignore();
		cin.get();
	}while(ch!='7');
	return 0;
}


int osCommandInjectionCompliant() {
    std::string filename;
    std::cout << "Enter a filename: ";
    std::cin >> filename;

    if (isValid(filename)) {
        std::string command = "ls " + filename;
        // Compliant: Validating the use input before passing into `system` method.
        system(command.c_str());
    }

    return 0;
}
