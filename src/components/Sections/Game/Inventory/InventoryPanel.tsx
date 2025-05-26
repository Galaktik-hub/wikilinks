"use client";
import * as React from "react";
import InventorySVG from "../../../../assets/Game/InventorySVG.tsx";
import {usePlayersContext} from "../../../../context/PlayersContext.tsx";
import {ArtifactName, StackableArtifact} from "../../../../../packages/shared-types/player/inventory";
import GpsSVG from "../../../../assets/Game/GpsSVG.tsx";
import InventoryItem from "./InventoryItem.tsx";
import RetourSVG from "../../../../assets/Game/RetourSVG.tsx";
import MineSVG from "../../../../assets/Game/MineSVG.tsx";
import {useAudio} from "../../../../context/AudioContext";

const InventoryPanel: React.FC = () => {
    const playersContext = usePlayersContext();
    const {playEffect} = useAudio();
    const gpsItem = playersContext.inventory.GPS as StackableArtifact;
    const retourItem = playersContext.inventory.Retour as StackableArtifact;
    const mineItem = playersContext.inventory.Mine as StackableArtifact;

    const handleConfirm = (name: ArtifactName, data?: Record<string, string>) => {
        playersContext.usedArtifact(name, data);
        if (name === "GPS") {
            playEffect("gps");
        } else if (name === "Retour") {
            playEffect("back");
        } else if (name === "Mine") {
            playEffect("mine");
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="hidden md:block bg-bgSecondary p-2.5 rounded-bl-2xl rounded-tl-2xl shadow-[0px_0px_15px_rgba(0,0,0,0.5)]">
                <InventorySVG className="w-[50px] h-[50px]" />
            </div>
            <div className="bg-bgSecondary rounded-lg flex justify-center items-center gap-5 p-2.5 shadow-[0px_0px_15px_rgba(0,0,0,0.5)]">
                <InventoryItem item={gpsItem} onConfirm={() => handleConfirm("GPS")} Icon={GpsSVG} />
                <InventoryItem item={retourItem} onConfirm={() => handleConfirm("Retour")} Icon={RetourSVG} />
                <InventoryItem item={mineItem} onConfirm={page => handleConfirm("Mine", {targetPage: page as string})} Icon={MineSVG} />
            </div>
        </div>
    );
};

export default InventoryPanel;
