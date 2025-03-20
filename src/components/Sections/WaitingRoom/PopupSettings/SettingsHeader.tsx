import * as React from "react";

interface SettingsHeaderProps {
    title: string;
    icon: React.ReactNode;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
                                                                  title,
                                                                  icon,
                                                              }) => {
    return (
        <header className="flex gap-10 justify-between items-center pr-2.5 pl-32 w-full text-xl text-center whitespace-nowrap bg-blue-700 min-h-[50px] text-neutral-100">
            <h1 className="self-stretch my-auto">{title}</h1>
            <button>
                {icon}
            </button>
        </header>
    );
};
