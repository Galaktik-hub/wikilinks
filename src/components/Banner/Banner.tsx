import React from 'react';
import BannerItem from './BannerItem';
import CupSVG from "../../assets/CupSVG.tsx";
import StarSVG from "../../assets/StarSVG.tsx";
import DiceSVG from "../../assets/DiceSVG.tsx";
import { CircularBorder } from './CircularBorder';
import { DecorativeLines } from './DecorativeLines';

const Banner: React.FC = () => {
    return (
        <div className="w-fullbg-primary text-center overflow-hidden relative py-8 mb-6">
            {/* Background grid and image */}
            <div className="absolute inset-0 z-0">
                <div className="flex flex-wrap">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-1 shrink py-2.5 basis-0 bg-black bg-opacity-0 h-[200px] w-[110px]"
                        />
                    ))}
                </div>
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/a3499e695a8948379525afb53ffea904/14bd27d9f207455d697acdd5b7009aafda810766dd493b9c910247e6eb4b9519"
                    className="absolute bottom-0 right-0 object-contain aspect-[1.57] min-w-60 w-[314px] shadow-md brightness-[0.6] contrast-75"
                    alt=""
                />
            </div>

            {/* Decorative elements */}
            <DecorativeLines />
            <CircularBorder />

            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 z-5 bg-blue-700 bg-opacity-60" />

            {/* Content */}
            <div className="relative z-10">
                <div className="text-white text-lg mb-8 font-inter px-8">
                    Affrontez vos amis à travers les pages de{' '}
                    <span className="font-bold">Wikipédia</span> en vous aidant des {' '}
                    <span className="font-bold">bonus</span> que vous trouverez en chemin !
                </div>
                
                <div className="flex justify-around items-center">
                    <BannerItem
                        icon={<CupSVG />}
                        number="1500+"
                        text="Joueurs actifs"
                    />
                    <BannerItem
                        icon={<StarSVG />}
                        number="1.5K"
                        text="Parties jouées"
                    />
                    <BannerItem
                        icon={<DiceSVG />}
                        number="200+"
                        text="Parties actives"
                    />
                </div>
            </div>
        </div>
    );
};

export default Banner;