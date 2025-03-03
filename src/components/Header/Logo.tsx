import React from 'react';
import logo from '/wikilinks_logo.png';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
    return (
        <Link to="/" className={"flex items-center justify-center leading-none"}>
            <img src={logo} alt="W" className={"h-[45px] w-auto"} />
            <span className={"text-xl self-end text-white font-medium font-martian-mono"}>ikilinks</span>
        </Link>
    );
};

export default Logo;