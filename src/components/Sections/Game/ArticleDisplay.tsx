import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateTOC, TOCItem } from "../../../utils/Game/TOCutils.ts";
import TOC from "./TOC.tsx";
import parse, { domToReact, HTMLReactParserOptions, Element, DOMNode } from 'html-react-parser';
import { useWikiNavigation } from '../../../context/Game/WikiNavigationContext';
import WikiLink from '../../Hypertext/Game/WikiLink';
import {cleanHTMLContent} from "../../../utils/Game/ArticleCleaningUtils.ts";

interface ArticleDisplayProps {
    className?: string;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ className }) => {
    const { currentTitle } = useWikiNavigation();
    const [content, setContent] = useState('');
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sectionsToRemove = ["Voir aussi", "Notes et références"];

    const fetchArticle = useCallback(async () => {
        try {
            const url = `https://fr.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
                currentTitle
            )}&prop=text&format=json&origin=*`;
            const response = await fetch(url);
            const textResponse = await response.text();
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (jsonError) {
                throw new Error("La réponse n'est pas au format JSON attendu : " + jsonError);
            }
            if (data.error) {
                throw new Error(data.error.info || 'Erreur inconnue');
            }
            const htmlContent: string = data.parse.text["*"];
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");

            // Extraction de l'image principale depuis l'infobox
            let imageUrl: string | null = null;
            const infobox = doc.querySelector('.infobox');
            if (infobox) {
                const img = infobox.querySelector('img');
                if (img) imageUrl = img.src;
                infobox.remove();
            }
            setMainImage(imageUrl);

            // Sélection du contenu principal
            const mainContent = doc.querySelector('.mw-parser-output');
            let finalHTML = '';
            if (mainContent) {
                finalHTML = cleanHTMLContent(mainContent, sectionsToRemove);
            } else {
                finalHTML = cleanHTMLContent(doc.body, sectionsToRemove);
            }
            setContent(finalHTML);
            setTocItems(generateTOC(finalHTML));
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("Une erreur inconnue s'est produite.");
        }
        // Reset le scroll de la page
        const content = document.querySelector('main');
        if (content) content.scrollTop = 0;
    }, [currentTitle]);

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

    // Transformation des liens internes en composant WikiLink
    const options: HTMLReactParserOptions = useMemo(() => ({
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === 'a') {
                const href = domNode.attribs.href;
                if (href) {
                    // Cas des liens internes
                    if (href.startsWith('/wiki/') || href.includes('wikipedia.org/wiki/')) {
                        const wikiPrefix = '/wiki/';
                        let newTitle = '';
                        if (href.startsWith(wikiPrefix)) {
                            newTitle = decodeURIComponent(href.substring(wikiPrefix.length));
                        } else {
                            const parts = href.split('/wiki/');
                            if (parts[1]) newTitle = decodeURIComponent(parts[1]);
                        }
                        return (
                            <WikiLink title={newTitle}>
                                {domToReact(Array.from(domNode.children) as DOMNode[], options)}
                            </WikiLink>
                        );
                    } else {
                        // Pour les liens externes, on peut soit renvoyer un span, soit un <a> sans href
                        return (
                            <span style={{ cursor: 'default', textDecoration: 'underline' }}>
                              {domToReact(Array.from(domNode.children) as DOMNode[], options)}
                            </span>
                        );
                    }
                }
            }
        }
    }), []);

    if (error) return <p>Erreur : {error}</p>;
    if (!content) return <p>Chargement...</p>;

    return (
        <div className={`article-content ${className}`}>
            {mainImage && (
                <img src={mainImage} alt={currentTitle} className="article-image" />
            )}
            <h1 className="text-center text-white my-4">{currentTitle.replace(/_/g, " ")}</h1>
            {tocItems.length > 0 && <TOC items={tocItems} />}
            <div>
                {parse(content, options)}
            </div>
        </div>
    );
};

export default ArticleDisplay;