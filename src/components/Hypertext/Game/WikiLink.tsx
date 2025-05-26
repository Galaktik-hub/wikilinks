import React from "react";
import {useWebSocket} from "../../../context/WebSocketContext.tsx";
import {useGameContext} from "../../../context/GameContext.tsx";
import {useChallengeContext} from "../../../context/ChallengeContext";

interface WikiLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    title: string; // Titre de l'article ciblé
}

const WikiLink: React.FC<WikiLinkProps> = ({title, children, ...props}) => {
    const socketContext = useWebSocket();
    const gameContext = useGameContext();
    const challengeContext = useChallengeContext();

    const sendGameEvent = () => {
        socketContext.send({
            kind: "game_event",
            event: {
                type: "visitedPage",
                page_name: title,
            },
        });
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (challengeContext.sessionId !== "") {
            challengeContext.setCurrentTitle(title);
            sendGameEvent();
        } else if (gameContext.changeCurrentTitle(title)) sendGameEvent();
    };

    return (
        <a {...props} href="#" onClick={handleClick}>
            {children}
        </a>
    );
};

export default WikiLink;
