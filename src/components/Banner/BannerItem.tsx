import React from 'react';

interface BannerItemProps {
    icon: React.ReactNode;
    number: string;
    text: string;
}

const BannerItem: React.FC<BannerItemProps> = ({ icon, number, text }) => {
    return (
        <div className="flex flex-col justify-between items-center gap-2 font-martian-mono">
            <div className="text-white w-12 h-12">
                {icon}
            </div>
            <div className="text-white text-2xl font-righteous font-thin">
                {number}
            </div>
            <div className="text-white text-sm flex flex-col font-righteous">
                {text.split(' ').slice(0, 1).join(' ')}
                <span className="block">{text.split(' ').slice(1).join(' ')}</span>
            </div>
        </div>
    );
};

export default BannerItem;
