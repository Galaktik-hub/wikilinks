"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {useWebSocket} from "./WebSocketContext.tsx";
import {useGameContext} from "./GameContext.tsx";
import {useModalContext} from "../components/Modals/ModalProvider.tsx";
import {HistoryStep} from "../../packages/shared-types/player/history";
import {Artifact, artifactDefinitions, ArtifactName} from "../../packages/shared-types/player/inventory";
import {useChallengeContext} from "./ChallengeContext";
import {useNavigate} from "react-router-dom";

interface PlayerInfo {
    username: string;
    role: string;
}

interface PlayersContextType {
    players: PlayerInfo[];

    // inventory
    inventory: Record<ArtifactName, Artifact>;
    foundArtifact: (name: ArtifactName) => void;
    usedArtifact: (name: ArtifactName, data?: Record<string, string>) => void;

    // history
    histories: Record<string, HistoryStep[]>;
    getHistory: () => void;
    exit: () => void;
}

export const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const PlayersProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const ws = useWebSocket()!;
    const gameCtx = useGameContext()!;
    const challengeCtx = useChallengeContext();
    const {openModal, closeModal} = useModalContext();
    const navigate = useNavigate();
    const [players, setPlayers] = useState<PlayerInfo[]>([]);
    const [inventory, setInventory] = useState<Record<ArtifactName, Artifact>>({} as Record<ArtifactName, Artifact>);
    const [histories, setHistories] = useState<Record<string, HistoryStep[]>>({});

    useEffect(() => {
        const handler = (data: any) => {
            switch (data.kind) {
                case "game_launched":
                    initInventory();
                    gameCtx.setPageChangeDelay(0);
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
                    const map: Record<string, HistoryStep[]> = {};
                    data.history.forEach((h: any) => (map[h.player] = h.history));
                    setHistories(map);
                    break;
                }
                case "game_update":
                    if (data.event) {
                        const {type, data: ev} = data.event;
                        const name = ev.player || ev.playerName;
                        const step: HistoryStep = {type, data: ev, id: new Date()};
                        setHistories(prev => ({...prev, [name]: [...(prev[name] || []), step]}));
                    }
                    break;
                case "game_artifact":
                    if (data.type === "execution") artifactExecution(data.artefact as ArtifactName, data.data);
                    break;
                case "room_closed":
                    roomClosed();
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
    const usedArtifact = (name: ArtifactName, data?: Record<string, string>) => {
        playArtifact(name);
        ws.send({kind: "game_event", event: {type: "usedArtifact", artefact: name, data: data}});
    };

    // The player plays or activates an artefact
    const playArtifact = (name: ArtifactName) => {
        const username = gameCtx.username;
        if (!username) return;
        switch (name) {
            case "GPS":
                // Back side
                break;
            case "Retour":
                playArtifactRetour(username);
                break;
            case "Mine":
                // Back side
                break;
            case "Teleporteur":
                // Back side
                break;
            case "Escargot":
                gameCtx.setPageChangeDelay(60);
                break;
            case "Gomme":
                // Back side
                break;
            case "Desorienteur":
                // Back side
                break;
            case "Dictateur":
                // Back side
                break;
        }
    };

    const playArtifactRetour = (username: string, stepsBack: number = 1) => {
        const hist = histories[username] ?? [];
        // build sequence that contains only the pages
        const seq: string[] = [];
        hist.forEach(step => {
            if (step.type === "foundPage" || step.type === "visitedPage" || step.type === "start") {
                const page = (step.data as any).page_name;
                if (seq[seq.length - 1] !== page) {
                    seq.push(page);
                }
            }
        });
        // Find current page in the sequence
        const current = gameCtx.currentTitle;
        let idx = seq.lastIndexOf(current);
        if (idx === -1) idx = seq.length - 1;
        // Go back
        const newIdx = Math.max(0, idx - stepsBack);
        const previousTitle = seq[newIdx];
        gameCtx.changeCurrentTitle(previousTitle);
    };

    // Executing an artefact after server processing
    const artifactExecution = (name: ArtifactName, data?: Record<string, string>) => {
        const username = gameCtx.username;
        if (!username) return;
        switch (name) {
            case "GPS": {
                const payload = JSON.stringify(data);
                gameCtx.sendMessage(`/artifactHint ${payload}`, username);
                break;
            }
            case "Retour":
                // Front side
                break;
            case "Mine":
                artifactExecMine(username);
                break;
            case "Teleporteur":
                gameCtx.changeCurrentTitle(data!.teleportedTitle);
                break;
            case "Escargot":
                // Front side
                break;
            case "Gomme":
                // Back side - no special return
                break;
            case "Desorienteur":
                gameCtx.changeCurrentTitle(data!.randomArticle);
                break;
            case "Dictateur":
                artifactExecDictateur(data!.targetArticle);
                break;
        }
    };

    const artifactExecMine = (username: string) => {
        openModal({
            title: "Effet d'artefact : Mine",
            type: "confirmation",
            content: {
                message: "Vous venez de tomber sur un artefact piégé de mines par un adversaire. Vous reculez de 5 articles.",
                okButton: {
                    label: "Suivant",
                    onClick: () => {
                        playArtifactRetour(username, 5);
                        closeModal();
                    },
                },
            },
        });
    };

    const artifactExecDictateur = (page_obj: string) => {
        openModal({
            title: "Effet d'artefact : Dictateur",
            type: "confirmation",
            content: {
                message: `${artifactDefinitions.Dictateur.definition.replace("{page_obj}", page_obj.replace(/_/g, " "))}`,
                okButton: {
                    label: "Ok",
                    onClick: () => {
                        closeModal();
                    },
                },
            },
        });
    };

    const roomClosed = () => {
        const goBackToHome = () => {
            navigate("/");
            exit();
        };
        if (gameCtx.leaderName !== gameCtx.username) {
            openModal({
                title: "Retour à l'acceuil",
                type: "confirmation",
                content: {
                    message: "L'hôte a fermé le salon ou vous a exclu. Vous allez être redirigé vers la page d'accueil.",
                    okButton: {
                        label: "Suivant",
                        onClick: () => {
                            goBackToHome();
                            closeModal();
                        },
                    },
                },
            });
        } else goBackToHome();
    };

    const exit = () => {
        setPlayers([]);
        setInventory({} as Record<ArtifactName, Artifact>);
        setHistories({});
        gameCtx.resetGame();
        challengeCtx.resetChallenge();
        ws.resetMessages();
    };

    return <PlayersContext.Provider value={{players, inventory, foundArtifact, usedArtifact, histories, getHistory, exit}}>{children}</PlayersContext.Provider>;
};

export const usePlayersContext = (): PlayersContextType => {
    const ctx = useContext(PlayersContext);
    if (!ctx) throw new Error("usePlayersContext doit être utilisé dans PlayersProvider");
    return ctx;
};
