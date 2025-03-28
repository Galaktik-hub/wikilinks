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
        <section className="mt-4 w-full flex flex-col gap-2 text-base leading-none">
            <GameSettingsRow label="Temps imparti" value={timeLimit === 0 ? "Aucun" : `${timeLimit} min`} />
            <GameSettingsRow label="Nombre d'articles" value={`${articleCount}`} />
            <GameSettingsRow label="Joueurs max" value={`${maxPlayers}`} />
            <GameSettingsRow label="Type de partie" value={gameType} />
        </section>
    );
};
