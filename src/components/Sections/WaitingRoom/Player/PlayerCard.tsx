import * as React from "react";
import CrownIcon from "../../../../assets/WaitingRoom/CrownSVG.tsx";
import MoreOptionsIcon from "../../../../assets/WaitingRoom/MoreSVG.tsx";
import PlayerSettingsOverlay from "./PlayerSettingsOverlay.tsx";

interface PlayerCardProps {
    playerName: string | null | undefined;
    isPlayerAdmin?: boolean; // Indique si ce joueur est admin (affiche la couronne)
    isHost: boolean; // Indique si l'utilisateur actuel est admin (affiche les options)
    currentUsername?: string | null;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({playerName, isPlayerAdmin = false, isHost, currentUsername}) => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const playerCardRef = React.useRef<HTMLDivElement>(null);

    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (playerCardRef.current && !playerCardRef.current.contains(event.target as Node)) {
            closePopup();
        }
    };

    React.useEffect(() => {
        if (isPopupOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPopupOpen]);

    const articleClass = `flex justify-between items-center py-2 ${playerName !== currentUsername ? "pr-1.5 pl-4 bg-gray-700" : "px-4 bg-gray-600"}  rounded relative`;

    return (
        <article ref={playerCardRef} className={articleClass}>
            <div className="flex justify-center items-center gap-2">
                <div className="flex gap-1.5 items-center self-stretch py-2 my-auto">
                    <span className="self-stretch my-auto">{playerName}</span>
                    {isPlayerAdmin && <CrownIcon className="text-yellow-500" />}
                </div>
                {playerName !== currentUsername && (
                    <button onClick={handleMoreClick} className="p-1 rounded hover:bg-gray-600">
                        <MoreOptionsIcon className="w-[25px] h-[25px] text-gray-400" />
                    </button>
                )}
            </div>

            {/* Popup Modal */}
            {isPopupOpen && (
                <div className="absolute z-10 right-0 -translate-y-[75px]">
                    <PlayerSettingsOverlay muted={false} isHost={isHost} playerName={playerName}/>
                </div>
            )}
        </article>
    );
};
