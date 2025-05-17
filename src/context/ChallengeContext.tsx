import React, {createContext, useContext, useEffect, useState} from "react";
import {useWebSocket} from "./WebSocketContext.tsx";

interface Article {
    name: string;
    found: boolean;
}

export interface ChallengeContextType {
    // connection/session
    username: string | null;
    sessionId: string;

    // articles
    startArticle: string;
    setStartArticle: (article: string) => void;
    targetArticle: string;
    articles: Article[];

    // game state
    isGameOver: boolean;
    setIsGameOver: (value: boolean) => void;

    // actions
    createGame: (payload: {username: string; startArticle: string}) => void;
    startGame: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const ws = useWebSocket();

    // connexion/session
    const [username, setUsername] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string>("");

    // game state
    const [isGameOver, setIsGameOver] = useState(true);

    // articles
    const [articles, setArticles] = useState<Article[]>([]);
    const [startArticle, setStartArticle] = useState("");
    const [targetArticle, setTargetArticle] = useState("");

    useEffect(() => {
        const handler = (data: any) => {
            switch (data.kind) {
                case "challenge_session_created":
                    setSessionId(data.sessionId);
                    setTargetArticle(data.targetArticle);
                    setUsername(data.username);
                    break;
                case "challenge_ended":
                    setIsGameOver(true);
                    setArticles([]);
                    setStartArticle("");
                    break;
                case "challenge_started":
                    setIsGameOver(false);
            }
        };
        ws.onMessage(handler);
        return () => ws.offMessage(handler);
    }, [ws]);

    const createGame = (payload: {username: string; startArticle: string}) => ws.send({kind: "create_challenge_session", ...payload});

    const startGame = () => {
        ws.send({kind: "start_challenge"});
    };

    return (
        <ChallengeContext.Provider
            value={{
                username,
                sessionId,
                isGameOver,
                setIsGameOver,
                startArticle,
                setStartArticle,
                targetArticle,
                articles,
                createGame,
                startGame,
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
