import React from 'react';
import logo from '../../assets/logo.png';

const Logo: React.FC = () => {
    return (
        <div className={"flex items-end justify-center leading-none"}>
            <img src={logo} alt="W" className={"h-10 w-auto"} />
            <span className={"text-xl text-white font-medium font-martian-mono"}>ikilinks</span>
        </div>
    );
};

export default Logo;