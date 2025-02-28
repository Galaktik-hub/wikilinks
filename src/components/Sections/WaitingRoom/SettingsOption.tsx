import * as React from "react";

interface SettingsOptionProps {
    iconUrl: string;
    label: string;
    children: React.ReactNode;
}

export const SettingsOption: React.FC<SettingsOptionProps> = ({
                                                                  iconUrl,
                                                                  label,
                                                                  children,
                                                              }) => {
    return (
        <section className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2.5">
                <img
                    src={iconUrl}
                    alt=""
                    className="object-contain shrink-0 aspect-square w-[30px]"
                />
                <h2 className="text-base text-white">{label}</h2>
            </div>
            {children}
        </section>
    );
};
