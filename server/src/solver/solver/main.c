#include "graph.h"
#include "astar.h"
#include <stdlib.h>

int main(int argc, char *argv[]) {
    // Vérifier le nombre d'arguments
    if (argc != 4) {
        fprintf(stderr, "Usage: %s <graph_file> <id_planet_departure> <id_planet_arrival>\n", argv[0]);
        return 1;
    }

    // Conversion des IDs des planètes en entiers
    int id_planet_departure = atoi(argv[2]);
    int id_planet_arrival = atoi(argv[3]);

    // Chargement du graphe
    Graphe graphe;
    if (lire_fichier_et_creer_graphe(argv[1], &graphe) != 0) {
        fprintf(stderr, "Erreur : impossible de lire ou de créer le graphe depuis le fichier %s.\n", argv[1]);
        return 1;
    }

    // Exécution de l'algorithme A*
    astar(&graphe, id_planet_departure, id_planet_arrival);

    // Sauvegarde du graphe (décommenter si nécessaire)
    // if (save_graphe_in_file(&graphe, "../data/graph_output.txt") != 0) {
    //     fprintf(stderr, "Erreur : impossible de sauvegarder le graphe dans le fichier spécifié.\n");
    // }

    // Libération des ressources
    liberer_graphe(&graphe);

    return 0;
}
