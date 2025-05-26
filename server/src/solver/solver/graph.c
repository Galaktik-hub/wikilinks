#include "graph.h"
#include <stdio.h>
#include <time.h>
#include <string.h>

int initialiser_graphe(Graphe* graphe, long nombre_sommets, long nombre_aretes) {
    graphe->nombre_sommets = nombre_sommets;
    graphe->nombre_aretes = nombre_aretes;
    graphe->sommets = malloc(sizeof(Sommet) * (nombre_sommets + 1)); // id 0 non utilisé
    graphe->aretes  = malloc(sizeof(Arete)  * nombre_aretes);
    graphe->map_id  = NULL; // init hash

    if (!graphe->sommets || !graphe->aretes) {
        fprintf(stderr, "Error while allocating memory for the graph.\n");
        return 1;
    }

    for (long i = 0; i <= nombre_sommets; i++) {
        graphe->sommets[i].id_article = -1;
		graphe->sommets[i].id_graphe = -1;
        graphe->sommets[i].debut_in_array = -1;
        graphe->sommets[i].nombre_aretes = 0;
    }

    for (long i = 0; i < nombre_aretes; i++) {
        graphe->aretes[i].id_article_depart = -1;
        graphe->aretes[i].id_article_arrival = -1;
    }

    return 0;
}

// Free the memory used by the graph
void liberer_graphe(Graphe* graphe) {
    MapEntry *current, *tmp;
    HASH_ITER(hh, graphe->map_id, current, tmp) {
        HASH_DEL(graphe->map_id, current);
        free(current);
    }

    free(graphe->sommets);
    free(graphe->aretes);
}

// Reads the file and creates the graph structure
int lire_fichier_et_creer_graphe(const char* chemin_fichier, Graphe* graphe) {
    FILE* fichier = fopen(chemin_fichier, "r");
    if (!fichier) {
        perror("Error opening file");
        return 1;
    }

    char ligne[BUFFER_SIZE];

    // Reading the first line to get the number of vertices and edges
    if (!fgets(ligne, sizeof(ligne), fichier)) {
        fprintf(stderr, "Error: file not correctly formatted.\n");
        fclose(fichier);
        return 1;
    }

    long nombre_sommets, nombre_aretes;
    if (sscanf(ligne, "%ld %ld", &nombre_sommets, &nombre_aretes) != 2) {
        fprintf(stderr, "Error: file not correctly formatted.\n");
        fclose(fichier);
        return 1;
    }

    if (initialiser_graphe(graphe, nombre_sommets, nombre_aretes) != 0)
        return 1;

    int lecture_aretes = 0;
    long idx_sommet = 0;
    long idx_arete = 0;

    while (fgets(ligne, sizeof(ligne), fichier)) {
        if (ligne[0] == '-') {
            lecture_aretes = 1;
            continue;
        }

        if (!lecture_aretes) {
            long id_article, id_graphe, debut, nb;
            if (sscanf(ligne, "%ld %ld %ld %ld", &id_article, &id_graphe, &debut, &nb) == 4) {
                Sommet* s = &graphe->sommets[idx_sommet];
                s->id_article     = id_article;
                s->id_graphe      = id_graphe;
                s->debut_in_array = debut;
                s->nombre_aretes  = nb;

                // Insert hash entry
                MapEntry* e = malloc(sizeof(MapEntry));
                e->id_article = id_article;
                e->id_graphe  = id_graphe;
                HASH_ADD_INT(graphe->map_id, id_article, e);

                idx_sommet++;
            }
        } else {
            long from, to;
            if (sscanf(ligne, "%ld %ld", &from, &to) == 2) {
                graphe->aretes[idx_arete].id_article_depart = from;
                graphe->aretes[idx_arete].id_article_arrival= to;
                idx_arete++;
            }
        }
    }

    fclose(fichier);

    return 0;
}

int find_id_graphe(const Graphe* graphe, long id_article) {
    MapEntry* e;
    HASH_FIND_INT(graphe->map_id, &id_article, e);
    return e ? e->id_graphe : -1;
}

void afficher_graphe(const Graphe* graphe) {
    printf("Graphe : %ld sommets, %ld arêtes\n",
           graphe->nombre_sommets, graphe->nombre_aretes);
    for (long i = 0; i < graphe->nombre_sommets; i++) {
        Sommet* s = &graphe->sommets[i];
        printf("Sommet id_article=%ld, id_graphe=%ld, %ld arêtes, debut=%ld\n",
               s->id_article, s->id_graphe,
               s->nombre_aretes, s->debut_in_array);
    }
    for (long i = 0; i < graphe->nombre_aretes; i++) {
        Arete* a = &graphe->aretes[i];
        printf("Arete %ld: %ld -> %ld\n",
               i, a->id_article_depart, a->id_article_arrival);
    }
}

void save_graphe_binaire(const Graphe* g, const char* path) {
    FILE* f = fopen(path, "wb");
    if (!f) {
        perror("Error opening binary file for writing");
        return;
    }

    // Header info
    fwrite(&g->nombre_sommets, sizeof(long), 1, f);
    fwrite(&g->nombre_aretes,  sizeof(long), 1, f);

    // Graph info
    fwrite(g->sommets, sizeof(Sommet), g->nombre_sommets+1, f);
    fwrite(g->aretes, sizeof(Arete), g->nombre_aretes, f);

    // Hash table info
    long map_size = HASH_COUNT(g->map_id);
    fwrite(&map_size, sizeof(long), 1, f);
    MapEntry* entry;
    for (entry = g->map_id; entry; entry = entry->hh.next) {
        fwrite(&entry->id_article, sizeof(long), 1, f);
        fwrite(&entry->id_graphe,  sizeof(long), 1, f);
    }

    fclose(f);
}

// Load a binary graph from a file with its corresponding hash table
int load_graphe_binaire(const char* path, Graphe* g) {
    FILE* f = fopen(path, "rb");
    if (!f) {
        perror("Error opening binary file");
        return 1;
    }

    long nbS, nbA;
    if (fread(&nbS, sizeof(long), 1, f)!=1 || fread(&nbA, sizeof(long), 1, f)!=1) {
        fprintf(stderr, "Error getting header info\n"); fclose(f); return 1;
    }
    initialiser_graphe(g, nbS, nbA);

    fread(g->sommets, sizeof(Sommet), nbS+1, f);
    fread(g->aretes,  sizeof(Arete),  nbA,   f);

    long map_size;
    fread(&map_size, sizeof(long), 1, f);
    for (long i = 0; i < map_size; i++) {
        MapEntry* e = malloc(sizeof(MapEntry));
        fread(&e->id_article, sizeof(long), 1, f);
        fread(&e->id_graphe,  sizeof(long), 1, f);
        HASH_ADD_INT(g->map_id, id_article, e);
    }

    fclose(f);
    return 0;
}