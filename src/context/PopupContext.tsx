"use client";

import { createContext, useState, useContext, ReactNode } from "react";

export type PopupType = "info" | "error";

interface PopupContextProps {
    showPopup: (type: PopupType, message: string) => void;
}

const PopupContext = createContext<PopupContextProps>({
    showPopup: () => {},
});

interface PopupState {
    visible: boolean;
    type: PopupType;
    message: string;
}

interface PopupProviderProps {
    children: ReactNode;
}

export function PopupProvider({children}: PopupProviderProps) {
    const [popup, setPopup] = useState<PopupState>({
        visible: false,
        type: "info",
        message: "",
    });

    const showPopup = (type: PopupType, message: string) => {
        setPopup({ visible: true, type, message });
        setTimeout(() => {
            setPopup((prev) => ({ ...prev, visible: false }));
        }, 5000);
    };
    
    const bgPopup = popup.type === "info" ? "border-green-700" : "border-red-700";

    return (
        <PopupContext.Provider value={{showPopup}}>
            {children}
            {popup.visible && (
                <div className="fixed bottom-5 right-5">
                    <div className={`popup ${bgPopup}`}>
                        {popup.message}
                        <div className="w-full">
                            <div className="w-full h-1 bg-background rounded">
                                <div className="h-full bg-bluePrimary animate-progress rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PopupContext.Provider>
    );
};

export const usePopup = () => useContext(PopupContext);
