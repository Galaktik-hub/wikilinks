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
                    className={`w-[50px] text-center py-1 rounded-md transition-colors ${
                        selectedValue === option.value
                            ? "text-sky-500 font-semibold"
                            : "hover:text-sky-500 font-normal"
                    }`}
                    onClick={() => handleClick(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
