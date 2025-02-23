"use client";
import React from "react";
import { HomeButton } from "../Buttons/HomeButton.tsx";

export const DailyChallengeSection: React.FC = () => {
    return (
        <section className="p-4 mt-6 w-full rounded-xl max-w-[358px] min-h-[179px]">
            <div className="flex gap-10 justify-between items-center text-white">
                <h2 className="text-base font-bold leading-none">Défi du jour</h2>
                <span className="px-2 pt-1.5 pb-3 text-sm whitespace-nowrap rounded-full bg-white bg-opacity-20">
          12:34:56
        </span>
            </div>

            <h3 className="py-3.5 mt-1.5 text-lg leading-none text-white">
                Les extincteurs
            </h3>

            <div className="flex gap-2 py-1 mt-1.5">
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/484f96ebd4185d35a35e64e256ef6b78b7e95089e837532a7ce8e5f63b555105"
                    className="w-5 aspect-[1.25]"
                    alt=""
                />
                <p className="text-sm leading-none text-white">
                    247 joueurs ont déjà joué aujourd'hui
                </p>
            </div>

            <HomeButton variant="secondary" className="px-16 w-full mt-1.5 font-bold">
                Jouez maintenant
            </HomeButton>
        </section>
    );
};
