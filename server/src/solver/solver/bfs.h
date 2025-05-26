#ifndef BFS_H
#define BFS_H

#include "graph.h"

// File d'attente (queue) pour le parcours en largeur
typedef struct {
    long *items;     // tableau des éléments
    long front;      // index du premier élément
    long rear;       // index du dernier élément
    long capacity;   // capacité maximale de la file
} Queue;

// Création et gestion de la file
Queue* createQueue(long capacity);
int   isEmpty(Queue* q);
void  enqueue(Queue* q, long v);
int   dequeue(Queue* q);
void  freeQueue(Queue* q);

// Reconstruction et affichage du chemin découvert
// parent : tableau des prédécesseurs pour chaque sommet
// depart : indice du sommet de départ
// objectif : indice du sommet d'arrivée
void print_path(Graphe* graphe, long *parent, long depart, long objectif);

// Fonction principale de l'algorithme BFS
// graphe   : pointeur vers le graphe
// depart   : indice du sommet de départ
// objectif : indice du sommet d'arrivée (arrêt anticipé possible)
void bfs(Graphe* graphe, long depart, long objectif);

#endif // BFS_H
