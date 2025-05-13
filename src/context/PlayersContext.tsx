"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {TimelineStep} from "../components/Sections/Game/CollapsiblePanel/PlayerProgressPanel";
import {useWebSocket} from "./WebSocketContext.tsx";
import {Artifact} from "../../server/src/player/inventory/inventoryProps.ts";

interface PlayerInfo {
    username: string;
    role: string;
}

interface PlayersContextType {
    players: PlayerInfo[];

    // inventory
    inventory: Record<string, Artifact>;
    addArtifact: (name: string) => void;
    useArtifact: (name: string) => void;

    // history
    histories: Record<string, TimelineStep[]>;
    getHistory: () => void;
}

export const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const PlayersProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const ws = useWebSocket()!;
    const [players, setPlayers] = useState<PlayerInfo[]>([]);
    const [inventory, setInventory] = useState<Record<string, Artifact>>({});
    const [histories, setHistories] = useState<Record<string, TimelineStep[]>>({});

    useEffect(() => {
        const handler = (data: any) => {
            switch (data.kind) {
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
                case "history": {
                    const map: Record<string, TimelineStep[]> = {};
                    data.history.forEach((h: any) => (map[h.player] = h.history));
                    setHistories(map);
                    break;
                }
                case "game_update":
                    if (data.event) {
                        const {type, data: ev} = data.event;
                        if (["foundArtifact", "usedArtifact"].includes(type)) {
                            const name = ev.artefact;
                            setInventory(prev => ({...prev, [name]: ev}));
                        }
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

    const getHistory = () => ws.send({kind: "get_history"});
    const addArtifact = (name: string) => ws.send({kind: "game_event", event: {type: "addArtifact", artefact: name}});
    const useArtifact = (name: string) => ws.send({kind: "game_event", event: {type: "useArtifact", artefact: name}});

    return <PlayersContext.Provider value={{players, inventory, addArtifact, useArtifact, histories, getHistory}}>{children}</PlayersContext.Provider>;
};

export const usePlayersContext = (): PlayersContextType => {
    const ctx = useContext(PlayersContext);
    if (!ctx) throw new Error("usePlayersContext doit être utilisé dans PlayersProvider");
    return ctx;
};
