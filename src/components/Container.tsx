import React from "react";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
    return (
        <div className={`p-4 bg-gray-800 rounded-xl border-2 border-blue-700 border-solid ${className}`}>
            {children}
        </div>
    );
};

export default Container;