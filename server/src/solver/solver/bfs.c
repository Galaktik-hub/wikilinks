#include <stdio.h>
#include <assert.h>
#include <math.h>
#include "graph.h"
#include "heap.h"

#define INF 1e9 // Infini pour les distances

// Structure pour un nœud dans l'algorithme A*
typedef struct {
    int sommet;          // Identifiant du sommet
    int parent;          // Parent dans le chemin pour la reconstitution
    int cout;            // Coût du chemin depuis le départ
} Node;

// Reconstitution du chemin depuis le sommet de destination
void reconstituerChemin(Node* nodes, int depart, int objectif) {
    int current = objectif;

    assert(current != -1);

    printf("Chemin:");
    while (current != depart) {
        assert(current != -1);
        printf("%d<-", current);
        current = nodes[current].parent;
    }
    printf("%d\n", depart);
}

// Fonction principale de l'algorithme A*
void astar(Graphe* graphe, int depart, int objectif) {
    if (objectif >= graphe->nombre_sommets || objectif < 0 || depart >= graphe->nombre_sommets || depart < 0) {
        fprintf(stderr, "One of the two IDs does not match any planet: departure %d, arrival %d\n", depart, objectif);
        exit(1);
    }



    printf("Aucun chemin n'a été trouvé de %d à %d.\n", depart, objectif);
}