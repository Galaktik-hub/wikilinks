"use client";
import * as React from "react";
import LeaderboardRow from "./LeaderBoardRow";
import {ResultProps} from "../../../../pages/Result/Result.tsx";

interface LeaderboardProps {
    players: ResultProps[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
    return (
        <div className="card-container">
            <table className="w-full text-white">
                <thead>
                    <tr className="text-center border-b-2 border-gray-700 my-2">
                        <th className="py-2">
                            <h2 className="blue-title-effect">
                                Rang
                            </h2>
                        </th>
                        <th className="py-2">
                            <h2 className="blue-title-effect">
                                Joueur
                            </h2>
                        </th>
                        <th className="py-2">
                            <h2 className="blue-title-effect">
                                Score
                            </h2>
                        </th>
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
        </div>
    );
};

export default Leaderboard;