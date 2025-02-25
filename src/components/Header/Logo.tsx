import React from 'react';

interface LogoProps {
    text: string;
}

const Logo: React.FC<LogoProps> = ({ text }) => {
    return (
        <div className="pt-4 pr-16 pb-2.5 pl-24 text-xl text-center text-white whitespace-nowrap max-w-[360px]">
            {text}
        </div>
    );
};

export default Logo;