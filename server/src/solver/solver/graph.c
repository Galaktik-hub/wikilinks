#include "graph.h"

// Initialise le graphe avec un nombre défini de sommets et d'arêtes
int initialiser_graphe(Graphe* graphe, int nombre_sommets, int nombre_aretes) {
    graphe->nombre_sommets = nombre_sommets;
    graphe->nombre_aretes = nombre_aretes;
    graphe->sommets = (Sommet*)malloc(sizeof(Sommet) * (nombre_sommets + 1)); // id 0 non utilisé
    graphe->aretes = (Arete*)malloc(sizeof(Arete) * nombre_aretes);

    if (!graphe->sommets || !graphe->aretes) {
        fprintf(stderr, "Erreur d'allocation mémoire pour le graphe.\n");
        return 1;
    }

    for (int i = 0; i <= nombre_sommets; i++) {
        graphe->sommets[i].id_article = -1;
		graphe->sommets[i].id_graphe = -1;
        graphe->sommets[i].debut_in_array = -1;
        graphe->sommets[i].nombre_aretes = 0;
    }

    for (int i = 0; i < nombre_aretes; i++) {
        graphe->aretes[i].id_article_depart = -1;
        graphe->aretes[i].id_article_arrival = -1;
    }

    return 0;
}

// Libère la mémoire utilisée par le graphe
void liberer_graphe(Graphe* graphe) {
    free(graphe->sommets);
    graphe->sommets = NULL;
    free(graphe->aretes);
    graphe->aretes = NULL;
}

// Lecture du fichier et création dynamique du graphe
int lire_fichier_et_creer_graphe(const char* chemin_fichier, Graphe* graphe) {
    FILE* fichier = fopen(chemin_fichier, "r");
    if (!fichier) {
        perror("Erreur d'ouverture du fichier");
        return 1;
    }

    char ligne[BUFFER_SIZE];

    // Lire la première ligne pour récupérer les informations
    if (!fgets(ligne, sizeof(ligne), fichier)) {
        fprintf(stderr, "Erreur : fichier vide ou format incorrect.\n");
        fclose(fichier);
        return 1;
    }

    int nombre_aretes, nombre_sommets;
    if (sscanf(ligne, "%d %d", &nombre_aretes, &nombre_sommets) != 2) {
        fprintf(stderr, "Erreur : format de la première ligne incorrect.\n");
        fclose(fichier);
        return 1;
    }

    if (initialiser_graphe(graphe, nombre_sommets, nombre_aretes) != 0)
        return 1;

    int lecture_arretes = 0;
    int index_arete = 0;
	int index_sommet = 0;

    while (fgets(ligne, sizeof(ligne), fichier)) {
        if (ligne[0] == '-') {
            lecture_arretes = 1;
            continue;
        }

        if (!lecture_arretes) {
            int id_article, id_graphe, debut_in_array, nombre_aretes_sommet;
            if (sscanf(ligne, "%d %d %d %d", &id_article, &id_graphe, &debut_in_array, &nombre_aretes_sommet) == 3) {
				graphe->sommets[index_sommet].id_graphe = id_graphe;
                graphe->sommets[index_sommet].id_article = id_article;
                graphe->sommets[index_sommet].debut_in_array = debut_in_array;
                graphe->sommets[index_sommet].nombre_aretes = nombre_aretes_sommet;
            }
			index_sommet++;
        } else {
            int id_article_depart, id_article_arrival;
            if (sscanf(ligne, "%d %d", &id_article_depart, &id_article_arrival) == 2) {
                graphe->aretes[index_arete].id_article_depart = id_article_depart;
                graphe->aretes[index_arete].id_article_arrival = id_article_arrival;
                index_arete++;
            }
        }
    }

    fclose(fichier);

    return 0;
}

// Affiche le graphe
void afficher_graphe(const Graphe* graphe) {
    printf("Graphe : %d sommets, %d arêtes\n", graphe->nombre_sommets, graphe->nombre_aretes);

    for (int i = 0; i < graphe->nombre_sommets + 1; i++) {
        const Sommet* sommet = &graphe->sommets[i];
        printf("Sommet %d : %d arêtes, début à l'index %d\n",
               sommet->id_article,
               sommet->nombre_aretes,
               sommet->debut_in_array);
    }

    for (int i = 0; i < graphe->nombre_aretes; i++) {
        const Arete* arete = &graphe->aretes[i];
        printf("Arête %d : départ %d, arrivée %d\n",
               i, arete->id_article_depart, arete->id_article_arrival);
    }
}

// Sauvegarde le graphe dans un fichier
void save_graphe_in_file(const Graphe* graphe, const char* chemin_fichier) {
    FILE* fichier = fopen(chemin_fichier, "w");
    if (!fichier) {
        perror("Erreur lors de l'ouverture du fichier pour l'écriture");
        return;
    }

    fprintf(fichier, "Graphe : %d sommets, %d arêtes\n", graphe->nombre_sommets, graphe->nombre_aretes);

    for (int i = 0; i < graphe->nombre_sommets; i++) {
        const Sommet* sommet = &graphe->sommets[i];
        fprintf(fichier, "Sommet %d : %d arêtes, début à l'index %d\n",
                sommet->id_article,
                sommet->nombre_aretes,
                sommet->debut_in_array);
    }

    for (int i = 0; i < graphe->nombre_aretes; i++) {
        const Arete* arete = &graphe->aretes[i];
        fprintf(fichier, "Arête %d : départ %d, arrivée %d\n",
                i, arete->id_article_depart, arete->id_article_arrival);
    }

    fclose(fichier);
    printf("Graphe enregistré dans le fichier : %s\n", chemin_fichier);
}
