export {};

declare global {
    interface Window {
        /**
         * Bridge exposed by the Android app to retrieve the location and save the username
         */
        AndroidApp?: {
            /**
             * Launches the native location request (resolves via onLocationReceived or onLocationError)
             */
            requestLocation: () => void;

            /**
             * Saves the username in the Android app
             */
            setUsername: (username: string) => void;

            /**
             * Retrieves the username from the Android app
             */
            getUsername: () => void;
        };

        /**
         * JS Callback called by Android when the location is received
         */
        onLocationReceived?: (coords: {latitude: number; longitude: number}) => void;

        /**
         * JS Callback called by Android when the location request fails
         */
        onLocationError?: (msg: string) => void;

        /**
         * JS Callback called by Android when the username is saved
         */
        onUsernameSaved?: () => void;

        /**
         * JS Callback called by Android when the username is received
         */
        onUsernameReceived?: (name: string) => void;
    }
}
