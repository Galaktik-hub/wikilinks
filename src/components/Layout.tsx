import React from "react";
import {useMediaQuery} from "react-responsive";

interface LayoutProps {
    header?: React.ReactNode;
    leftColumn?: React.ReactNode;
    rightColumn?: React.ReactNode;
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, children, leftColumn, rightColumn }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isBetween = useMediaQuery({ minWidth: 768, maxWidth: 1199 });

    if (isMobile) {
        return (
            <div className="h-[100vh] bg-primary flex flex-col md:flex-row overflow-hidden">
                <main className="md:w-1/2 flex flex-col overflow-auto">
                    <div className="flex flex-col flex-1">
                        {header}
                        {children}
                    </div>
                </main>
            </div>
        );
    } else if (isBetween) {
        return (
            <div className="h-[100vh] bg-primary flex flex-col md:flex-row overflow-hidden">
                <aside className="flex flex-col justify-center items-center md:w-[15%] xl-custom:w-1/4 bg-gray-600 gap-2.5 p-2.5">
                    {/* Asides vides */}
                </aside>
                <main className="w-full md:w-[70%] xl-custom:w-1/2 flex flex-col overflow-auto">
                    <div className="flex flex-col flex-1">
                        {header}
                        {children}
                    </div>
                </main>
                <aside className="flex flex-col justify-center items-center md:w-[15%] xl-custom:w-1/4 bg-gray-600 gap-2.5 p-2.5">
                    {/* Asides vides */}
                </aside>
            </div>
        );
    } else {
        return (
            <div className="h-[100vh] bg-primary flex flex-col md:flex-row overflow-hidden">
                <aside className="flex flex-col justify-center items-center md:w-[15%] xl-custom:w-1/4 bg-gray-600 gap-2.5 p-2.5">
                    {leftColumn}
                </aside>
                <main className="w-full md:w-[70%] xl-custom:w-1/2 flex flex-col overflow-auto">
                    <div className="flex flex-col flex-1">
                        {header}
                        {children}
                    </div>
                </main>
                <aside className="flex flex-col justify-center items-center md:w-[15%] xl-custom:w-1/4 bg-gray-600 gap-2.5 p-2.5">
                    {rightColumn}
                </aside>
            </div>
        );
    }
};

export default Layout;