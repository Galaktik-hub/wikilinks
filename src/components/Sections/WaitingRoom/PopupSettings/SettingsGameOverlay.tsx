"use client";
import * as React from "react";
import {SettingsHeader} from "./SettingsHeader.tsx";
import {SettingsOption} from "./SettingsOption.tsx";
import {OptionSelector} from "./OptionSelector.tsx";
import TimerSVG from "../../../../assets/WaitingRoom/TimerSVG.tsx";
import ArticleSVG from "../../../../assets/WaitingRoom/ArticleSVG.tsx";
import PlayerSVG from "../../../../assets/WaitingRoom/PlayerSVG.tsx";
import PlanetSVG from "../../../../assets/WaitingRoom/PlanetSVG.tsx";
import CloseSVG from "../../../../assets/WaitingRoom/CloseSVG.tsx";
import {GameSettingsType} from "../GameSettings/GameSettings.tsx";
import {useGameContext} from "../../../../context/GameContext.tsx";
import DifficultySVG from "../../../../assets/WaitingRoom/DifficultySVG";

interface SettingsGameOverlayProps {
    gameSettings: GameSettingsType;
    setGameSettings: React.Dispatch<React.SetStateAction<GameSettingsType>>;
    closeModal: () => void;
}

const SettingsGameOverlay: React.FC<SettingsGameOverlayProps> = ({gameSettings, setGameSettings, closeModal}) => {
    const gameContext = useGameContext();

    const timeOptions = [
        {label: "Aucun", value: 0},
        {label: "2min", value: 2},
        {label: "5min", value: 5},
        {label: "10min", value: 10},
        {label: "15min", value: 15},
    ];

    const articleOptions = [
        {label: "1", value: 1},
        {label: "2", value: 2},
        {label: "4", value: 4},
        {label: "8", value: 8},
    ];

    const playerOptions = [
        {label: "Seul", value: 1},
        {label: "5", value: 5},
        {label: "10", value: 10},
        {label: "20", value: 20},
        {label: "30", value: 30},
    ];

    const difficultyOptions = [
        {label: "Facile", value: 1},
        {label: "Moyenne", value: 2},
        {label: "Difficile", value: 3},
    ];

    const togglePublicGame = () => {
        const next: GameSettingsType = {...gameSettings, type: gameSettings.type === "public" ? "private" : "public"};
        setGameSettings(next);
        gameContext.updateSettings(next);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
            <article
                className="flex overflow-hidden flex-col bg-bgSecondary rounded-lg border-2 border-blueSecondary border-solid w-[360px]"
                onClick={e => e.stopPropagation()}>
                <SettingsHeader title="Paramètres" icon={<CloseSVG onClick={closeModal} />} />

                <div className="self-center flex flex-col gap-3 mt-4 w-[340px]">
                    <SettingsOption icon={<TimerSVG />} label="Temps imparti">
                        <OptionSelector
                            options={timeOptions}
                            selectedValue={gameSettings.timeLimit}
                            onChange={value => {
                                const next = {...gameSettings, timeLimit: Number(value)};
                                setGameSettings(next);
                                gameContext.updateSettings(next);
                            }}
                        />
                    </SettingsOption>
                    <SettingsOption icon={<ArticleSVG />} label="Nombre d'articles">
                        <OptionSelector
                            options={articleOptions}
                            selectedValue={gameSettings.numberOfArticles}
                            onChange={value => {
                                const next = {...gameSettings, numberOfArticles: Number(value)};
                                setGameSettings(next);
                                gameContext.updateSettings(next);
                            }}
                        />
                    </SettingsOption>
                    <SettingsOption icon={<PlayerSVG />} label="Joueurs max">
                        <OptionSelector
                            options={playerOptions}
                            selectedValue={gameSettings.maxPlayers}
                            onChange={value => {
                                const next = {...gameSettings, maxPlayers: Number(value)};
                                setGameSettings(next);
                                gameContext.updateSettings(next);
                            }}
                        />
                    </SettingsOption>
                    <SettingsOption icon={<DifficultySVG />} label="Difficulté">
                        <OptionSelector
                            options={difficultyOptions}
                            selectedValue={gameSettings.difficulty}
                            onChange={value => {
                                const next = {...gameSettings, difficulty: Number(value)};
                                setGameSettings(next);
                                gameContext.updateSettings(next);
                            }}
                        />
                    </SettingsOption>
                    <SettingsOption icon={<PlanetSVG />} label="Partie publique">
                        <div className="flex items-center pl-10 mb-4">
                            <button
                                onClick={togglePublicGame}
                                className={`relative w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${
                                    gameSettings.type === "public" ? "bg-bluePrimary" : "bg-gray-400"
                                }`}>
                                <div
                                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                                        gameSettings.type === "public" ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </button>
                        </div>
                    </SettingsOption>
                </div>
            </article>
        </div>
    );
};

export default SettingsGameOverlay;
