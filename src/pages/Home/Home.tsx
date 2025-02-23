"use client";
import React from "react";
import { CreateGameSection } from "./CreateGameSection";
import { JoinGameSection } from "./JoinGameSection";
import { DailyChallengeSection } from "./DailyChallengeSection";
import { PublicGamesList } from "./PublicGamesList";

export const Home: React.FC = () => {
    return (
        <div className="overflow-hidden mx-auto w-full bg-white rounded-lg border-2 border-gray-300 border-solid max-w-[480px]">
            <main className="w-full">
                <div className="flex flex-col flex-1 items-center py-4 w-full bg-gray-900">
                    <header className="py-3.5 pr-16 pl-24 max-w-full text-xl text-center text-white whitespace-nowrap w-[358px]">
                        ikiLinks
                    </header>

                    <div className="p-4 w-full">
                        <div className="max-w-full w-[358px] mx-auto">
                            <CreateGameSection />
                            <JoinGameSection />
                            <DailyChallengeSection />
                            <PublicGamesList />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
