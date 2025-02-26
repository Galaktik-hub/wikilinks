"use client";

import * as React from "react";

const Title: React.FC<{ playerName?: string }> = ({ playerName }) => (
    <section
        className="w-full h-13 bg-gray-800 rounded-lg border-2 flex items-center justify-center py-3 px-6 text-xl font-bold text-white"
        style={{ borderColor: '#1D4ED8', borderWidth: '5px' }}
    >
        Partie de {playerName}
    </section>
);

export default Title;
