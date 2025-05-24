#ifndef GRAPH_H
#define GRAPH_H

#include "uthash.h"

#define BUFFER_SIZE 128

typedef struct {
    int id_article_depart;
    int id_article_arrival;
} Arete;

typedef struct {
    int id_article;
    int id_graphe;
    int debut_in_array;
    int nombre_aretes;
} Sommet;

// Entry of the hash table for mapping article IDs to graph IDs
typedef struct MapEntry {
    int id_article;
    int id_graphe;
    UT_hash_handle hh;
} MapEntry;

typedef struct {
    Sommet* sommets;
    int nombre_sommets;
    int nombre_aretes;
    Arete* aretes;
    MapEntry* map_id;
} Graphe;

int initialiser_graphe(Graphe* graphe, int nombre_sommets, int nombre_aretes);
void liberer_graphe(Graphe* graphe);
int lire_fichier_et_creer_graphe(const char* chemin_fichier, Graphe* graphe);
void afficher_graphe(const Graphe* graphe);
void save_graphe_in_file(const Graphe* graphe, const char* chemin_fichier);
void save_graphe_binaire(const Graphe* g, const char* path);
int load_graphe_binaire(const char* path, Graphe* g);
int find_id_graphe(const Graphe* graphe, int id_article);

#endif // GRAPH_H
