#include "graph.h"
#include "bfs.h"
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char* argv[]) {
    if (argc != 5) {
        fprintf(stderr, "Usage: %s <graph_file> <mode:0=txt->bin,1=bin->bfs> <id_depart> <id_arrival>\n", argv[0]);
        return 1;
    }

    // Fetching the arguments
    const char* file = argv[1];
    int mode = atoi(argv[2]);
    int id_dep = atoi(argv[3]);
    int id_arr = atoi(argv[4]);

    Graphe graphe;
    if (mode == 0) {
        // Reading a text file then creating the binary file for faster access
        printf("Starting to parse text file into a graph... %s\n", file);

        if (lire_fichier_et_creer_graphe(file, &graphe)) {
            fprintf(stderr, "Error reading txt file %s\n", file);
            return 1;
        }

        printf("Graph read: %d nodes, %d vertices\n", graphe.nombre_sommets, graphe.nombre_aretes);

        char outbin[256];
        snprintf(outbin,256, "%s.bin", file);
        save_graphe_binaire(&graphe, outbin);

        printf("Binary saved as: %s\n", outbin);
    } else {
        // Reading binary file and performing BFS
        if (load_graphe_binaire(file, &graphe)) {
            fprintf(stderr, "Error while opening bin %s\n", file);
            return 1;
        }

        int id_g_dep = find_id_graphe(&graphe, id_dep);
        int id_g_arr = find_id_graphe(&graphe, id_arr);

        if (id_g_dep < 0 || id_g_arr < 0) {
            fprintf(stderr, "ID not found in hash table: %d -> %d or %d -> %d\n", id_dep, id_g_dep, id_arr, id_g_arr);
            return 1;
        }

        bfs(&graphe, id_g_dep, id_g_arr);
    }

    liberer_graphe(&graphe);

    return 0;
}
