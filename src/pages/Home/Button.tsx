"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "blue" | "transparent";
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = "primary",
                                                  children,
                                                  className = "",
                                                  ...props
                                              }) => {
    const baseStyles = "text-base text-center text-white rounded-lg min-h-12";

    const variantStyles = {
        primary: "bg-sky-500 shadow-[0px_4px_6px_rgba(29,151,216,0.5)]",
        secondary: "bg-white bg-opacity-20",
        blue: "bg-blue-600",
        transparent: "bg-transparent",
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
