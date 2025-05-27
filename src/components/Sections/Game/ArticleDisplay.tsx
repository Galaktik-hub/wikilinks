import React, {useState, useEffect, useCallback, useMemo} from "react";
import {generateTOC, TOCItem} from "../../../utils/Game/TOCutils.ts";
import TOC from "./TOC.tsx";
import parse, {domToReact, HTMLReactParserOptions, Element, DOMNode} from "html-react-parser";
import WikiLink from "../../Hypertext/Game/WikiLink";
import {cleanHTMLContent, getArtifactKeyword} from "../../../utils/Game/ArticleCleaningUtils.ts";
import {useNavigate} from "react-router-dom";
import {useGameContext} from "../../../context/GameContext.tsx";
import {useChallengeContext} from "../../../context/ChallengeContext";
import ArtifactKeyword from "./ArtifactKeyword";

interface ArticleDisplayProps {
    className?: string;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({className}) => {
    const gameContext = useGameContext();
    const challengeContext = useChallengeContext();
    const [content, setContent] = useState("");
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [artifactKeyword, setArtifactKeyword] = useState<string | null>(null);
    const sectionsToRemove = ["Voir aussi", "Notes et références", "Références"];
    const navigate = useNavigate();
    const currentTitle = challengeContext.sessionId !== "" ? challengeContext.currentTitle : gameContext.currentTitle;

    const fetchArticle = useCallback(async () => {
        try {
            const url = `https://fr.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(currentTitle)}&prop=text&format=json&origin=*`;
            const response = await fetch(url);
            const textResponse = await response.text();
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (jsonError) {
                throw new Error("La réponse n'est pas au format JSON attendu : " + jsonError);
            }
            if (data.error) {
                throw new Error(data.error.info || "Erreur inconnue");
            }
            const htmlContent: string = data.parse.text["*"];
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");

            // Extraction de l'image principale depuis l'infobox
            let imageUrl: string | null = null;
            const infobox = doc.querySelector(".infobox");
            if (infobox) {
                const img = infobox.querySelector("img");
                if (img) imageUrl = img.src;
                infobox.remove();
            }
            setMainImage(imageUrl);

            // Sélection du contenu principal
            const mainContent = doc.querySelector(".mw-parser-output");
            const finalHTML = mainContent ? cleanHTMLContent(mainContent, sectionsToRemove) : cleanHTMLContent(doc.body, sectionsToRemove);
            setContent(finalHTML);
            setTocItems(generateTOC(finalHTML));
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("Une erreur inconnue s'est produite.");
        }

        // Reset le scroll de la page
        const content = document.querySelector("main");
        if (content) content.scrollTop = 0;
        // Supprime le hash de l'URL
        navigate(window.location.pathname + window.location.search, {replace: true});
    }, [currentTitle]);

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

    const insertArtifactWord = useCallback(() => {
        if (gameContext.artifactInfo.hasArtifact && content) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, "text/html");
            const links = doc.querySelectorAll("a");
            if (links.length <= 1) {
                // pas assez de liens -> pas d'artefact
                gameContext.setArtifactInfo({hasArtifact: false, luckPercentage: null});
                setArtifactKeyword(null);
                return;
            }
            const word = getArtifactKeyword(content);
            setArtifactKeyword(word);
        } else if (!content.trim()) {
            setArtifactKeyword(null);
        }
    }, [content, gameContext.artifactInfo, currentTitle]);

    useEffect(() => {
        insertArtifactWord();
    }, [insertArtifactWord]);

    const options: HTMLReactParserOptions = useMemo(
        () => ({
            replace: domNode => {
                console.log("replace", content);
                // Transformation des liens internes en composant WikiLink
                if (domNode instanceof Element && domNode.name === "a") {
                    const href = domNode.attribs.href;
                    if (href && (href.startsWith("/wiki/") || href.includes("fr.wikipedia.org/wiki/"))) {
                        const newTitle = decodeURIComponent(href.split("/wiki/")[1] || "");
                        return <WikiLink title={newTitle}>{domToReact(domNode.children as DOMNode[], options)}</WikiLink>;
                    }
                    return <span style={{cursor: "default", textDecoration: "underline"}}>{domToReact(domNode.children as DOMNode[], options)}</span>;
                }
                // remplacement du mot artefact en bouton, une seule fois
                if (domNode.type === "text" && artifactKeyword && gameContext.artifactInfo.hasArtifact) {
                    const text = domNode.data as string;
                    const idx = text.indexOf(artifactKeyword);
                    if (idx !== -1) {
                        const before = text.slice(0, idx);
                        const after = text.slice(idx + artifactKeyword.length);
                        return (
                            <>
                                {before}
                                <ArtifactKeyword key={currentTitle} text={artifactKeyword} />
                                {after}
                            </>
                        );
                    }
                }
            },
        }),
        [artifactKeyword, gameContext.artifactInfo, currentTitle],
    );

    if (error) return <p>Erreur : {error}</p>;
    if (!content) return <p>Chargement...</p>;

    return (
        <div className={`article-content ${className}`}>
            {mainImage && <img src={mainImage} alt={currentTitle} className="article-image" />}
            <h1 className="text-center text-white my-4">{currentTitle.replace(/_/g, " ")}</h1>
            {tocItems.length > 0 && <TOC items={tocItems} />}
            <div>{parse(content, options)}</div>
        </div>
    );
};

export default ArticleDisplay;
