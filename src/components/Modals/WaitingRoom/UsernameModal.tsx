"use client";

import * as React from "react";

interface UsernameModalProps {
    onSubmit: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ onSubmit }) => {
    const [input, setInput] = React.useState("");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Choisissez votre pseudo</h2>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Votre pseudo"
                />
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        if (input.trim()) {
                            onSubmit(input.trim());
                        }
                    }}
                >
                    Valider
                </button>
            </div>
        </div>
    );
};

export default UsernameModal;
