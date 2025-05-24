#include "heap.h"

/* Q1: 
    newTwinHeap: init new twinHEap struct, 
        allocate heap and data arrays, 
        fill-in heap with simple order (array index = heap index)
        fill-in keys with default value given in parameter
*/
TwinHeap newTwinHeap(int len, Key defaultKey) {
    TwinHeap th;

    if (len < 1) exit(EXIT_FAILURE);
    th.len = len;
    
    th.heap = (int*) malloc(th.len * sizeof(int));
    if (th.heap == NULL) {
        exit(EXIT_FAILURE);
    }
    
    th.data = (Data*) malloc(th.len * sizeof(Data));
    if (th.data == NULL) {
        free(th.heap);
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < len; i++) {
        th.heap[i] = i;
        th.data[i].key = defaultKey;
        th.data[i].indexInHeap = i;
    }
    return th;
}

// Q2 check that an index is a valid node in the heap
// (in bounds, and not "None")

int existsInHeap(TwinHeap th, int i) {
    return i >= 0 && i < th.len && th.heap[i] != None;
}

//Q3 tests if the heap is empty 
int emptyHeap(TwinHeap th) {
    return th.heap[0] == None;
}

// index of parent and children nodes in the heap
int parent(int i) { 
    if (i == 0) return -1;
    return (i-1)/2; 
}

int lChild(int i) { 
    return 2*i + 1; 
}

int rChild(int i) { 
    return 2*i + 2;
}

// Q4 return the key for a node with given heap index (error if not in heap)
int key(TwinHeap th, int heapIndex) {
    assert(existsInHeap(th, heapIndex));
    return th.data[th.heap[heapIndex]].key;
}


// pretty print of twin heap (aux. function)
void printNiceHeap_aux(TwinHeap th, int index, int depth) {
    if (!existsInHeap(th, index))
        return; 
    printf("     %d         ", index);
    printf("%*s", depth, "");
    printf("%d [key=%d]\n", th.heap[index], key(th, index));
    printNiceHeap_aux(th, lChild(index), depth+1);
    printNiceHeap_aux(th, rChild(index), depth+1);    
}

// pretty print of twin heap (main function)
void printNiceHeap(TwinHeap th) {
    printf("heapIndex  dataIndex\n");
    printNiceHeap_aux(th, 0, 0);
}


// Q5 swap contents of two heap nodes i and j 
void swap(TwinHeap th, int i, int j) {
    assert(existsInHeap(th, i) && existsInHeap(th, j));

    int temp = th.heap[i];
    th.heap[i] = th.heap[j];
    th.heap[j] = temp;

    th.data[th.heap[i]].indexInHeap = i;
    th.data[th.heap[j]].indexInHeap = j;
}

//Q6 check the heap condition on a node wrt. its parent (swap if necessary), then continue upwards
void cleanUp(TwinHeap th, int i) {
    if (i > 0) {
        int p = parent(i);
        if (key(th, p) > key(th, i)) {
            swap(th, p, i);
            cleanUp(th, p);
        }
    }
}

//Q7 check the heap condition on a node wrt. its children (swap if necessary), then continue downwards
void cleanDown(TwinHeap th, int i) {
    if (existsInHeap(th, i)) {
        int left = lChild(i);
        int right = rChild(i);
        if (existsInHeap(th, left) && existsInHeap(th, right)) {
            int smallest = key(th, left) < key(th, right) ? left : right;
            if (key(th, smallest) < key(th, i)) {
                swap(th, smallest, i);
                cleanDown(th, smallest);
            }
        } 
        if (existsInHeap(th, right)) {
            if (key(th, right) < key(th, i)) {
                swap(th, right, i);
                cleanDown(th, right);
            }
        } 
        if (existsInHeap(th, left)) {
            if (key(th, left) < key(th, i)) {
                swap(th, left, i);
                cleanDown(th, left);
            }
        } 
    }
}

//Q8 change a key in the data array (di )
void editKey(TwinHeap th, int di, Key newKey) {
    if (existsInHeap(th, di)) {
        int oldKey = th.data[di].key;
        th.data[di].key = newKey;
        if (newKey > oldKey) {
            cleanDown(th, di);
        } else {
            cleanUp(th, di);
        }
    }
}

//Q9 remove a node from the heap, swap children upwards to fil the gap
void removeNode(TwinHeap th, int i) {
    if (existsInHeap(th, i)) {
        int lastIndex = th.len - 1;
        swap(th, i, lastIndex);

        th.heap[lastIndex] = None;
        th.data[th.heap[lastIndex]].indexInHeap = None;

        if (i > 0 && key(th, i) < key(th, parent(i))) {
            cleanUp(th, i);
        } else {
            cleanDown(th, i);
        }
    }
}

//Q10 return the index (in data array) of the element with the smallest key, remove it from the heap.
int popMinimum(TwinHeap th) {
    assert(!emptyHeap(th));

    int smallestDataIndex = th.heap[0];
    th.data[smallestDataIndex].key = None;

    int i = 0;
    while (1) {
        int left = lChild(i);
        int right = rChild(i);

        if (!existsInHeap(th, right) && !existsInHeap(th, left)) break;

        int smallestChild = existsInHeap(th, left) ? left : right;
        if (existsInHeap(th, right) && key(th, right) < key(th, smallestChild)) {
            smallestChild = right;
        }

        swap(th, i, smallestChild);
        i = smallestChild;
    }

    th.heap[i] = None;
    th.data[smallestDataIndex].indexInHeap = None;

    return smallestDataIndex;
}
