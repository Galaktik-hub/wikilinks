import React, {createContext, useState, useContext} from "react";

interface WikiNavigationContextType {
    currentTitle: string;
    setCurrentTitle: (title: string) => void;
}

export const WikiNavigationContext = createContext<WikiNavigationContextType | undefined>(undefined);

interface WikiNavigationProviderProps {
    children: React.ReactNode;
    className?: string;
    startArticle: string;
}

export const WikiNavigationProvider: React.FC<WikiNavigationProviderProps> = ({children, className, startArticle}) => {
    const [currentTitle, setCurrentTitle] = useState<string>(startArticle);
    return (
        <div className={className}>
            <WikiNavigationContext.Provider value={{currentTitle, setCurrentTitle}}>{children}</WikiNavigationContext.Provider>
        </div>
    );
};

export const useWikiNavigation = () => {
    const context = useContext(WikiNavigationContext);
    if (!context) {
        throw new Error("useWikiNavigation doit être utilisé dans un WikiNavigationProvider");
    }
    return context;
};
