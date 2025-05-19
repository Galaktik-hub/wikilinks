#ifndef GRAPH_H
#define GRAPH_H

#include <stdio.h>
#include <stdlib.h>

// Taille du buffer pour la lecture des fichiers
#define BUFFER_SIZE 128

// Structures pour représenter un graphe
typedef struct {
    int id_article_depart;
    int id_article_arrival;
} Arete;

typedef struct {
    int id_article;
    int debut_in_array;
    int nombre_aretes;
} Sommet;

typedef struct {
    Sommet* sommets;      // Tableau dynamique pour les sommets
    int nombre_sommets;   // Nombre total de sommets
    int nombre_aretes;    // Nombre total d'arêtes
    Arete* aretes;        // Tableau dynamique pour les arêtes
} Graphe;

// Fonctions pour gérer le graphe
int initialiser_graphe(Graphe* graphe, int nombre_sommets, int nombre_aretes);
void liberer_graphe(Graphe* graphe);
int lire_fichier_et_creer_graphe(const char* chemin_fichier, Graphe* graphe);
void afficher_graphe(const Graphe* graphe);
void save_graphe_in_file(const Graphe* graphe, const char* chemin_fichier);

#endif // GRAPH_H
