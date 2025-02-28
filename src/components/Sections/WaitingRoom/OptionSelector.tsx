import * as React from "react";

interface Option {
    label: string;
    value: string | number;
}

interface OptionSelectorProps {
    options: Option[];
    selectedValue: string | number;
    onChange: (value: string | number) => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedValue, onChange }) => {
    return (
        <div className="flex flex-wrap gap-2 text-sm font-light text-gray-400">
            {options.map((option) => (
                <button
                    key={option.value}
                    className={`px-3 py-1 rounded-md border border-gray-600 ${
                        selectedValue === option.value ? "font-medium text-sky-500 border-sky-500" : ""
                    }`}
                    onClick={() => onChange(option.value)} // Met à jour la valeur sélectionnée
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
