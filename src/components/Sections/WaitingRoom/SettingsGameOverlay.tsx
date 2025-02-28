"use client";
import * as React from "react";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsOption } from "./SettingsOption";
import { OptionSelector } from "./OptionSelector";

const SettingsGameOverlay: React.FC = () => {
    const [selectedTime, setSelectedTime] = React.useState<number | string>(2);
    const [selectedArticles, setSelectedArticles] = React.useState<number>(2);
    const [selectedPlayers, setSelectedPlayers] = React.useState<number>(10);
    const [isPublicGame, setIsPublicGame] = React.useState<boolean>(false);

    const togglePublicGame = () => {
        setIsPublicGame((prev) => !prev);
    };

    const timeOptions = [
        { label: "Aucun", value: "none" },
        { label: "2min", value: 2 },
        { label: "5min", value: 5 },
        { label: "10min", value: 10 },
        { label: "15min", value: 15 },
    ];

    const articleOptions = [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "4", value: 4 },
        { label: "8", value: 8 },
    ];

    const playerOptions = [
        { label: "2", value: 2 },
        { label: "5", value: 5 },
        { label: "10", value: 10 },
        { label: "20", value: 20 },
        { label: "30", value: 30 },
    ];

    return (
        <article className="flex overflow-hidden flex-col bg-gray-800 rounded-lg border-2 border-blue-700 border-solid w-[360px]">
            <SettingsHeader
                title="Paramètres"
                closeIconUrl="https://cdn.builder.io/api/v1/image/assets/0025ac7cef8d4695ad7481fcf899a24a/c7fc97bdf8ce7ae27e9ec66534ed873ae4d6a590115925e594d4e83a1b40dc70?placeholderIfAbsent=true"
            />

            <div className="self-center mt-2.5 w-[340px]">
                <SettingsOption
                    iconUrl="https://cdn.builder.io/api/v1/image/assets/0025ac7cef8d4695ad7481fcf899a24a/ac3e8eac0eb616dde75cf6e7566dd7f14537678a3adfd354d66ad82b3906b827?placeholderIfAbsent=true"
                    label="Temps imparti"
                >
                    <OptionSelector options={timeOptions} selectedValue={selectedTime} onChange={setSelectedTime} />
                </SettingsOption>

                <div className="mt-5">
                    <SettingsOption
                        iconUrl="https://cdn.builder.io/api/v1/image/assets/0025ac7cef8d4695ad7481fcf899a24a/61fdc995df2b3a073486e876e3913845799f92da06740d06d49df44290099583?placeholderIfAbsent=true"
                        label="Nombre d'articles"
                    >
                        <OptionSelector options={articleOptions} selectedValue={selectedArticles} onChange={setSelectedArticles} />
                    </SettingsOption>
                </div>

                <div className="mt-5">
                    <SettingsOption
                        iconUrl="https://cdn.builder.io/api/v1/image/assets/0025ac7cef8d4695ad7481fcf899a24a/cfa4dae1445a2b3ec637783439737de3ff2d9d77523a7c965627d4a6fc06e6b1?placeholderIfAbsent=true"
                        label="Joueurs max"
                    >
                        <OptionSelector options={playerOptions} selectedValue={selectedPlayers} onChange={setSelectedPlayers} />
                    </SettingsOption>
                </div>

                <div className="mt-5">
                    <SettingsOption
                        iconUrl="https://cdn.builder.io/api/v1/image/assets/0025ac7cef8d4695ad7481fcf899a24a/dbcf66e90eec68eddcb7ed479021616c3a5338ee20ab818d2d6b31d4ceccbb69?placeholderIfAbsent=true"
                        label="Partie publique"
                    >
                        <div className="flex items-center pl-10 w-[75px]">
                            <button onClick={togglePublicGame}>
                                <img
                                    src={
                                        isPublicGame
                                            ? "https://cdn.builder.io/api/v1/image/assets/0025ac7cef8d4695ad7481fcf899a24a/active-toggle-image.png"
                                            : "https://cdn.builder.io/api/v1/image/assets/0025ac7cef8d4695ad7481fcf899a24a/1e4cbe2b9f7c6e4b14b086204fd90cefe4f060d211e399d188f33297fd3286c0?placeholderIfAbsent=true"
                                    }
                                    alt="Toggle public game"
                                    className="object-contain self-stretch my-auto aspect-square w-[35px]"
                                />
                            </button>
                        </div>
                    </SettingsOption>
                </div>
            </div>
        </article>
    );
};

export default SettingsGameOverlay;
