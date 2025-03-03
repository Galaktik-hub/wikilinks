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

export const OptionSelector: React.FC<OptionSelectorProps> = ({
                                                                  options,
                                                                  selectedValue,
                                                                  onChange,
                                                              }) => {
    const handleClick = (value: number) => {
        if (selectedValue === value) {
            onChange(null);
        } else {
            onChange(value);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 text-sm font-light text-gray-400">
            {options.map((option) => (
                <button
                    key={option.value}
                    className={`w-10 text-center px-3 py-1 rounded-md transition-colors ${
                        selectedValue === option.value
                            ? "font-simple text-sky-500"
                            : "hover:text-sky-500"
                    }`}
                    onClick={() => handleClick(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
