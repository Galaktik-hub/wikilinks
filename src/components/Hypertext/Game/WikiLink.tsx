import React, {useContext} from "react";
import {useWikiNavigation} from "../../../context/WikiNavigationContext.tsx";
import {SocketContext} from "../../../context/SocketContext.tsx";

interface WikiLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    title: string; // Titre de l'article ciblé
}

const WikiLink: React.FC<WikiLinkProps> = ({title, children, ...props}) => {
    const socket = useContext(SocketContext);
    const {setCurrentTitle} = useWikiNavigation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setCurrentTitle(title);

        socket?.sendMessageToServer({
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
