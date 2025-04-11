import React from "react";
import logo from "/wikilinks_logo.png";

const Logo: React.FC = () => {
    return (
        <div className={"flex items-center justify-center leading-none"}>
            <img src={logo} alt="W" className={"h-[45px] w-auto"} />
            <span className={"text-xl self-end text-white font-medium font-martian-mono"}>ikilinks</span>
        </div>
    );
};

export default Logo;
