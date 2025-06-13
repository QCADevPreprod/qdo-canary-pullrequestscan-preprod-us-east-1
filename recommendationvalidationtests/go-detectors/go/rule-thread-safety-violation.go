package main

import (
	"fmt"
	"sync"
)

func nonCompliant1(){
    var counter int
    var wg sync.WaitGroup

    for i:=0; i < 1000; i++{
        wg.Add(1)
        go func() {
            // ruleid: rule-thread-safety-violation
            counter ++ // Increment without synchronization
            wg.Done()
        }()
    }
    wg.Wait()
}

func compliant1(){
    var counter int
    var wg sync.WaitGroup
    var mu sync.Mutex
    for i:=0; i < 1000; i++{
        wg.Add(1)
        go func() {
            mu.Lock()   // Lock the mutex to ensure exclusive access
            // ok: rule-thread-safety-violation
            counter ++  // Increment the counter
            mu.Unlock() // Unclock the mutex
            wg.Done()
        }()
    }
    wg.Wait()
}
