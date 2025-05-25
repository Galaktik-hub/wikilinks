#ifndef GRAPH_H
#define GRAPH_H

#include "uthash.h"

#define BUFFER_SIZE 128

typedef struct {
    long id_article_depart;
    long id_article_arrival;
} Arete;

typedef struct {
    long id_article;
    long id_graphe;
    long debut_in_array;
    long nombre_aretes;
} Sommet;

// Entry of the hash table for mapping article IDs to graph IDs
typedef struct MapEntry {
    long id_article;
    long id_graphe;
    UT_hash_handle hh;
} MapEntry;

typedef struct {
    Sommet* sommets;
    long nombre_sommets;
    long nombre_aretes;
    Arete* aretes;
    MapEntry* map_id;
} Graphe;

int initialiser_graphe(Graphe* graphe, long nombre_sommets, long nombre_aretes);
void liberer_graphe(Graphe* graphe);
int lire_fichier_et_creer_graphe(const char* chemin_fichier, Graphe* graphe);
void afficher_graphe(const Graphe* graphe);
void save_graphe_in_file(const Graphe* graphe, const char* chemin_fichier);
void save_graphe_binaire(const Graphe* g, const char* path);
int load_graphe_binaire(const char* path, Graphe* g);
int find_id_graphe(const Graphe* graphe, long id_article);

#endif // GRAPH_H
