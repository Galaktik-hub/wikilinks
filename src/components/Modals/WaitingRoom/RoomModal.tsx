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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">
                    Entrez votre pseudo et le code de salle
                </h2>
                <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    className="border p-2 w-full mb-4"
                    placeholder="Votre pseudo"
                />
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="border p-2 w-full mb-4"
                    placeholder="Code de salle (6 chiffres)"
                />
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                >
                    Valider
                </button>
            </div>
        </div>
    );
};

export default RoomModal;
