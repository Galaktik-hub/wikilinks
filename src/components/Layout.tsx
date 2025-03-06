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
            <div className="min-h-screen bg-primary flex flex-col md:flex-row">

                <main className="md:w-1/2 flex flex-col">
                    <div className="flex flex-col flex-1">
                        {header}
                        {children}
                    </div>
                </main>
            </div>
        )
    } else {
        return (
            <div className="min-h-screen bg-primary flex flex-col md:flex-row">

                <aside className="flex md:w-[15%] xl-custom:w-1/4 bg-gray-600">

                </aside>
                <main className="w-full md:w-[70%] xl-custom:w-1/2 flex flex-col">
                    <div className="flex flex-col flex-1">
                        {header}
                        {children}
                    </div>
                </main>
                <aside className="flex md:w-[15%] xl-custom:w-1/4 bg-gray-600">

                </aside>
            </div>
        )
    }
};

export default Layout;
