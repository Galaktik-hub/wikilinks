import * as React from "react";
import { GameSettingsRow } from "./GameSettingsRow.tsx";

interface GameSettingsParametersProps {
    timeLimit: number;
    articleCount: number;
    maxPlayers: number;
    gameType: string;
}

export const GameSettingsParameters: React.FC<GameSettingsParametersProps> = ({
                                                                                  timeLimit,
                                                                                  articleCount,
                                                                                  maxPlayers,
                                                                                  gameType,
                                                                              }) => {
    return (
        <section className="mt-4 w-full text-base leading-none">
            <GameSettingsRow label="Temps imparti" value={timeLimit === 0 ? "Aucun" : `${timeLimit} min`} />
            <div className="mt-2">
                <GameSettingsRow label="Nombre d'articles" value={`${articleCount}`} />
            </div>
            <div className="mt-2">
                <GameSettingsRow label="Joueurs max" value={`${maxPlayers}`} />
            </div>
            <div className="mt-2">
                <GameSettingsRow label="Type de partie" value={gameType} />
            </div>
        </section>
    );
};
