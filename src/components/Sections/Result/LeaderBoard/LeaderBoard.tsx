"use client";
import * as React from "react";
import LeaderboardRow from "./LeaderBoardRow";
import Container from "../../../Container.tsx";
import {ResultProps} from "../../../../pages/Result/Result.tsx";

interface LeaderboardProps {
    players: ResultProps[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
    return (
        <Container>
            <table className="w-full text-white">
                <thead>
                <tr className="text-center">
                    <th className="text-sm">Rang</th>
                    <th className="text-sm">Joueur</th>
                    <th className="text-sm">Score</th>
                </tr>
                </thead>
                <tbody>
                {players.map((player) => (
                    <LeaderboardRow
                        key={player.rank}
                        rank={player.rank}
                        name={player.name}
                        score={player.score}
                    />
                ))}
                </tbody>
            </table>
        </Container>
    );
};

export default Leaderboard;