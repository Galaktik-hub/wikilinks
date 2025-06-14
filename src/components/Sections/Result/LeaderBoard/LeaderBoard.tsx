"use client";
import * as React from "react";
import LeaderboardRow from "./LeaderBoardRow";
import {ResultProps} from "../../../../pages/Challenge/Challenge.tsx";
import {useModalContext} from "../../../Modals/ModalProvider";
import {HistoryStep} from "../../../../../packages/shared-types/player/history.ts";

interface LeaderboardProps {
    players: ResultProps[];
    showCourse: boolean;
    currentPlayerName: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({players, showCourse, currentPlayerName}) => {
    const {openModal, closeModal} = useModalContext();

    // récupérer les 10 premiers
    const topPlayers = players.slice(0, 10);

    // trouver le joueur actuel
    const currentIndex = players.findIndex(p => p.name === currentPlayerName);
    const currentPlayer = currentIndex !== -1 ? players[currentIndex] : null;

    // assembler les lignes à afficher
    const rows: (ResultProps | "ellipsis")[] = [];
    topPlayers.forEach(p => rows.push(p));

    if (currentPlayer) {
        const inTopFive = topPlayers.some(p => p.name === currentPlayerName);
        if (!inTopFive) {
            rows.push("ellipsis");
            rows.push(currentPlayer);
        }
    }

    const handleShowCourse = (playerName: string, history: string[]) => {
        const historySteps: HistoryStep[] = history.map((entry, idx) => ({
            type: idx === history.length - 1 ? "foundPage" : "visitedPage",
            data: {page_name: entry},
            id: new Date(Date.now() + idx * 1000),
        }));
        openModal({
            title: `Historique de ${playerName}`,
            type: "timeline",
            content: {
                username: playerName,
                timelineSteps: historySteps,
                cancelButton: {
                    label: "Fermer",
                    onClick: () => closeModal(),
                },
            },
        });
    };

    return (
        <div className="card-container">
            <div className="flex justify-between text-center border-b-2 border-gray-700 my-2">
                <div className="flex-1 py-2 text-center blue-title-effect">Rang</div>
                <div className="flex-1 py-2 text-center blue-title-effect">Joueur</div>
                <div className="flex-1 py-2 text-center blue-title-effect">Score</div>
                {showCourse && <div className="flex-1 py-2 text-center blue-title-effect">Parcours</div>}
            </div>
            {rows.map((item, idx) =>
                item === "ellipsis" ? (
                    <div key={`ell-${idx}`} className="flex justify-center py-2 font-bold text-white">
                        ...
                    </div>
                ) : (
                    <LeaderboardRow
                        key={item.rank}
                        rank={item.rank}
                        name={item.name}
                        score={item.score}
                        showCourse={showCourse}
                        onViewCourse={() => handleShowCourse(item.name, item.history)}
                        history={[]}
                    />
                ),
            )}
        </div>
    );
};

export default Leaderboard;
