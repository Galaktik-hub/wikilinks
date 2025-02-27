"use client";
import React from "react";
import Layout from "../../components/Layout";
import { DailyChallengeSection } from "../../components/Sections/Home/DailyChallengeSection.tsx";
import { PublicGamesList } from "../../components/Sections/Home/PublicGamesList.tsx";
import Header from "../../components/Header/Header.tsx";
import Banner from "../../components/Banner/Banner.tsx";
import CreateOrJoinGame from "../../components/Cards/Home/CreateOrJoinGame.tsx";

const Home: React.FC = () => {
    return (
        <Layout header={<Header/>}>
            <div className="flex flex-col w-full overflow-hidden items-center justify-center">
                <Banner />
                <CreateOrJoinGame />
                <DailyChallengeSection />
                <PublicGamesList />
            </div>
        </Layout>
    );
};

export default Home;
