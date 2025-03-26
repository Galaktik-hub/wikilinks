import { randomInt } from "node:crypto";

export type GameType = 'public' | 'private';

export interface GameSession {
    id: string;              // Identifiant unique entre 100000 et 999999
    timeLimit: number;       // Temps imparti en minutes
    numberOfArticles: number;
    maxPlayers: number;
    type: GameType;
    leader: string;          // Le chef de la partie
    players: Set<string>;    // L'ensemble des joueurs
}

const gameSessions: Map<string, GameSession> = new Map();

/**
 * Crée une nouvelle partie avec les paramètres fournis.
 * Génère un identifiant unique pour la partie (entre 100000 et 999999).
 */
export function createGameSession(params: {
    timeLimit: number,
    numberOfArticles: number,
    maxPlayers: number,
    type: GameType,
    leader: string
}): GameSession {
    let id: string;
    do {
        id = randomInt(100000, 1000000).toString();
    } while (gameSessions.has(id));

    // Créer la partie en enregistrant le leader dans la liste des joueurs
    const session: GameSession = {
        id,
        timeLimit: params.timeLimit,
        numberOfArticles: params.numberOfArticles,
        maxPlayers: params.maxPlayers,
        type: params.type,
        leader: params.leader,
        players: new Set([params.leader])
    };

    gameSessions.set(id, session);
    return session;
}

/**
 * Ajoute un joueur à la partie si la capacité maximale n'est pas dépassée.
 * Renvoie true en cas de succès, false sinon.
 */
export function addPlayer(sessionId: string, playerName: string): boolean {
    const session = gameSessions.get(sessionId);
    if (!session) return false;
    if (session.players.size >= session.maxPlayers) return false;
    session.players.add(playerName);
    return true;
}

/**
 * Retire un joueur de la partie.
 * Le chef (leader) ne peut pas être retiré via cette fonction.
 */
export function removePlayer(sessionId: string, playerName: string): boolean {
    const session = gameSessions.get(sessionId);
    if (!session) return false;
    if (playerName === session.leader) return false;
    return session.players.delete(playerName);
}

/**
 * Clôture la partie et supprime la session.
 */
export function endGameSession(sessionId: string): boolean {
    return gameSessions.delete(sessionId);
}

/**
 * Récupère la partie correspondant à l'identifiant fourni.
 */
export function getGameSession(sessionId: string): GameSession | undefined {
    return gameSessions.get(sessionId);
}
