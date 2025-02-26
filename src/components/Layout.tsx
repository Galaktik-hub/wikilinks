import React from "react";
import {useMediaQuery} from "react-responsive";

interface LayoutProps {
    header?: React.ReactNode;
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, children }) => {

    const isMobile = useMediaQuery({maxWidth: 767});
    if (isMobile) {
        return (
            <div className="min-h-screen flex flex-col md:flex-row">

                <main className="bg-primary md:w-1/2 flex flex-col">
                    <div className="flex flex-col flex-1">
                        {header}
                        {children}
                    </div>
                </main>
            </div>
        )
    } else {
        return (
            <div className="min-h-screen flex flex-col md:flex-row">

                <aside className="flex w-1/4 bg-gray-600">

                </aside>
                <main className="bg-primary w-1/2 flex flex-col">
                    <div className="flex flex-col flex-1">
                        {header}
                        {children}
                    </div>
                </main>
                <aside className="flex w-1/4 bg bg-gray-600">

                </aside>
            </div>
        )
    }
};

export default Layout;
