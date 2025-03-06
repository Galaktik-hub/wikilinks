export const removeClasses = (html: string): string => {
    return html.replace(/\s*class="[^"]*"/g, "");
};

export interface TOCItem {
    text: string;
    id: string;
    tag: string;
}

export const generateTOC = (html: string): TOCItem[] => {
    const tocItems: TOCItem[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // On récupère les titres h2 et h3 pour le sommaire
    const headers = doc.querySelectorAll('h2');
    headers.forEach((header) => {
        const text = header.textContent?.trim() || '';
        let id = header.getAttribute('id');
        if (!id && text) {
            // Génère un id simple à partir du texte
            id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            header.setAttribute('id', id);
        }
        if (text && id) {
            tocItems.push({ text, id, tag: header.tagName });
        }
    });
    return tocItems;
};

/**
 * Supprime tous les paragraphes (<p>) qui ne contiennent aucun lien "réel".
 * Un lien "réel" est défini comme un lien dont l'attribut href existe et ne commence pas par "#cite_note-".
 */
export const removeParagraphsWithoutRealLinks = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragraphs = doc.querySelectorAll('p');
    paragraphs.forEach(paragraph => {
        const anchors = paragraph.querySelectorAll('a');
        const hasRealLink = Array.from(anchors).some(a => {
            const href = a.getAttribute('href') || '';
            return href && !href.startsWith('#cite_note-');
        });
        if (!hasRealLink) {
            paragraph.remove();
        }
    });
    return doc.body.innerHTML;
};
