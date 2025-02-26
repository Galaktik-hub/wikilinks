"use client";
import React from "react";
import Layout from "../components/Layout";
import Title from "../components/WaitingRoomSection/Title.tsx";
import GameRoomCard from "../components/WaitingRoomSection/GameRoomCard.tsx";

const WaitingRoom: React.FC = () => {
    return (
        <Layout header={<div/>}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4">
                <Title playerName={"Pierre"} />
                <GameRoomCard codegame={123456} playerCount={10} maxPlayers={10} />
            </div>
        </Layout>
    );
};

export default WaitingRoom;
