import * as React from "react";
import {ResultProps} from "../../../../pages/Result/Result.tsx";

const LeaderboardRow: React.FC<ResultProps> = ({rank, name, score}) => {
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
            <td className={`text-lg text-center ${getRankColor(rank)} py-2`}>#{rank}</td>
            <td className="text-lg text-center py-2">{name}</td>
            <td className="text-lg text-center py-2">{score}</td>
        </tr>
    );
};

export default LeaderboardRow;
