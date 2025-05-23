"use client";
import {useModalContext} from "../ModalProvider.tsx";
import {useEffect, useState} from "react";
import {Artifact} from "../../../../packages/shared-types/player/inventory";
import {useGameContext} from "../../../context/GameContext";
import {usePopup} from "../../../context/PopupContext";

interface InventoryItemModalProps {
    artifact: Artifact;
    onConfirm: (targetPage?: string) => void;
    onCancel: () => void;
}

export default function InventoryItemModal(props: InventoryItemModalProps): React.ReactElement | null {
    const {artifact, onConfirm, onCancel} = props;
    const gameContext = useGameContext();
    const {showPopup} = usePopup();
    const {isOpen, openModal, updateModal, closeModal} = useModalContext();
    const [targetPage, setTargetPage] = useState("");

    const onClose = () => {
        closeModal();
        onCancel();
    };

    const buildContent = () => {
        if (artifact.name === "Mine") {
            return {
                message: artifact.definition,
                inputFields: [
                    {
                        id: "target",
                        value: targetPage,
                        onChange: setTargetPage,
                        placeholder: "Article cible",
                        autoFocus: true,
                        autoComplete: "on",
                    },
                ],
                cancelButton: {label: "Annuler", onClick: () => onClose()},
                submitButton: {
                    label: "Utiliser",
                    onClick: () => {
                        if (gameContext.articles.some(article => article.name === targetPage.replace(/\s+/g, "_"))) {
                            showPopup("error", "La page cible ne doit pas être une page objectif.");
                        } else {
                            onConfirm(targetPage);
                            onClose();
                            setTargetPage("");
                        }
                    },
                    disabled: !targetPage.trim(),
                },
                isValid: !!targetPage.trim(),
            };
        } else {
            return {
                message: artifact.definition,
                cancelButton: {label: "Annuler", onClick: () => onClose()},
                okButton: {
                    label: "Utiliser",
                    onClick: () => {
                        onConfirm();
                        onClose();
                    },
                },
            };
        }
    };

    // Dès que le composant se monte et que c'est un Mine, on ouvre le modal
    useEffect(() => {
        if (artifact.name === "Mine") {
            openModal({
                title: `Utiliser l'artefact ${artifact.name}`,
                type: "form",
                content: buildContent(),
                onClose: () => onClose(),
            });
        } else {
            openModal({
                title: `Utiliser l'artefact ${artifact.name}`,
                type: "confirmation",
                content: buildContent(),
                onClose: () => onClose(),
            });
        }
        // On ré-exécute à chaque fois que targetPage change pour updater le disabled/la valeur
    }, []);

    // UseEffect dédié à l’update du contenu quand targetPage évolue
    useEffect(() => {
        if (!isOpen || artifact.name !== "Mine") return;

        updateModal({
            content: buildContent(),
            onClose: () => onClose(),
        });
    }, [targetPage]);

    return null;
}
