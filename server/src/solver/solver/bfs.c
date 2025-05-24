#include <stdio.h>
#include <stdlib.h>
#include "graph.h"

typedef struct {
    int *items;
    int front, rear;
    int capacity;
} Queue;

Queue* createQueue(int capacity) {
    Queue* q = malloc(sizeof(Queue));
    q->items = malloc(capacity * sizeof(int));
    q->front = q->rear = 0;
    q->capacity = capacity;
    return q;
}

int isEmpty(Queue* q) {
    return q->front == q->rear;
}

void enqueue(Queue* q, int v) {
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
void print_path(Graphe* graphe, int *parent, int start, int end) {
    int *stack = malloc((end - start + 1) * sizeof(int));
    int top = 0;
    int cur = end;

    while (cur != -1) {
        stack[top++] = cur;
        if (cur == start) break;
        cur = parent[cur];
    }

    if (cur == -1) {
        printf("No path found from %d to %d\n", start, end);
    } else {
        // Rebuild the path between the start and end
        printf("Path found from %d to %d : \n", graphe->sommets[start].id_article, graphe->sommets[end].id_article);
        for (int i = top - 1; i >= 0; i--) {
            printf("%d", graphe->sommets[stack[i]].id_article);
            if (i > 0) printf(" -> ");
        }
        printf("\n");
    }

    free(stack);
}

// BFS with parent tracking
void bfs(Graphe* graphe, int start, int end) {
    int n = graphe->nombre_sommets;

    char* visited = calloc(n, sizeof(char));
    if (!visited) {
        perror("calloc visited");
        exit(EXIT_FAILURE);
    }

    // parent[v] will hold the parent of v in the BFS tree
    int* parent = malloc(n * sizeof(int));
    if (!parent) {
        perror("malloc parent");
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) parent[i] = -1;

    Queue* q = createQueue(n);
    visited[start] = 1;
    enqueue(q, start);

    while (!isEmpty(q)) {
        int u = dequeue(q);

        if (u == end) {
            break;
        }

        Sommet* s = &graphe->sommets[u];
        int begin = s->debut_in_array;
        int count = s->nombre_aretes;

        for (int i = begin; i < begin + count; i++) {
            int v = graphe->aretes[i].id_article_arrival;
            if (!visited[v]) {
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
