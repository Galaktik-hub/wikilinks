import React, {useEffect} from "react";
import BannerItem from "./BannerItem";
import CupSVG from "../../assets/Banner/CupSVG.tsx";
import StarSVG from "../../assets/Banner/StarSVG.tsx";
import DiceSVG from "../../assets/Banner/DiceSVG.tsx";
import {CircularBorder} from "./CircularBorder";
import {DecorativeLines} from "./DecorativeLines";
import {useWebSocket} from "../../context/WebSocketContext";

const Banner: React.FC = () => {
    const ws = useWebSocket();
    const [activeGames, setActiveGames] = React.useState<string>("0");
    const [activePlayers, setActivePlayers] = React.useState<string>("0");
    const [gamesPlayed, setGamesPlayed] = React.useState<string>("0");

    const formatNumber = (value: number): string => {
        const abs = Math.abs(value);
        if (abs >= 1e6) {
            return (value / 1e6).toPrecision(3) + "M";
        }
        if (abs >= 1e3) {
            return (value / 1e3).toPrecision(3) + "k";
        }
        return value.toString();
    };

    const handleBannerData = (info: {activeGames: number; activePlayers: number; gamesPlayed: number}) => {
        setActiveGames(formatNumber(info.activeGames));
        setActivePlayers(formatNumber(info.activePlayers));
        setGamesPlayed(formatNumber(info.gamesPlayed));
    };

    useEffect(() => {
        const handler = (data: any) => {
            if (data.kind === "home_info") {
                handleBannerData(data.bannerInfo);
            }
        };
        ws.onMessage(handler);
        return () => ws.offMessage(handler);
    }, [ws]);

    return (
        <div className="w-full bg-background text-center overflow-hidden relative py-8 mb-6">
            {/* Background grid and image */}
            <div className="absolute inset-0 z-0">
                <div className="flex flex-wrap">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex flex-1 shrink py-2.5 basis-0 h-[200px] w-[110px]" />
                    ))}
                </div>
                <img
                    src="/wikiplanet.png"
                    className="absolute bottom-0 right-0 object-contain aspect-[1.57] min-w-60 w-[314px] shadow-md brightness-[0.4] contrast-75"
                    alt=""
                />
            </div>

            {/* Decorative elements */}
            <DecorativeLines />
            <CircularBorder />

            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 z-5 bg-blue-700 bg-opacity-60" />

            {/* Content */}
            <div className="relative md:flex md:justify-around md:items-center">
                <div className="text-white text-lg md:text-2xl mb-8 md:mb-0 font-inter px-8 md:ml-2 md:px-0 md:max-w-2xl md:flex-1">
                    Affrontez vos amis à travers les pages de <span className="font-bold">Wikipédia</span> en vous aidant des{" "}
                    <span className="font-bold">bonus</span> que vous trouverez en chemin !
                </div>

                <div className="flex justify-evenly items-center md:justify-center md:gap-16 md:flex-1">
                    <BannerItem icon={<CupSVG />} number={activePlayers} text="Joueurs actifs" />
                    <BannerItem icon={<StarSVG />} number={gamesPlayed} text="Parties jouées" />
                    <BannerItem icon={<DiceSVG />} number={activeGames} text="Parties actives" />
                </div>
            </div>
        </div>
    );
};

export default Banner;
