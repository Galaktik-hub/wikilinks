"use client";

import * as React from "react";

interface RoomModalProps {
    onSubmit: (pseudo: string, code: string) => void;
}

// CE FICHIER EST TEMPORAIRE, A UTILISER POUR TESTER LA FONCTIONNALITÉ DE "CHAMBRES WEBSOCKET"

const RoomModal: React.FC<RoomModalProps> = ({ onSubmit }) => {
    const [pseudo, setPseudo] = React.useState("");
    const [code, setCode] = React.useState("");

    const handleSubmit = () => {
        // Validation : le pseudo ne doit pas être vide et le code doit être composé de 6 chiffres
        if (pseudo.trim() && /^\d{6}$/.test(code.trim())) {
            onSubmit(pseudo.trim(), code.trim());
        } else {
            alert("Veuillez entrer un pseudo et un code valide à 6 chiffres.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const isValid = pseudo.trim() && /^\d{6}$/.test(code.trim());

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#181D25] p-8 rounded-xl shadow-lg border border-gray-700 w-full max-w-md mx-4 transform transition-all">
                <h2 
                    className="text-xl font-bold mb-6 text-sky-500 text-center"
                    style={{ textShadow: "0px 0px 14px #0ea5e9" }}
                >
                    Rejoindre un salon
                </h2>
                
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-3 bg-[#12151A] text-white rounded-lg border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none"
                            placeholder="Votre pseudo"
                            autoFocus
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-3 bg-[#12151A] text-white rounded-lg border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none"
                            placeholder="Code de salle (6 chiffres)"
                            maxLength={6}
                        />
                    </div>
                </div>

                <button
                    className={`mt-6 w-full py-3 rounded-lg font-semibold transition-all duration-200 
                        ${isValid
                            ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/30' 
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    Rejoindre le salon
                </button>
            </div>
        </div>
    );
};

export default RoomModal;
