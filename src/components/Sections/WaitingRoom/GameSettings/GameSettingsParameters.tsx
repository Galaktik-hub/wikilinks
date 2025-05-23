import * as React from "react";
import {GameSettingsRow} from "./GameSettingsRow.tsx";
import {GameSettingsType} from "./GameSettings.tsx";

export const GameSettingsParameters: React.FC<GameSettingsType> = ({...props}: GameSettingsType) => {
    const {timeLimit, numberOfArticles, maxPlayers, type, difficulty} = props;
    const typeValue = type === "public" ? "Publique" : "Privé";
    const difficultyValue = ["Facile", "Moyenne", "Difficile", "Impossible"][difficulty - 1];
    return (
        <section className="mt-4 w-full flex flex-col gap-2 text-base leading-none">
            <GameSettingsRow label="Temps imparti" value={timeLimit === 0 ? "Aucun" : `${timeLimit} min`} />
            <GameSettingsRow label="Nombre d'articles" value={`${numberOfArticles}`} />
            <GameSettingsRow label="Joueurs max" value={`${maxPlayers}`} />
            <GameSettingsRow label="Type de partie" value={typeValue} />
            <GameSettingsRow label="Difficulté" value={difficultyValue} />
        </section>
    );
};
