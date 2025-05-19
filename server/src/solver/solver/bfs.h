#ifndef BFS_H
#define BFS_H

#include <stdio.h>
#include <stdlib.h>
#include "graph.h"
#include "heap.h"

#define INF 1e9 // Infini pour les distances

// Structure pour un nœud dans l'algorithme A*
typedef struct {
    int sommet;          // Identifiant du sommet
    int parent;          // Parent dans le chemin pour la reconstitution
} Node;

// Reconstitution du chemin depuis le sommet de destination
void reconstituerChemin(Node* nodes, int depart, int objectif);

// Fonction principale de l'algorithme BFS
void bfs(Graphe* graphe, int depart, int objectif);

#endif