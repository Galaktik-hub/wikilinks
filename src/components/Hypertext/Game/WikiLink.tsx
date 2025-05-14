import React from "react";
import {useWebSocket} from "../../../context/WebSocketContext.tsx";
import {useGameContext} from "../../../context/GameContext.tsx";

interface WikiLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    title: string; // Titre de l'article ciblé
}

const WikiLink: React.FC<WikiLinkProps> = ({title, children, ...props}) => {
    const socketContext = useWebSocket();
    const gameContext = useGameContext();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        gameContext.setCurrentTitle(title);

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
