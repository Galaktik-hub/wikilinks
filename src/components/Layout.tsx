import React from "react";

interface LayoutProps {
    header?: React.ReactNode;
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, children }) => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <aside className="hidden md:flex md:w-1/4 bg-gray-600">

            </aside>
            <main className="bg-primary md:w-1/2 flex flex-col">
                <div className="flex flex-col flex-1">
                    {header}
                    {children}
                </div>
            </main>
            <aside className="hidden md:flex md:w-1/4 bg bg-gray-600">

            </aside>
        </div>
    );
};

export default Layout;
