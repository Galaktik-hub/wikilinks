import * as React from "react";
import {TimelineStep} from "../Sections/Game/CollapsiblePanel/PlayerProgressPanel.tsx";

export interface InputField {
    id: string;
    value: string;
    onChange: (value: string) => void;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    placeholder: string;
    type?: string;
    maxLength?: number;
    autoFocus?: boolean;
}

// Interface pour les boutons
export interface ButtonField {
    label: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean; // Utilisé pour le formulaire si invalide
}

// Interface pour le ModalForm (formulaire)
export interface ModalFormProps {
    inputFields: InputField[];
    submitButton: ButtonField;
    isValid: boolean; // Indique si tous les inputs sont valides
}

// Interface pour le ModalConfirmation (confirmation avec deux boutons)
export interface ModalConfirmationProps {
    message: string;
    cancelButton: ButtonField;
    okButton: ButtonField;
}

// Interface pour le contenu de type timeline
export interface ModalTimelineProps {
    username: string;
    timelineSteps: TimelineStep[];
}

// Interface générique pour ModalProps
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    type: "form" | "confirmation" | "timeline"; // Indique quel type de modal afficher
    content: ModalFormProps | ModalConfirmationProps | ModalTimelineProps; // Dynamique en fonction du type
}

export const formatContent = (template: string, username: string, data?: Record<string, string>) => {
    let result = template.replace("{user}", username);
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            result = result.replace(`{${key}}`, value);
        });
    }
    return result;
};
