import React from 'react';
import logo from '../../assets/Logo/logo.png';

const Logo: React.FC = () => {
    return (
        <div className={"flex items-center justify-center leading-none"}>
            <img src={logo} alt="W" className={"h-[60px] w-auto -mb-2"} />
            <span className={"text-lg self-end text-white font-medium font-martian-mono -ml-3"}>ikilinks</span>
        </div>
    );
};

export default Logo;