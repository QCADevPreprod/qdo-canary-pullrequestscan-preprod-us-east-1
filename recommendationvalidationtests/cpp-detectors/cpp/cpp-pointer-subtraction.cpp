
using namespace std;

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <iostream>


void noncompliant1(char *tmp, char *ptr1, char *ptr2)
{
    // ruleid: cpp-pointer-subtraction
    memcpy(tmp, ptr1, (ptr2 - ptr1) - 1);
}


void noncompliant2(char *ptr1, char *ptr2)
{
    // ruleid: cpp-pointer-subtraction
    char *tmp = (char *)malloc(ptr2 - ptr1);
}


struct node {
    int data;
    struct node* next;
};


int noncompliant3(struct node* head)
{
    struct node *current = head;
    struct node *tail;

    while (current != NULL) {
        tail = current;
        current = current->next;
    }

    // ruleid: cpp-pointer-subtraction
    return tail - head;
}

void noncompliant4(int *size1, int *size2)
{
    // ruleid: cpp-pointer-subtraction
    int *tmp = (int *)malloc(size2 - size1);
}

void noncompliant5(MyClass *obj1, MyClass *obj2)
{
	// ruleid: cpp-pointer-subtraction
	MyClass *obj3 = (MyClass *)malloc(obj2-obj1);
}

void compliant1(char *tmp, char *ptr1, char *ptr2)
{
    // ok: cpp-pointer-subtraction
    memcpy(tmp, ptr1, 2);
}

void compliant2(char *ptr1, char *ptr2)
{
    // ok: cpp-pointer-subtraction
    char *tmp = (char *)malloc(2);
}

int compliant3(struct node* head) {

    struct node* current = head;
    int count = 0;
    while (current != NULL) {
    count++;
    current = current->next;
    }
    // ok: cpp-pointer-subtraction
    return count;
}


int main()
{
    printf("Hello, World!");
    return 0;
}
