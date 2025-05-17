export interface Location {
    latitude: number;
    longitude: number;
}

/**
 * Requests the user's location from the Android app.
 *
 * @returns A promise that resolves with the user's location (latitude and longitude).
 * @throws Error if the location cannot be retrieved.
 */
export async function getLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
        window.onLocationReceived = coords => {
            delete window.onLocationReceived;
            delete window.onLocationError;
            resolve(coords);
        };
        window.onLocationError = msg => {
            delete window.onLocationReceived;
            delete window.onLocationError;
            reject(new Error(msg));
        };

        // We request the location to the Android app
        if (window.AndroidApp?.requestLocation) {
            window.AndroidApp.requestLocation();
        } else {
            reject(new Error("Bridge Android non disponible"));
        }
    });
}

/**
 * Fetches the closest Wikipedia article to the given location using the Wikipedia API.
 *
 * @param location Object with latitude and longitude properties.
 * @returns A promise with the title of the closest Wikipedia article.
 * @throws Error if no article is found.
 */
export async function getClosestArticleFromLocation(location: Location): Promise<string> {
    // Prépare l’URL de l’API
    const {latitude, longitude} = location;

    const url = `https://fr.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${latitude}|${longitude}&gsradius=10000&gslimit=100&format=json&origin=*`;
    console.log("URL de l'API Wikipedia :", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Requête Wikipedia échouée (statut ${response.status})`);
        }

        const data = await response.json();
        const results = data?.query?.geosearch;
        if (!Array.isArray(results) || results.length === 0) {
            throw new Error("Aucun article géolocalisé trouvé");
        }

        // On retourne simplement le titre du premier résultat
        return results[0].title as string;
    } catch (err: unknown) {
        console.error("Erreur lors de la récupération de l'article :", err);
        // Remonter l’erreur pour le caller
        throw err instanceof Error ? err : new Error(String(err));
    }
}
