import React from 'react';
import logo from '../../assets/logo.png';

const Logo: React.FC = () => {
    return (
        <div className={"flex items-center justify-center leading-none"}>
            <img src={logo} alt="W" className={"h-[50px] w-auto -mb-2"} />
            <span className={"text-base self-end text-white font-medium font-martian-mono -ml-2"}>ikilinks</span>
        </div>
    );
};

export default Logo;