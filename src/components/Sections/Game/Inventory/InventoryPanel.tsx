"use client";
import * as React from "react";
import GpsItem from "./GpsItem.tsx";
import RetourItem from "./RetourItem.tsx";
import MineItem from "./MineItem.tsx";
import InventorySVG from "../../../../assets/Game/InventorySVG.tsx";

interface InventoryPanelProps {
    gpsCount: number;
    retourCount: number;
    mineCount: number;
}

const InventoryPanel: React.FC<InventoryPanelProps> = (props) => (
    <div className="flex justify-center items-center">
        <div className="hidden md:block bg-gray-800 p-2.5 rounded-bl-2xl rounded-tl-2xl">
            <InventorySVG className="w-[50px] h-[50px]"/>
        </div>
        <div className="bg-gray-800 rounded-lg flex justify-center items-center gap-5 p-2.5">
            <GpsItem count={props.gpsCount} onConfirm={() => console.log("gps")} definition={""} name={""} {...props} />
            <RetourItem count={props.retourCount} onConfirm={() => console.log("retour")} definition={""} name={""} {...props} />
            <MineItem count={props.mineCount} onConfirm={() => console.log("mine")} definition={""} name={""} {...props} />
        </div>
    </div>
);

export default InventoryPanel;
