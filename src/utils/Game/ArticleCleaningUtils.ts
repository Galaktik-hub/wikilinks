// ArticleCleaningUtils.ts
export const removeClasses = (html: string): string => {
    return html.replace(/\s*(class|style)="[^"]*"/g, "");
};

export const cleanHTMLContent = (html: Element, sectionsToRemove?: string[]): string => {
    // Coupure brutale à partir de l'une des sections à supprimer, si définie
    if (sectionsToRemove && sectionsToRemove.length > 0) {
        const children = Array.from(html.children);
        const sectionsToRemoveLower = sectionsToRemove.map(s => s.trim().toLowerCase());
        const index = children.findIndex(child => {
            let headerElement: HTMLElement | null;
            if (child.matches('h2')) {
                headerElement = child as HTMLElement;
            } else {
                headerElement = child.querySelector('h2');
            }
            if (headerElement) {
                const headerText = headerElement.textContent;
                if (headerText && sectionsToRemoveLower.includes(headerText.trim().toLowerCase())) {
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

    const parser = new DOMParser();
    const doc = parser.parseFromString(html.innerHTML, "text/html");

    doc.querySelectorAll('.mw-editsection').forEach(el => el.remove());
    doc.querySelectorAll('img').forEach(img => img.remove());

    // Supprimer tous les tableaux pour éviter un affichage déformé
    doc.querySelectorAll('table').forEach(table => table.remove());

    // Supprimer tous les cite_note dans tous les éléments
    doc.querySelectorAll('sup').forEach(sup => {
        if (sup.querySelector('a[href^="#cite_note-"]')) {
            sup.remove();
        }
    });

    // Supprimer les paragraphes sans lien réel (les liens cite_note étant exclus)
    doc.querySelectorAll('p').forEach(paragraph => {
        const anchors = paragraph.querySelectorAll('a');
        const hasRealLink = Array.from(anchors).some(a => {
            const href = a.getAttribute('href') || '';
            return href && !href.startsWith('#cite_note-');
        });
        if (!hasRealLink) {
            paragraph.remove();
        } else {
            paragraph.querySelectorAll('sup').forEach(sup => {
                if (sup.querySelector('a[href^="#cite_note-"]')) {
                    sup.remove();
                }
            });
        }
    });

    let cleanedHTML = doc.body.innerHTML;
    cleanedHTML = removeClasses(cleanedHTML);
    return cleanedHTML;
};
