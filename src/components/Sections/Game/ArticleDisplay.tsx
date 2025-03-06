import React, { useState, useEffect, useRef } from 'react';
import { removeClasses, generateTOC, TOCItem, removeParagraphsWithoutRealLinks } from "../../../utils/Game/TOCutils.ts";
import TOC from "./TOC.tsx";

interface ArticleDisplayProps {
    title: string;
    // Dès qu'on trouve la section cutSection, on supprime ce header et tout ce qui suit.
    cutSection?: string;
    className?: string;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ title, cutSection, className }) => {
    const [currentTitle, setCurrentTitle] = useState(title);
    const [content, setContent] = useState('');
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

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
                    throw new Error("La réponse n'est pas au format JSON attendu.");
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
                            let headerElement: HTMLElement | null = null;
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
                    let cleanedHTML = removeClasses(mainContent.innerHTML);
                    cleanedHTML = removeParagraphsWithoutRealLinks(cleanedHTML);
                    setContent(cleanedHTML);
                    setTocItems(generateTOC(cleanedHTML));
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

    // Gestion des clics sur les liens internes pour recharger l'article dans le même composant
    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (anchor) {
                const href = anchor.getAttribute('href');
                if (href && (href.startsWith('/wiki/') || href.includes('fr.wikipedia.org/wiki/'))) {
                    e.preventDefault();
                    const wikiPrefix = '/wiki/';
                    let newTitle = '';
                    if (href.startsWith(wikiPrefix)) {
                        newTitle = decodeURIComponent(href.substring(wikiPrefix.length));
                    } else {
                        const parts = href.split('/wiki/');
                        if (parts[1]) newTitle = decodeURIComponent(parts[1]);
                    }
                    if (newTitle && newTitle !== currentTitle) setCurrentTitle(newTitle);
                }
            }
        };
        const container = contentRef.current;
        if (container) container.addEventListener('click', handleLinkClick);
        return () => {
            if (container) container.removeEventListener('click', handleLinkClick);
        };
    }, [currentTitle]);

    if (error) return <p>Erreur : {error}</p>;
    if (!content) return <p>Chargement...</p>;

    return (
        <div className={`article-content ${className}`}>
            {mainImage && (
                <img src={mainImage} alt={currentTitle} className="article-image" />
            )}
            {tocItems.length > 0 && <TOC items={tocItems} />}
            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default ArticleDisplay;
