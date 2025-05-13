import * as React from "react";
import {ResultProps} from "../../../../pages/Result/Result.tsx";

interface LeaderboardRowProps extends ResultProps {
    showCourse: boolean;
    onViewCourse: () => void;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = props => {
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
        <div className="flex justify-center item-center text-white">
            <div className={`flex-1 text-lg text-center ${getRankColor(props.rank)} py-2`}>#{props.rank}</div>
            <div className="flex-1 text-lg text-center py-2">{props.name}</div>
            <div className="flex-1 text-lg text-center py-2">{props.score}</div>
            {props.showCourse && (
                <div className="flex-1 text-sm text-center py-2">
                    <button
                        onClick={props.onViewCourse}
                        className="px-1.5 py-1 text-center text-white bg-blueSecondary hover:bg-blue-900 transition rounded-lg">
                        Voir
                    </button>
                </div>
            )}
        </div>
    );
};

export default LeaderboardRow;
