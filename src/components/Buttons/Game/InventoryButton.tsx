import React, {useState, useEffect, useRef} from "react";
import InventorySVG from "../../../assets/Game/InventorySVG.tsx";
import InventoryPanel from "../../Sections/Game/Inventory/InventoryPanel.tsx";

const InventoryButton: React.FC<{disabled?: boolean}> = ({disabled = false}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showText, setShowText] = useState(true);
    const panelRef = useRef<HTMLDivElement>(null);

    // Cache le texte après 10 secondes si le panel n'est pas ouvert
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => setShowText(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Ferme l'overlay lorsqu'on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    if (!isOpen) {
        return (
            <div className="absolute right-0 p-5 bottom-20">
                <button
                    onClick={() => setIsOpen(true)}
                    disabled={disabled}
                    className="inline-flex gap-2 items-center p-4 bg-blue-700 rounded-lg cursor-pointer h-[50px]">
                    <InventorySVG />
                    {showText && <span className="text-base text-white max-md:text-base max-sm:text-sm">Inventaire</span>}
                </button>
            </div>
        );
    }

    return (
        <div ref={panelRef} className="absolute flex bottom-20 left-1/2 -translate-x-1/2 justify-center items-center mb-2.5">
            {/*Gérer les compteurs d'items en back, ici il recréé le composant avec les compteurs initiaux*/}
            <InventoryPanel gpsCount={5} retourCount={1} mineCount={3} />
        </div>
    );
};

export default InventoryButton;
