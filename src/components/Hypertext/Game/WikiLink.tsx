import React from 'react';
import { useWikiNavigation } from '../../../context/WikiNavigationContext.tsx';

interface WikiLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    title: string; // Titre de l'article ciblé
}

const WikiLink: React.FC<WikiLinkProps> = ({ title, children, ...props }) => {
    const { setCurrentTitle } = useWikiNavigation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setCurrentTitle(title);
    };

    return (
        <a {...props} href="#" onClick={handleClick}>
            {children}
        </a>
    );
};

export default WikiLink;
