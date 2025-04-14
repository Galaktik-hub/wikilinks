"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface GameEndScreenProps {
    isVisible: boolean;
    onClose: () => void;
}

const GameEndScreen: React.FC<GameEndScreenProps> = ({ isVisible, onClose }) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const isHost = true;

    // Countdown effect
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isVisible && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (isVisible && countdown === 0) {
            // Redirect to results page
            navigate("/result");
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isVisible, countdown, navigate]);

    // Reset countdown when component re-opens
    useEffect(() => {
        if (isVisible) {
            setCountdown(5);
        }
    }, [isVisible]);

    const handleReturnToLobby = () => {
        onClose();
        navigate("/room");
    };

    const handleReturnToHome = () => {
        onClose();
        navigate("/");
    };

    const handleStartNewGame = () => {
        onClose();
        navigate("/room");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-darkBg rounded-lg p-8 max-w-md w-full mx-4 border border-bluePrimary shadow-lg font-inter"
                        initial={{ scale: 0.9, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 50, opacity: 0 }}
                        transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 300,
                            delay: 0.1
                        }}
                    >
                        <h2 className="text-2xl font-bold text-center text-white mb-6 font-righteous">
                            Partie terminée !
                        </h2>

                        <div className="text-center mb-8">
                            <motion.div
                                className="text-6xl font-bold text-bluePrimary mb-4 font-righteous"
                                key={countdown}
                                initial={{ scale: 1.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 10 }}
                            >
                                {countdown}
                            </motion.div>
                            <motion.p
                                className="text-white font-inter text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Redirection vers les résultats...
                            </motion.p>
                        </div>

                        <motion.div
                            className="flex flex-col gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <motion.button
                                onClick={() => navigate("/result")}
                                className="w-full py-3 bg-bluePrimary hover:bg-blueSecondary text-white font-semibold rounded-lg transition-colors font-martian-mono"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Voir les résultats maintenant
                            </motion.button>

                            <motion.button
                                onClick={handleReturnToLobby}
                                className="w-full py-3 bg-bgSecondary hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors font-martian-mono"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Retourner au salon d'attente
                            </motion.button>

                            {isHost && (
                                <motion.button
                                    onClick={handleStartNewGame}
                                    className="w-full py-3 bg-bluePrimary hover:bg-blueSecondary text-white font-semibold rounded-lg transition-colors font-martian-mono"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Lancer une nouvelle partie
                                </motion.button>
                            )}

                            <motion.button
                                onClick={handleReturnToHome}
                                className="w-full py-3 border border-bluePrimary text-bluePrimary hover:bg-bluePrimary hover:text-white font-semibold rounded-lg transition-colors font-martian-mono"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Quitter et revenir à l'accueil
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GameEndScreen;