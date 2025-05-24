#ifndef TWINHEAP_H
#define TWINHEAP_H

#include "stdlib.h"
#include "stdio.h"
#include "assert.h"

typedef int Key;
typedef struct {
    int key;
    int indexInHeap;
} Data;

typedef struct {
    int len;
    int* heap;
    Data* data;
} TwinHeap;

#define None -1

// Q1: Initialize a new TwinHeap structure
TwinHeap newTwinHeap(int len, Key defaultKey);

// Q2: Check if an index is a valid node in the heap
int existsInHeap(TwinHeap th, int i);

// Q3: Test if the heap is empty
int emptyHeap(TwinHeap th);

// Parent and children node indices
int parent(int i);
int lChild(int i);
int rChild(int i);

// Q4: Get the key for a node with a given heap index
int key(TwinHeap th, int heapIndex);

// Pretty print of the twin heap
void printNiceHeap(TwinHeap th);

// Q5: Swap contents of two heap nodes
void swap(TwinHeap th, int i, int j);

// Q6: Check the heap condition upwards
void cleanUp(TwinHeap th, int i);

// Q7: Check the heap condition downwards
void cleanDown(TwinHeap th, int i);

// Q8: Change a key in the data array
void editKey(TwinHeap th, int di, Key newKey);

// Q9: Remove a node from the heap
void removeNode(TwinHeap th, int i);

// Q10: Return the index of the element with the smallest key and remove it
int popMinimum(TwinHeap th);

#endif // TWINHEAP_H
