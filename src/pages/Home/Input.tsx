"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
}

export const Input: React.FC<InputProps> = ({
                                                placeholder,
                                                className = "",
                                                ...props
                                            }) => {
    return (
        <input
            className={`px-3 py-4 w-full text-gray-400 bg-gray-700 rounded-lg ${className}`}
            placeholder={placeholder}
            {...props}
        />
    );
};
