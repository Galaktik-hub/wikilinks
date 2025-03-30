export type GameType = 'public' | 'private';

export interface GameSettings {
    timeLimit: number;
    numberOfArticles: number;
    maxPlayers: number;
    type: GameType;
}