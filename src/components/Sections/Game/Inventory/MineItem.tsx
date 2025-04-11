"use client";
import React from "react";
import InventoryItem, {InventoryItemProps} from "./InventoryItem";
import MineSVG from "../../../../assets/Game/MineSVG.tsx";

const definition: string = "Piège un article et fait reculer un adversaire de 5 articles s’il tombe dans l’explosion.";

const MineItem: React.FC<InventoryItemProps> = props => {
    return <InventoryItem {...props} definition={definition} name="Mine" Icon={MineSVG} />;
};

export default MineItem;
