"use client";
import React from "react";
import InventoryItem, { InventoryItemProps } from "./InventoryItem";
import RetourSVG from "../../../../assets/Game/RetourSVG.tsx";

const definition: string = "Permet de revenir à l'article précédent.";

const RetourItem: React.FC<InventoryItemProps> = (props) => {
    return <InventoryItem {...props} definition={definition} name="Retour" Icon={RetourSVG} />;
};

export default RetourItem;
