#ifndef BFS_H
#define BFS_H

#include "graph.h"

// File d'attente (queue) pour le parcours en largeur
typedef struct {
    int *items;     // tableau des éléments
    int front;      // index du premier élément
    int rear;       // index du dernier élément
    int capacity;   // capacité maximale de la file
} Queue;

// Création et gestion de la file
Queue* createQueue(int capacity);
int   isEmpty(Queue* q);
void  enqueue(Queue* q, int v);
int   dequeue(Queue* q);
void  freeQueue(Queue* q);

// Reconstruction et affichage du chemin découvert
// parent : tableau des prédécesseurs pour chaque sommet
// depart : indice du sommet de départ
// objectif : indice du sommet d'arrivée
void print_path(Graphe* graphe, int *parent, int depart, int objectif);

// Fonction principale de l'algorithme BFS
// graphe   : pointeur vers le graphe
// depart   : indice du sommet de départ
// objectif : indice du sommet d'arrivée (arrêt anticipé possible)
void bfs(Graphe* graphe, int depart, int objectif);

#endif // BFS_H
