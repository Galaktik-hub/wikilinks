import { Player } from "../player/player";
import {WikipediaService} from "../WikipediaService";
import {GameSettings} from "./gameSettings";

export class GameSession {
    public id: number;
    public gameSettings: GameSettings;
    public leader: Player;
    public players: Set<Player>;
    public articles: string[];
    public startArticle: string;

    constructor(
        id: number,
        leader: Player,
        gameSettings: GameSettings,
    ) {
        this.id = id;
        this.gameSettings = gameSettings;
        this.players = new Set([leader]);
        this.articles = [];
        this.startArticle = "";
    }

    /**
     * Adds a player to the session if capacity is not reached.
     * Returns true on success, false otherwise.
     */
    public addPlayer(player: Player): boolean {
        if (this.players.size >= this.gameSettings.maxPlayers) return false;
        this.players.add(player);
        return true;
    }

    /**
     * Removes a player from the session.
     * The leader cannot be removed.
     */
    public removePlayer(player: Player): boolean {
        if (player.equals(this.leader)) return false;
        return this.players.delete(player);
    }

    /**
     * Initializes the Wikipedia articles for the session.
     * Fetches (numberOfArticles + 1) pages and uses the last one as the start article.
     */
    public async initializeArticles(): Promise<void> {
        const totalCount = this.gameSettings.numberOfArticles + 1;
        const articles = await WikipediaService.fetchRandomPopularWikipediaPages(totalCount, 1000, "20250101", "20250325");
        if (articles.length > 0) {
            this.startArticle = articles.pop()!;
            this.articles = articles;
            console.log(`Session ${this.id} initialized with ${this.articles.length} articles and startArticle: ${this.startArticle}`);
        } else {
            console.error("No articles fetched");
        }
    }
}