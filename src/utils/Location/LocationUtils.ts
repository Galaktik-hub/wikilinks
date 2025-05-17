export async function getLocation(): Promise<{latitude: number; longitude: number}> {
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