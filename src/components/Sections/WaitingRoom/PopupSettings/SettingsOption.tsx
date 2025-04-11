import * as React from "react";

interface SettingsOptionProps {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}

export const SettingsOption: React.FC<SettingsOptionProps> = ({icon, label, children}) => {
    return (
        <section className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2.5">
                <div className="shrink-0 w-[30px] h-[30px] flex items-center justify-center">{icon}</div>
                <h2 className="text-base text-white">{label}</h2>
            </div>
            {children}
        </section>
    );
};
