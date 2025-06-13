#include <iostream>
#include <stdexcept>
#include <vector>
#include <fstream>
#include <string>
#include <httplib.h>

const int DELETE_FILE = 1;
const int ADMIN_ROLE = 1;
const int CHANGE_PASSWORD = 1;

class File {
public:
std::string path;
};
class UnauthorizedAccessException : public std::runtime_error
{
public:
    UnauthorizedAccessException() : std::runtime_error("Unauthorized access") {}
};

class User
{
private:
    bool isAdminFlag = false;
    std::vector<std::string> readPermissions;
    std::vector<std::string> downloadPermissions;

public:
    int role=1;
    bool isAdmin() const
    {

        return isAdminFlag;
    }

    bool hasPermission(int permissionType) const
    {

        return true;
    }

    bool isPasswordOwner() const
    {

        return true;
    }

    bool hasReadPermissions(std::string fileName)
    {
        for (auto &permission : readPermissions)
        {
            if (permission == fileName)
            {
                // user has read permission for this file
                return true;
            }
        }
        // no matching read permission found
        return false;
    }

    bool hasDownloadPermission(File file)
    {
        // Check if user has permission to download any file
        if (downloadPermissions.size() == 0)
        {
            return false;
        }

        // Check if user has permission to download specific files
        for (auto &permission : downloadPermissions)
        {
            if (permission == "*" || permission == file.path)
            {
                return true;
            }
        }

        return false;
    }
    bool hasDeletePermission(const std::string& filename) const {
        // Implement your logic to check if the user has permission to delete the file
        // Example: Assuming the user has permission to delete any file
        return true;
    }
     bool canDeleteFile(const std::string& fileName) const {
        // Implementation of canDeleteFile function
        // Check user's permissions or other conditions
        return true; // Example implementation, replace with your logic
    }
};

// Assume the deleteFile function is declared or defined
void deleteFile(const std::string& fileName)
{

    std::cout << "Deleting file: " << fileName << std::endl;
}

void nonCompliant1(User user)
{
    // Insufficient permission check, allowing unauthorized action
    // Deletes a file if the user is an admin without checking specific permission.
    if (user.isAdmin())
    {
        // ruleid:cpp-missing-authorization
        deleteFile("important_document.txt");
    }
}

void compliant1(User user, const std::string& filename)
{

    if (user.isAdmin() && user.hasDeletePermission(filename))
    {
         // ok:cpp-missing-authorization
        deleteFile(filename);
    }
    else
    {
        throw UnauthorizedAccessException();
    }
}

void nonCompliant2(std::string newPassword, User user)
 {
     // ruleid:cpp-missing-authorization
     if (!user.isPasswordOwner())
     {
         // Change password
          // ruleid:cpp-missing-authorization
         std::cout << "Password changed to: " << newPassword << std::endl;
     }
 }

void nonCompliant3(std::string fileName, User user)
{
    if (!user.hasReadPermissions(fileName))
    {
        // Log or throw an exception indicating lack of permission
        // ruleid:cpp-missing-authorization
        throw std::runtime_error("Insufficient permissions to read file: " + fileName);
    }
}

void nonCompliant4(std::string path)
{

    std::ofstream outfile;
    outfile.open(path, std::ios::binary);

    // Download file without any auth or permission checks
    // ruleid:cpp-missing-authorization
    http::Request request("http://example.com/file.dat");
    http::Response response = request.send();

    outfile << response.body();

    outfile.close();
}

void compliant2(User user)
{

    if (user.hasPermission(DELETE_FILE) && user.canDeleteFile("important_document.txt"))
    {
        // ok:cpp-missing-authorization
        deleteFile("important_document.txt");
    }
}

void nonCompliant6(std::string newPassword, User user)
{
    // Requires the user to be the owner of the password before changing it
    // ruleid:cpp-missing-authorization
    if (user.isPasswordOwner())
    {
        // Change password
        std::cout << "Password changed to: " << newPassword << std::endl;
    }
    else
    {
        throw UnauthorizedAccessException();
    }
}

void compliant3(std::string newPassword, User user)
{
    // ok:cpp-missing-authorization
    if (user.isPasswordOwner() && user.hasPermission(CHANGE_PASSWORD))
    {
        // Change password
        std::cout << "Password changed to: " << newPassword << std::endl;
    }
    else
    {
        throw UnauthorizedAccessException();
    }
}

void compliant4(std::string fileName, User user)
{
    // Attempts to open and read the file only if the user has read permissions

    if (user.hasReadPermissions(fileName))
    {
        std::ifstream file(fileName);
            // ok:cpp-missing-authorization
        if (file.is_open())
        {
            std::string line;
            while (std::getline(file, line))
            {
                // read file line by line
            }
            file.close();
        }
    }
    else
    {
        throw UnauthorizedAccessException();
    }
}

void nonCompliant7(std::string fileName, User user)
{

        std::ifstream file(fileName);
 // ruleid:cpp-missing-authorization
        if (file.is_open())
        {
            std::string line;
            while (std::getline(file, line))
            {

            }
            file.close();
        }

}

void compliant5(User user, File file)
{
    // Checks if the user has permission to download the specified file; throws an exception otherwise
    // ok:cpp-missing-authorization
    if (user.hasDownloadPermission(file))
    {
        // Download file
        http::Request request("http://example.com/file.dat");
        http::Response response = request.send();

        std::ofstream outfile("downloaded_file.dat", std::ios::binary);
    }
    else
    {
        throw UnauthorizedAccessException();
    }
}

 // ruleid:cpp-missing-authorization
void deleteUser(User& currentUser, User& targetUser) {

}

string nonCompliant8(string filename, User& user) {
    // ruleid:cpp-missing-authorization
    return readFromFileSystem(filename);
}

string compliant6(string filename, User& user) {
    if (user.isAuthenticated()) {
        if (user.hasReadAccess(filename)) {
            // ok:cpp-missing-authorization
            return readFromFileSystem(filename);
        } else {
            throw UnauthorizedAccessException();
        }
    } else {
        throw UnauthorizedAccessException();
    }
}

class AdminPanel {
private:
    std::string adminPassword;

public:
    AdminPanel(std::string password) : adminPassword(password) {}

    void changeSettings(std::string password) {
        if (password == adminPassword) {
            std::cout << "Settings changed successfully.\n";
        } else {
            std::cout << "Unauthorized access.\n";
        }
    }

       void changeSettings() {
        std::cout << "Settings changed successfully.\n";
    }
};

int compliant7() {
    AdminPanel adminPanel("password123");
    std::string userPassword;
    std::cout << "Enter admin password: ";
    std::cin >> userPassword;
    // ok:cpp-missing-authorization
    adminPanel.changeSettings(userPassword);

    return 0;
}

int nonCompliant9() {
    AdminPanel adminPanel("password123");
    // ruleid:cpp-missing-authorization
    adminPanel.changeSettings();

    return 0;
}

int main()
{
    // Write C++ code here
    std::cout << "Hello world!";

    return 0;
}
