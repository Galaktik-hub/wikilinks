import * as React from "react";

interface Option {
    label: string;
    value: number;
}

interface OptionSelectorProps {
    options: Option[];
    selectedValue: string | number | null;
    onChange: (value: number | null) => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({options, selectedValue, onChange}) => {
    const handleClick = (value: number) => {
        // If the option is already selected, do nothing
        if (selectedValue !== value) {
            onChange(value);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 text-sm font-light text-gray-400">
            {options.map(option => (
                <button
                    key={option.value}
                    className={`inline-block px-2 py-1 min-w-[50px] text-center rounded-md transition-colors
                        ${selectedValue === option.value ? "text-bluePrimary font-semibold" : "hover:text-bluePrimary font-normal"}`}
                    onClick={() => handleClick(option.value)}>
                    {option.label}
                </button>
            ))}
        </div>
    );
};
