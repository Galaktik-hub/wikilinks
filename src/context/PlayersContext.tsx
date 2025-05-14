"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {TimelineStep} from "../components/Sections/Game/CollapsiblePanel/PlayerProgressPanel";
import {useWebSocket} from "./WebSocketContext.tsx";
import {ArtifactName, Artifact} from "../../server/src/player/inventory/inventoryProps.ts";
import {useGameContext} from "./GameContext.tsx";

interface PlayerInfo {
    username: string;
    role: string;
}

interface PlayersContextType {
    players: PlayerInfo[];

    // inventory
    inventory: Record<ArtifactName, Artifact>;
    foundArtifact: (name: ArtifactName) => void;
    usedArtifact: (name: ArtifactName) => void;

    // history
    histories: Record<string, TimelineStep[]>;
    getHistory: () => void;
}

export const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const PlayersProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const ws = useWebSocket()!;
    const gameCtx = useGameContext()!;
    const [players, setPlayers] = useState<PlayerInfo[]>([]);
    const [inventory, setInventory] = useState<Record<ArtifactName, Artifact>>({} as Record<ArtifactName, Artifact>);
    const [histories, setHistories] = useState<Record<string, TimelineStep[]>>({});

    useEffect(() => {
        const handler = (data: any) => {
            switch (data.kind) {
                case "game_launched":
                    initInventory();
                    break;
                case "players_update":
                    setPlayers(data.players);
                    setHistories(prev => {
                        const updated = {...prev};
                        data.players.forEach((p: PlayerInfo) => {
                            if (!updated[p.username]) updated[p.username] = [];
                        });
                        return updated;
                    });
                    break;
                case "inventory": {
                    const own = data.inventory.find((i: any) => i.player === gameCtx.username);
                    if (own) setInventory(own.inventory);
                    break;
                }
                case "history": {
                    const map: Record<string, TimelineStep[]> = {};
                    data.history.forEach((h: any) => (map[h.player] = h.history));
                    setHistories(map);
                    break;
                }
                case "game_update":
                    if (data.event) {
                        const {type, data: ev} = data.event;
                        const name = ev.player || ev.playerName;
                        const step: TimelineStep = {id: Date.now(), type, data: ev};
                        setHistories(prev => ({...prev, [name]: [...(prev[name] || []), step]}));
                    }
                    break;
            }
        };
        ws.onMessage(handler);
        return () => {
            ws.offMessage(handler);
        };
    }, [ws]);

    const initInventory = () => ws.send({kind: "init_inventory"});
    const getHistory = () => ws.send({kind: "get_history"});
    const foundArtifact = (name: ArtifactName) => ws.send({kind: "game_event", event: {type: "foundArtifact", artefact: name}});
    const usedArtifact = (name: ArtifactName) => {
        playArtifact(name);
        ws.send({kind: "game_event", event: {type: "usedArtifact", artefact: name}});
    };

    const playArtifact = (name: ArtifactName) => {
        const username = gameCtx.username;
        if (!username) return;
        switch (name) {
            case "GPS":
                break;
            case "Retour":
                playArtifactRetour(username);
                break;
            case "Mine":
                break;
            case "Teleporteur":
                break;
            case "Escargot":
                break;
            case "Gomme":
                break;
            case "Desorienteur":
                break;
            case "Dictateur":
                break;
        }
    };

    const playArtifactRetour = (username: string) => {
        const hist = histories[username] ?? [];
        for (let i = hist.length - 2; i >= 0; i--) {
            const step = hist[i];
            if (step.type === "foundPage" || step.type === "visitedPage") {
                const previousTitle = (step.data as any).page_name;
                gameCtx.setCurrentTitle(previousTitle);
                break;
            }
        }
    }

    return (
        <PlayersContext.Provider value={{players, inventory, foundArtifact, usedArtifact, histories, getHistory}}>
            {children}
        </PlayersContext.Provider>
    );
};

export const usePlayersContext = (): PlayersContextType => {
    const ctx = useContext(PlayersContext);
    if (!ctx) throw new Error("usePlayersContext doit être utilisé dans PlayersProvider");
    return ctx;
};
