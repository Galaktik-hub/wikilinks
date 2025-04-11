import * as React from "react";

interface GameSettingsRowProps {
    label: string;
    value: string;
}

export const GameSettingsRow: React.FC<GameSettingsRowProps> = ({label, value}) => {
    return (
        <div className="flex gap-10 justify-between items-center py-1 w-full">
            <p className="self-stretch my-auto text-gray-400">{label}</p>
            <p className="self-stretch my-auto text-white">{value}</p>
        </div>
    );
};
