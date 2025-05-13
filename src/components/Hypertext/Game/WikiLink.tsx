import React from "react";
import {useWikiNavigation} from "../../../context/WikiNavigationContext.tsx";
import {useWebSocket} from "../../../context/WebSocketContext.tsx";

interface WikiLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    title: string; // Titre de l'article ciblé
}

const WikiLink: React.FC<WikiLinkProps> = ({title, children, ...props}) => {
    const socketContext = useWebSocket();
    const {setCurrentTitle} = useWikiNavigation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setCurrentTitle(title);

        socketContext.send({
            kind: "game_event",
            event: {
                type: "visitedPage",
                page_name: title,
            },
        });
    };

    return (
        <a {...props} href="#" onClick={handleClick}>
            {children}
        </a>
    );
};

export default WikiLink;
