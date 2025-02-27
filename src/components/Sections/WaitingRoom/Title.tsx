"use client";

import * as React from "react";
import Container from "../../Container.tsx";

const Title: React.FC<{ playerName?: string }> = ({ playerName }) => (
    <Container
        className="w-full h-13 mb-3 flex items-center justify-center text-xl font-bold text-white"
    >
        Partie de {playerName}
    </Container>
);

export default Title;
