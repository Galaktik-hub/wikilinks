"use client";

import React, { useState } from "react";
import Layout from "../../components/Layout";
import Header from "../../components/Header/Header";
import GameEndScreen from "../../components/Sections/Game/EndGame/GameEndScreen";

const TestEndScreen: React.FC = () => {
    const [showEndScreen, setShowEndScreen] = useState(false);

    return (
        <Layout header={<Header />}>
            <div className="flex flex-col w-full h-full items-center justify-center p-4">
                <h1 className="text-3xl font-righteous text-white mb-8">
                    Test de l'écran de fin de partie
                </h1>
                
                <button
                    onClick={() => setShowEndScreen(true)}
                    className="px-8 py-4 bg-bluePrimary hover:bg-blueSecondary text-white font-semibold rounded-lg transition-colors font-inter"
                >
                    Afficher l'écran de fin
                </button>
                
                <GameEndScreen 
                    isVisible={showEndScreen} 
                    onClose={() => setShowEndScreen(false)} 
                />
            </div>
        </Layout>
    );
};

export default TestEndScreen;
