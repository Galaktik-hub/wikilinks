export {};

declare global {
    interface Window {
        /**
         * Bridge exposé par l'application Android pour récupérer la localisation
         */
        AndroidApp?: {
            /**
             * Lance la requête native de localisation (résout via _onLocationReceived ou _onLocationError)
             */
            requestLocation: () => void;
        };

        /**
         * Callback JS appelé par Android en cas de succès
         */
        onLocationReceived?: (coords: {latitude: number; longitude: number}) => void;

        /**
         * Callback JS appelé par Android en cas d'erreur
         */
        onLocationError?: (msg: string) => void;
    }
}
