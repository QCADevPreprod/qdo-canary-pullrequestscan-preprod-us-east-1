using namespace std;
#include <iostream>
#include <mutex>
#include <thread>

std::mutex mutex_1;
std::mutex mutex_2;


void noncompliant1() {
    //ruleid: cpp-lock-consistency
    mutex_1.lock();
    mutex_2.lock();

    mutex_2.unlock();
    mutex_1.unlock();
}

void noncompliant2() {
    //ruleid: cpp-lock-consistency
    mutex_2.lock();
    mutex_1.lock();

    mutex_1.unlock();
    mutex_2.unlock();
}


std::mutex mutex_;

void noncompliant3() {
    //ruleid: cpp-lock-consistency
    mutex_.lock();
    mutex_.lock();
    mutex_.unlock();
    mutex_.unlock();
}

std::mutex mutex7, mutex8;

void safethreadFunction5() {
    //ok: cpp-lock-consistency
    std::scoped_lock lock(mutex7, mutex8);
    // Do some work with shared resources
}

void safethreadFunction6() {
    //ok: cpp-lock-consistency
    std::scoped_lock lock(mutex7, mutex8);  // Same consistent order
    // Do some work with shared resources
}

int compliant1() {
    std::thread t1(safethreadFunction5);
    std::thread t2(safethreadFunction6);

    t1.join();
    t2.join();

    return 0;
}

std::mutex mutex_1;
std::mutex mutex_2;

// no reports, std::lock magically avoids deadlocks
void compliant2() {
    //ok: cpp-lock-consistency
    std::lock<std::mutex>(mutex_1, mutex_2);
    mutex_1.unlock();
    mutex_2.unlock();
}

void compliant3() {
    //ok: cpp-lock-consistency
    std::lock<std::mutex>(mutex_2, mutex_1);
    mutex_2.unlock();
    mutex_1.unlock();
}


int main(){
  return 0;
}