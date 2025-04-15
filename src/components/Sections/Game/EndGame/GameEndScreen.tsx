"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface GameEndScreenProps {
    isVisible: boolean;
}

const GameEndScreen: React.FC<GameEndScreenProps> = ({ isVisible }) => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const redirectTime = 5000; // 5 seconds

    // Progress effect for smooth transition
    useEffect(() => {
        let animationFrame: number;
        let startTime: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const newProgress = Math.min(elapsed / redirectTime, 1);

            setProgress(newProgress);

            if (newProgress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                // Redirect to results page
                navigate("/result");
            }
        };

        if (isVisible) {
            animationFrame = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [isVisible, navigate]);

    // Reset progress when component re-opens
    useEffect(() => {
        if (isVisible) {
            setProgress(0);
        }
    }, [isVisible]);

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

                        <div className="text-center">
                            <motion.div
                                className="flex justify-center mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <svg className="w-24 h-24 text-bluePrimary" viewBox="0 0 24 24">
                                    <motion.path
                                        fill="none"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                    />
                                    <motion.path
                                        fill="none"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        d="M22 4L12 14.01l-3-3"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.5 }}
                                    />
                                </svg>
                            </motion.div>

                            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                                <motion.div
                                    className="bg-bluePrimary h-2.5 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress * 100}%` }}
                                    transition={{ ease: "linear" }}
                                />
                            </div>

                            <motion.p
                                className="text-white font-inter text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                Préparation des résultats...
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GameEndScreen;