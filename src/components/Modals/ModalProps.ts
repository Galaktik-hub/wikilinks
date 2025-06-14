import * as React from "react";
import {HistoryStep} from "../../../packages/shared-types/player/history";

export interface InputField {
    id: string;
    value: string;
    onChange: (value: string) => void;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    placeholder: string;
    type?: string;
    maxLength?: number;
    autoFocus?: boolean;
    autoComplete: "on" | "off";
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
    message?: string;
    inputFields: InputField[];
    cancelButton?: ButtonField;
    submitButton: ButtonField;
    isValid: boolean; // Indique si tous les inputs sont valides
}

// Interface pour le ModalConfirmation (confirmation avec deux boutons)
export interface ModalConfirmationProps {
    message?: string;
    cancelButton?: ButtonField;
    okButton: ButtonField;
}

// Interface pour le contenu de type timeline
export interface ModalTimelineProps {
    message?: string;
    username: string;
    timelineSteps: HistoryStep[];
    cancelButton: ButtonField;
}

// Interface générique pour ModalProps
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
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
