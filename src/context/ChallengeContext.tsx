import React, {createContext, useContext, useEffect, useState} from "react";
import {useWebSocket} from "./WebSocketContext.tsx";
import {ResultProps} from "../pages/Challenge/Challenge";

interface Article {
    name: string;
    found: boolean;
}

export interface ChallengeContextType {
    // connection/session
    username: string | null;
    setUsername: (username: string | null) => void;
    sessionId: string;

    // articles
    startArticle: string;
    setStartArticle: (article: string) => void;
    targetArticle: string;
    articles: Article[];

    // game state
    isGameOver: boolean;
    setIsGameOver: (value: boolean) => void;

    // leaderboard
    leaderboard: ResultProps[];

    // actions
    createGame: (payload: {username: string; startArticle: string}) => void;
    startGame: () => void;
    getTodayChallenge: () => void;
    getTodayLeaderboard: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const ws = useWebSocket();

    // connexion/session
    const [username, setUsername] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string>("");

    // game state
    const [isGameOver, setIsGameOver] = useState(false);

    // articles
    const [articles, setArticles] = useState<Article[]>([]);
    const [startArticle, setStartArticle] = useState("");
    const [targetArticle, setTargetArticle] = useState("");

    // leaderboard
    const [leaderboard, setLeaderboard] = useState<ResultProps[]>([]);

    useEffect(() => {
        const handler = (data: any) => {
            switch (data.kind) {
                case "challenge_session_created":
                    setSessionId(data.sessionId);
                    break;
                case "challenge_ended":
                    setIsGameOver(true);
                    setArticles([]);
                    setStartArticle("");
                    break;
                case "today_challenge":
                    setTargetArticle(data.targetArticle);
                    break;
                case "today_leaderboard":
                    setLeaderboard(data.leaderboard);
                    break;
            }
        };
        ws.onMessage(handler);
        return () => ws.offMessage(handler);
    }, [ws]);

    const createGame = (payload: {username: string; startArticle: string}) => ws.send({kind: "create_challenge_session", ...payload});

    const startGame = () => {
        ws.send({kind: "start_challenge"});
    };

    const getTodayChallenge = () => {
        ws.send({kind: "get_today_challenge"});
    };

    const getTodayLeaderboard = () => {
        ws.send({kind: "get_today_leaderboard"});
    };

    return (
        <ChallengeContext.Provider
            value={{
                username,
                setUsername,
                sessionId,
                isGameOver,
                setIsGameOver,
                startArticle,
                setStartArticle,
                targetArticle,
                articles,
                leaderboard,
                createGame,
                startGame,
                getTodayChallenge,
                getTodayLeaderboard,
            }}>
            {children}
        </ChallengeContext.Provider>
    );
};

export const useChallengeContext = (): ChallengeContextType => {
    const ctx = useContext(ChallengeContext);
    if (!ctx) throw new Error("useChallengeContext doit être utilisé dans ChallengeProvider");
    return ctx;
};
