/**
 * To tell the app that the user has already played today.
 */
export async function setPlayedToday(): Promise<void> {
    return new Promise((_resolve, reject) => {
        if (window.AndroidApp?.setTodayChallengePlayed()) {
            window.AndroidApp.setTodayChallengePlayed();
        } else {
            reject(new Error("Bridge Android non disponible"));
        }
    });
}

/**
 * Fetches if the player has already played today.
 *
 * @returns A promise that resolves with `true` if the player has already played today, or rejects with an error.
 */
export async function hasPlayedToday(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        window.onTodayChallengePlayed = (hasPlayed: boolean) => {
            resolve(hasPlayed);
        };

        if (window.AndroidApp?.isTodayChallengePlayed) {
            window.AndroidApp.isTodayChallengePlayed();
        } else {
            reject(new Error("Bridge Android non disponible"));
        }
    });
}
