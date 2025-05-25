#include <stdio.h>
#include <stdlib.h>
#include "graph.h"

typedef struct {
    long *items;
    long front, rear;
    long capacity;
} Queue;

Queue* createQueue(long capacity) {
    Queue* q = malloc(sizeof(Queue));
    q->items = malloc(capacity * sizeof(long));
    q->front = q->rear = 0;
    q->capacity = capacity;
    return q;
}

int isEmpty(Queue* q) {
    return q->front == q->rear;
}

void enqueue(Queue* q, long v) {
    if (q->rear == q->capacity) {
        fprintf(stderr, "Enqueue overflow\n");
        exit(EXIT_FAILURE);
    }
    q->items[q->rear++] = v;
}

int dequeue(Queue* q) {
    if (isEmpty(q)) {
        fprintf(stderr, "Dequeue on empty queue\n");
        exit(EXIT_FAILURE);
    }
    return q->items[q->front++];
}

void freeQueue(Queue* q) {
    free(q->items);
    free(q);
}

// Reconstruct the path from start to end using the parent array
void print_path(Graphe* graphe, long *parent, long start, long end) {
    long *stack = malloc((end - start + 1) * sizeof(long));
    long top = 0;
    long cur = end;

    while (cur != -1) {
        stack[top++] = cur;
        if (cur == start) break;
        cur = parent[cur];
    }

    if (cur == -1) {
        printf("No path found from %ld to %ld\n", start, end);
    } else {
        // Rebuild the path between the start and end
        printf("Path found from %ld to %ld : \n", graphe->sommets[start].id_article, graphe->sommets[end].id_article);
        for (long i = top - 1; i >= 0; i--) {
            printf("%ld", graphe->sommets[stack[i]].id_article);
            if (i > 0) printf(" -> ");
        }
        printf("\n");
    }

    free(stack);
}

// BFS with parent tracking
void bfs(Graphe* graphe, long start, long end) {
    long n = graphe->nombre_sommets;

    int* visited = malloc(n * sizeof(int));
    if (!visited) {
        perror("malloc visited");
        exit(EXIT_FAILURE);
    }

    // parent[v] will hold the parent of v in the BFS tree
    long* parent = malloc(n * sizeof(long));
    if (!parent) {
        perror("malloc parent");
        exit(EXIT_FAILURE);
    }
    for (long i = 0; i < n; i++) parent[i] = -1;

    Queue* q = createQueue(n);
    visited[start] = 1;
    enqueue(q, start);

    while (!isEmpty(q)) {
        long u = dequeue(q);

        if (u == end) {
            break;
        }

        Sommet* s = &graphe->sommets[u];
        long begin = s->debut_in_array;
        long count = s->nombre_aretes;

        for (long i = begin; i < begin + count; i++) {
            long v = graphe->aretes[i].id_article_arrival;
            if (visited[v] != 1) {
                visited[v] = 1;
                parent[v] = u;
                enqueue(q, v);
            }
        }
    }

    print_path(graphe, parent, start, end);

    free(visited);
    free(parent);
    freeQueue(q);
}
