export const cleanHTMLContent = (html: Element, sectionsToRemove?: string[]): string => {
    // Coupure brutale à partir de l'une des sections à supprimer, si définie
    if (sectionsToRemove && sectionsToRemove.length > 0) {
        const children = Array.from(html.children);
        const sectionsToRemoveLower = sectionsToRemove.map(s => s.trim().toLowerCase());
        const index = children.findIndex(child => {
            let headerElement: HTMLElement | null;
            if (child.matches("h2")) {
                headerElement = child as HTMLElement;
            } else {
                headerElement = child.querySelector("h2");
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

    // Supprimer les sections edit, images et medias
    doc.querySelectorAll(".mw-editsection, img, video, audio, source").forEach(el => el.remove());

    // Supprimer tous les cite_note dans tous les éléments
    doc.querySelectorAll("sup").forEach(sup => {
        if (sup.querySelector('a[href^="#cite_note-"]')) {
            sup.remove();
        }
    });

    // Supprimer les paragraphes sans lien réel (les liens cite_note étant exclus)
    doc.querySelectorAll("p").forEach(paragraph => {
        const anchors = paragraph.querySelectorAll("a");
        const hasRealLink = Array.from(anchors).some(a => {
            const href = a.getAttribute("href") || "";
            return href && !href.startsWith("#cite_note-");
        });
        if (!hasRealLink) {
            paragraph.remove();
        } else {
            paragraph.querySelectorAll("sup").forEach(sup => {
                if (sup.querySelector('a[href^="#cite_note-"]')) {
                    sup.remove();
                }
            });
        }
    });

    // Supprimer les liens internes /wiki/ inutiles
    doc.querySelectorAll("a").forEach(a => {
        const href = a.getAttribute("href") || "";
        if (href.startsWith("/wiki/") && decodeURIComponent(href).includes(":")) {
            const frag = doc.createDocumentFragment();
            while (a.firstChild) {
                frag.appendChild(a.firstChild);
            }
            a.replaceWith(frag);
        }
    });

    // Supprimer les classes et styles prédéfinit
    doc.querySelectorAll('[class], [style]').forEach(el => {
        el.removeAttribute('class');
        el.removeAttribute('style');
    });

    // Englober les tableaux dans des conteneurs personnalisés
    doc.querySelectorAll("table").forEach(table => {
        const wrapper = doc.createElement("div");
        wrapper.className = "table-container";
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });

    return doc.body.innerHTML;
};

export function insertKeywordButton(html: string): { keyword: string; html: string } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Helper pour savoir si un node est dans un titre h1-h6
    function isInHeading(node: Node): boolean {
        let el = node.parentElement;
        while (el) {
            if (/^H[1-6]$/.test(el.tagName)) return true;
            el = el.parentElement;
        }
        return false;
    }

    // 1) Compter les mots (≥6 lettres Unicode) hors <a> et hors titres
    const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
    const counts = new Map<string, number>();
    const wordRegex = /\p{L}{6,}/gu;
    let node: Node | null;

    while ((node = walker.nextNode())) {
        if (node.parentElement?.tagName === "A") continue;
        if (isInHeading(node)) continue;

        const text = node.textContent || "";
        let m: RegExpExecArray | null;
        while ((m = wordRegex.exec(text))) {
            const w = m[0].toLowerCase();
            counts.set(w, (counts.get(w) || 0) + 1);
        }
    }

    if (!counts.size) return { keyword: "", html };

    // 2) Sélection des mots les moins fréquents
    let minCount = Infinity;
    for (const c of counts.values()) if (c < minCount) minCount = c;
    const candidates = Array.from(counts.entries())
        .filter(([, c]) => c === minCount)
        .map(([w]) => w);
    const keyword = candidates[Math.floor(Math.random() * candidates.length)];

    // 3) Envelopper la première occurrence hors <a> et hors titres
    function wrapFirst(el: Element): boolean {
        for (const child of Array.from(el.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE) {
                if (isInHeading(child)) continue;
                const text = child.textContent || "";
                const idx = text.toLowerCase().indexOf(keyword);
                if (idx !== -1) {
                    const before = text.slice(0, idx);
                    const matchText = text.slice(idx, idx + keyword.length);
                    const after = text.slice(idx + keyword.length);
                    const frag = doc.createDocumentFragment();
                    if (before) frag.appendChild(document.createTextNode(before));
                    const button = doc.createElement("button");
                    button.id = "artifact-key-word"
                    button.className = "blue-title-effect text-[16px]";
                    button.textContent = matchText;
                    frag.appendChild(button);
                    if (after) frag.appendChild(document.createTextNode(after));
                    child.parentElement?.replaceChild(frag, child);
                    return true;
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const elChild = child as Element;
                if (elChild.tagName === "A" || /^H[1-6]$/.test(elChild.tagName)) {
                    // on n'explore pas les liens ni les titres
                    continue;
                }
                if (wrapFirst(elChild)) return true;
            }
        }
        return false;
    }

    wrapFirst(doc.body);
    return { keyword, html: doc.body.innerHTML };
}

export function removeKeywordSpan(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let btn = doc.getElementById("artifact-key-word");
    if (!btn) {
        btn = doc.querySelector("button.blue-title-effect");
    }
    if (btn && btn.parentNode) {
        const textNode = doc.createTextNode(btn.textContent || "");
        btn.parentNode.replaceChild(textNode, btn);
    }

    return doc.body.innerHTML;
}