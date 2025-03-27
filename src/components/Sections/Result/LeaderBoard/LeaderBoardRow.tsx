import * as React from "react";
import {ResultProps} from "../../../../pages/Result/Result.tsx";

const LeaderboardRow: React.FC<ResultProps> = ({ rank, name, score }) => {
    // Determine rank color based on position
    const getRankColor = (rank: number): string => {
        switch (rank) {
            case 1:
                return "text-amber-400"; // Gold for 1st place
            case 2:
                return "text-gray-400"; // Silver for 2nd place
            case 3:
                return "text-amber-600"; // Bronze for 3rd place
            default:
                return "text-white"; // White for other positions
        }
    };

    return (
        <tr className="text-white">
            <td className={`text-sm text-center ${getRankColor(rank)}`}>#{rank}</td>
            <td className="text-sm text-center">{name}</td>
            <td className="text-sm text-center">{score}</td>
        </tr>
    );
};

export default LeaderboardRow;