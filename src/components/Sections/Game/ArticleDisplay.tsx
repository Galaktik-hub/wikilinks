import React, { useState, useEffect } from 'react';
import { removeClasses, generateTOC, TOCItem, removeParagraphsWithoutRealLinks } from "../../../utils/Game/TOCutils.ts";
import TOC from "./TOC.tsx";
import parse, {domToReact, HTMLReactParserOptions, Element, DOMNode} from 'html-react-parser';
import { useWikiNavigation } from '../../../context/Game/WikiNavigationContext';
import WikiLink from '../../Hypertext/Game/WikiLink';

interface ArticleDisplayProps {
    cutSection?: string;
    className?: string;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ cutSection, className }) => {
    const { currentTitle } = useWikiNavigation();
    const [content, setContent] = useState('');
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
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

                const mainContent = doc.querySelector('.mw-parser-output');
                if (mainContent) {
                    // Suppression des liens "modifier" et des images restantes
                    mainContent.querySelectorAll('.mw-editsection').forEach(el => el.remove());
                    mainContent.querySelectorAll('img').forEach(img => img.remove());

                    // Coupure brutale à partir de la section cutSection, si définie
                    if (cutSection) {
                        const children = Array.from(mainContent.children);
                        const cutSectionLower = cutSection.trim().toLowerCase();
                        const index = children.findIndex(child => {
                            let headerElement: HTMLElement | null;
                            if (child.matches('h2')) {
                                headerElement = child as HTMLElement;
                            } else {
                                headerElement = child.querySelector('h2');
                            }
                            if (headerElement) {
                                const headerText = headerElement.textContent;
                                if (headerText && headerText.trim().toLowerCase() === cutSectionLower) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (index !== -1) {
                            for (let i = index; i < children.length; i++) {
                                children[i].remove();
                            }
                        }
                    }

                    // Nettoyage des classes et suppression des paragraphes sans liens "réels"
                    const cleanedHTML = removeClasses(mainContent.innerHTML);
                    const finalHTML = removeParagraphsWithoutRealLinks(cleanedHTML);
                    setContent(finalHTML);
                    setTocItems(generateTOC(finalHTML));
                } else {
                    const cleaned = removeClasses(htmlContent);
                    const final = removeParagraphsWithoutRealLinks(cleaned);
                    setContent(final);
                    setTocItems(generateTOC(final));
                }
            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError("Une erreur inconnue s'est produite.");
            }
        };

        fetchArticle();
    }, [currentTitle, cutSection]);

    // Transformation des liens internes en composant WikiLink
    const options: HTMLReactParserOptions = {
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
    };

    if (error) return <p>Erreur : {error}</p>;
    if (!content) return <p>Chargement...</p>;

    return (
        <div className={`article-content ${className}`}>
            {mainImage && (
                <img src={mainImage} alt={currentTitle} className="article-image" />
            )}
            {tocItems.length > 0 && <TOC items={tocItems} />}
            <div>
                {parse(content, options)}
            </div>
        </div>
    );
};

export default ArticleDisplay;
