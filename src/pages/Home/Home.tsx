"use client";
import React from "react";
import Layout from "../../components/Layout";
import { DailyChallengeSection } from "../../components/HomeSections/DailyChallengeSection";
import { PublicGamesList } from "../../components/HomeSections/PublicGamesList";
import Header from "../../components/Header/Header.tsx";
import CreateOrJoinGame from "../../components/HomeSections/CreateOrJoinGame.tsx";

const Home: React.FC = () => {
    return (
        <Layout header={<Header/>}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center p-4">
                <CreateOrJoinGame />
                <DailyChallengeSection />
                <PublicGamesList />
            </div>
        </Layout>
    );
};

export default Home;
