
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <cstdio>
#include <string>
#include <sys/wait.h>
#include <unistd.h>
#include <cctype>

using namespace std;

const int CMD_MAX = 1024;

int noncompliant1(int argc, char **argv)
{
    char cmd[CMD_MAX] = "/usr/bin/cat ";
    // Concatenation of Untrusted Data directly to a command string without proper validation or sanitization.
    strcat(cmd, argv[1]);
    // ruleid: cpp-command-injection
    system(cmd);
    return 0;
}

int nonCompliant2()
{
    std::string userdata;
    std::cin >> userdata;
    char cmd[100];
    sprintf(cmd, "grep '%s' file.txt", userdata.c_str());
    // Non-Compliant: Untrusted user input passed into `system` methods.
    // ruleid: cpp-command-injection
    system(cmd);
    return 0;
}

int compliant()
{
    std::string userinput = "file.txt";
    std::string command = "cat " + userinput;
    // Non-Compliant: Untrusted user input passed
    // ok: cpp-command-injection
    system(command.c_str());
    return 0;
}

int nonCompliant4()
{
    std::string userinput;
    std::cin >> userinput;
    // Non-Compliant: Untrusted user input passed into `execl` methods.
    // ruleid: cpp-command-injection
    execl("/bin/sh", "sh", "-c", userinput.c_str(), NULL);
    return 1;
}

int nonCompliant5()
{
    std::string userinput;
    std::cin >> userinput;
    // Non-Compliant: user input is directly passed as a command to popen methods
    // ruleid: cpp-command-injection
    FILE *fp = popen(userinput.c_str(), "r");
    pclose(fp);
    return 0;
}

int compliant1(int argc, char **argv)
{
    // Validate the user input before constructing the command
    if (argc < 2 || strchr(argv[1], '/') != nullptr || strchr(argv[1], '.') != nullptr)
    {
        std::cerr << "Usage: " << argv[0] << " <filename>" << std::endl;
        return 1;
    }
    // ok: cpp-command-injection
    execl("/usr/bin/cat", "cat", argv[1], nullptr);

    // execl only returns if an error occurs
    perror("execl");
    return 1;
}

std::string sanitizer(const std::string &input)
{
    // Remove any characters that are not alphanumeric or allowed special characters
    std::string sanitizedInput;
    for (char ch : input)
    {
        if (std::isalnum(ch) || ch == '_' || ch == '-' || ch == '.')
        {
            sanitizedInput += ch;
        }
    }
    return sanitizedInput;
}

int compliant2()
{
    std::string filename;
    std::cout << "Enter a filename: ";
    std::cin >> filename;
    // before constructing the command using sanitzer function sanitize the user input file name
    std::string command = "ls " + sanitizer(filename);
    // ok:cpp-command-injection
    system(command.c_str());

    return 0;
}

int compliant3()
{
    // use of fork and execvp provides a safer alternative avoid command injection
    pid_t pid = fork();
    if (pid == 0)
    {
        // Child process
        const char *args[] = {"ls", "-l", nullptr};
        // ok: cpp-command-injection
        execvp("ls", const_cast<char *const *>(args));
    }
    else if (pid > 0)
    {
        // Parent process
        waitpid(pid, nullptr, 0);
    }
    return 0;
}

int compliant4()
{
    std::string file_input = "file.txt";
    std::string command = "cat " + file_input;
    //`popen` to open a process by creating a pipe and doesn't execute a shell directly
    // ok: cpp-command-injection
    FILE *fp = popen(command, "r");
    if (fp)
    {
        // Process the file pointer (fp) safely
        pclose(fp);
    }
    return 0;
}

int compliant5()
{
    char *args[] = {"ls", "-l", nullptr};
    // use of `execvp` to execute the "ls" command with predefined arguments.
    // ok: cpp-command-injection
    execvp("ls", args);
    return 0;
}



void invoke1(char *string)
	{
		char buf[] = "uname -a; id";
		// {fact rule=os-command-injection@v1.0 defects=0}
		// ok: cpp-command-injection
		system(buf);
		// {/fact}

		// {fact rule=os-command-injection@v1.0 defects=0}
		// ok: cpp-command-injection
		system("whoami");
		// {/fact}

		// {fact rule=os-command-injection@v1.0 defects=1}
		// ruleid: cpp-command-injection
		system(string);
		// {/fact}
	}

	void invoke2(char *string)
	{
		char buf[] = "uname -a; id";
		// {fact rule=os-command-injection@v1.0 defects=0}
		// ok: cpp-command-injection
		popen(buf, "r");
		// {/fact}

		// {fact rule=os-command-injection@v1.0 defects=0}
		// ok: cpp-command-injection
		popen("whoami", "r");
		// {/fact}

		// {fact rule=os-command-injection@v1.0 defects=1}
		// ruleid: cpp-command-injection
		popen(string, "r");
		// {/fact}
	}

	int send_mail(char *user)
	{
		char buf[1024];
		FILE *fp;

		snprintf(buf, sizeof(buf), "/usr/bin/sendmail -s \"hi\" %s", user);

		// {fact rule=os-command-injection@v1.0 defects=1}
		// ruleid: cpp-command-injection
		fp = popen(buf, "w");
		// {/fact}

		if (fp == NULL)
				return 1;
		// ...
		return 1;
	}

char *userName = argv[2];

void nonCompliant6()
{
    // BAD: a string from the user is injected directly into
    // a command line.
    char command1[1000] = {0};
    sprintf(command1, "userinfo -v \"%s\"", userName);
    // ruleid: cpp-command-injection
    system(command1);
}

void compliant6()
{
    char userNameQuoted[1000] = {0};
    encodeShellString(userNameQuoted, 1000, userName);
    char command2[1000] = {0};
    sprintf(command2, "userinfo -v %s", userNameQuoted);
    // ok: cpp-command-injection
    system(command2);
}

int osCommandInjectionCompliant() {
    std::string filename;
    std::cout << "Enter a filename: ";
    std::cin >> filename;

    std::string command = "ls " + sanitize(filename);
    // ok: cpp-command-injection
    system(command.c_str());

    return 0;
}


int osCommandInjectionCompliant() {
    std::string filename;
    std::cout << "Enter a filename: ";
    std::cin >> filename;

    if (isValid(filename)) {
        std::string command = "ls " + filename;
        // Compliant: Validating the use input before passing into `system` method.
        // ok: cpp-command-injection
        system(command.c_str());
    }

    return 0;
}

int main()
{
    cout << "Hello World";

    return 0;
}