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
                    <tr className="text-center border-b-2 border-gray-700 my-2">
                        <th className="py-2">
                            <h2
                                className="py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                                style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                            >
                                Rang
                            </h2>
                        </th>
                        <th className="py-2">
                            <h2
                                className="py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                                style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                            >
                                Joueur
                            </h2>
                        </th>
                        <th className="py-2">
                            <h2
                                className="py-1 text-lg font-bold leading-none text-sky-500 whitespace-nowrap"
                                style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                            >
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
        </Container>
    );
};

export default Leaderboard;