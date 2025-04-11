"use client";
import React from "react";
import InventoryItem, {InventoryItemProps} from "./InventoryItem";
import GpsSVG from "../../../../assets/Game/GpsSVG.tsx";

const definition: string = "Indique la distance en nombre de sauts vers chaque article à visiter en fournissant le lien optimal.";

const GpsItem: React.FC<InventoryItemProps> = props => {
    return <InventoryItem {...props} definition={definition} name="GPS" Icon={GpsSVG} />;
};

export default GpsItem;
