"use client";
import React, {useState} from "react";
import {StackableArtifact} from "../../../../../server/src/player/inventory/inventoryProps.ts";
import InventoryItemModal from "../../../Modals/Inventory/InventoryItemModal.tsx";

export interface InventoryItemProps {
    item: StackableArtifact;
    onConfirm: (targetPage?: string) => void;
}

const InventoryItem: React.FC<InventoryItemProps & {Icon: React.FC<{color?: string; className?: string}>}> = ({item, onConfirm, Icon}) => {
    const {name, count} = item;
    const [showModal, setShowModal] = useState(false);

    const isDisabled = count === 0;
    const itemColor = isDisabled ? "#374151" : "var(--bluePrimary)";
    const countColor = isDisabled ? "#374151" : "#ffffff";

    const handleClick = () => {
        if (isDisabled) return;
        setShowModal(true);
    };

    return (
        <article className="relative flex flex-col justify-center items-center p-2.5 rounded-lg border w-[100px] gap-1" style={{borderColor: itemColor}}>
            <Icon color={itemColor} className="" />
            <h3 className="flex flex-col justify-center w-full text-base text-center whitespace-nowrap" style={{color: itemColor}}>
                <span className="flex-1 shrink self-stretch w-full basis-0">{name}</span>
            </h3>
            <button
                onClick={handleClick}
                className="flex-1 shrink p-1 w-full text-sm text-center whitespace-nowrap rounded-md border basis-0"
                style={{
                    color: itemColor,
                    borderColor: itemColor,
                    ...(isDisabled ? {cursor: "default"} : {backgroundColor: "rgba(14,165,233,0.2)"}),
                }}>
                {isDisabled ? "Aucun" : "Voir"}
            </button>
            <span className="absolute top-0 right-0 self-start p-1.5 text-sm text-center whitespace-nowrap" style={{color: countColor}}>
                x{count}
            </span>

            {showModal && <InventoryItemModal artifact={item} onConfirm={page => onConfirm(page)} onCancel={() => setShowModal(false)} />}
        </article>
    );
};

export default InventoryItem;
