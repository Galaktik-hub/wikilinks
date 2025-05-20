/**
 * Saves the username in the Android application.
 *
 * @param {string} username The username to save.
 * @returns A promise that resolves `true` if the save was successful, or rejects with an error.
 */
export async function setUsername(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        window.onUsernameSaved = () => {
            resolve(true);
        };

        if (window.AndroidApp?.setUsername) {
            window.AndroidApp.setUsername(username);
        } else {
            reject(new Error("Bridge Android non disponible"));
        }
    });
}

/**
 * Fetches the username from the Android application.
 *
 * @returns A promise that resolves with the username, or rejects with an error.
 */
export async function getUsername(): Promise<string> {
    return new Promise((resolve, reject) => {
        window.onUsernameReceived = (name: string) => {
            resolve(name);
        };

        if (window.AndroidApp?.getUsername) {
            window.AndroidApp.getUsername();
        } else {
            reject(new Error("Bridge Android non disponible"));
        }
    });
}
