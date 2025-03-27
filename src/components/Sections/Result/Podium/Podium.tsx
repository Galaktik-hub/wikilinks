"use client";
import { PodiumPosition } from "./PodiumPosition";

export default function Podium() {
    return (
        <article className="flex gap-2 justify-center items-end p-5 text-base bg-gray-800 rounded-lg border-2 border-blue-700 border-solid">
            <section className="flex flex-1 shrink gap-10 justify-between items-end px-6 w-full basis-0 min-w-60">
                <PodiumPosition
                    playerNumber="Joueur 2"
                    position="2e"
                    heightClass="min-h-20"
                    playerIconSize="w-16 min-h-12"
                    textColorClass="text-gray-400"
                />
                <PodiumPosition
                    playerNumber="Joueur 1"
                    position="1er"
                    heightClass="min-h-24"
                    playerIconSize="w-16 min-h-16"
                    textColorClass="text-amber-400"
                />
                <PodiumPosition
                    playerNumber="Joueur 3"
                    position="3e"
                    heightClass="min-h-16"
                    playerIconSize="w-16 min-h-12"
                    textColorClass="text-amber-600"
                />
            </section>
        </article>
    );
}
