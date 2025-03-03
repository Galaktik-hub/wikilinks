"use client";
import React from "react";
import Layout from "../components/Layout";
import Title from "../components/Sections/WaitingRoom/TitleParty/Title.tsx";
import GameRoomCard from "../components/Sections/WaitingRoom/GameCode/GameRoomCard.tsx";
import DeleteButton from "../components/Buttons/WaitingRoom/DeleteButton.tsx";
import ValidateButton from "../components/Buttons/WaitingRoom/ValidateButton.tsx";
import GameSettings from "../components/Sections/WaitingRoom/GameSettings/GameSettings.tsx";
import PlayerList from "../components/Sections/WaitingRoom/Player/PlayerList.tsx";

const WaitingRoom: React.FC = () => {
    return (
        <Layout header={<div/>}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4">
                <Title playerName={"Pierre"} />
                <GameRoomCard codegame={123456} playerCount={4} maxPlayers={10} />
                <GameSettings isAdmin={true}/>
                <PlayerList/>
                <ValidateButton/>
                <DeleteButton isAdmin={true}></DeleteButton>
            </div>
        </Layout>
    );
};

export default WaitingRoom;
