"use client";
import * as React from "react";
import { useModalContext } from "../../../Modals/ModalProvider.tsx";

export interface InventoryItemProps {
    count: number;
    onConfirm: () => void;
    definition: string;
    name: string;
}

const InventoryItem: React.FC<
    InventoryItemProps & { Icon: React.FC<{ color?: string; className?: string }> }
> = ({ count, onConfirm, definition, name, Icon }) => {
    const { openModal, closeModal } = useModalContext();
    const [remaining, setRemaining] = React.useState(count);

    // Met à jour remaining si la prop count change
    React.useEffect(() => {
        setRemaining(count);
    }, [count]);

    const isDisabled = remaining === 0;
    const itemColor = isDisabled ? "#374151" : "var(--bluePrimary)";
    const countColor = isDisabled ? "#374151" : "#ffffff";

    const handleClick = () => {
        if (isDisabled) return;
        openModal({
            title: `Utiliser l'artefact ${name}`,
            type: "confirmation",
            content: {
                message: definition,
                cancelButton: { label: "Annuler", onClick: () => closeModal() },
                okButton: {
                    label: "Utiliser",
                    onClick: () => {
                        onConfirm();
                        closeModal();
                        setRemaining((prev) => prev - 1);
                    },
                },
            },
        });
    };

    return (
        <article
            className="relative flex flex-col justify-center items-center p-2.5 rounded-lg border w-[100px] gap-1"
            style={{ borderColor: itemColor }}
        >
            <Icon color={itemColor} className="" />
            <h3
                className="flex flex-col justify-center w-full text-base text-center whitespace-nowrap"
                style={{ color: itemColor }}
            >
                <span className="flex-1 shrink self-stretch w-full basis-0">{name}</span>
            </h3>
            <button
                onClick={handleClick}
                className="flex-1 shrink p-1 w-full text-sm text-center whitespace-nowrap rounded-md border basis-0"
                style={{
                    color: itemColor,
                    borderColor: itemColor,
                    ...(isDisabled
                        ? { cursor: "default" }
                        : { backgroundColor: "rgba(14,165,233,0.2)" }),
                }}
            >
                {isDisabled ? "Aucun" : "Voir"}
            </button>
            <span
                className="absolute top-0 right-0 self-start p-1.5 text-sm text-center whitespace-nowrap"
                style={{ color: countColor }}
            >
                x{remaining}
            </span>
        </article>
    );
};

export default InventoryItem;
