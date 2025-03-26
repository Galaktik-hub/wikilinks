export interface TOCItem {
    text: string;
    id: string;
    tag: string;
}

export const generateTOC = (html: string): TOCItem[] => {
    const tocItems: TOCItem[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // On récupère les titres h2 pour le sommaire
    const headers = doc.querySelectorAll('h2');
    headers.forEach((header) => {
        let text = header.textContent?.trim() || '';
        let id = header.getAttribute('id');
        // On supprime la partie du texte entre crochet
        const openBracketIndex = text.indexOf('[');
        if (openBracketIndex !== -1) {
            text = text.slice(0, openBracketIndex).trim();
        }
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