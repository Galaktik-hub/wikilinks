const WIKI_API_BASE = "https://fr.wikipedia.org/w/api.php";

/**
 * Fetches the title of a Wikipedia article given its page ID on the French Wikipedia.
 * @param pageId - The numeric ID of the Wikipedia page.
 * @returns The title of the page.
 * @throws If the page is not found or the request fails.
 */
export async function getTitleFromId(pageId: number): Promise<string> {
    const url = `${WIKI_API_BASE}?action=query&format=json&prop=info&pageids=${pageId}&origin=*`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    const pages = data.query?.pages;
    const page = pages?.[pageId];
    if (!page || page.missing === "") {
        throw new Error(`No page found for ID ${pageId}`);
    }
    return page.title;
}

/**
 * Fetches the page ID of a Wikipedia article given its title on the French Wikipedia.
 * @param title - The title of the Wikipedia article (exact match).
 * @returns The numeric page ID of the article.
 * @throws If the title is not found or the request fails.
 */
export async function getIdFromTitle(title: string): Promise<number> {
    const encoded = encodeURIComponent(title);
    const url = `${WIKI_API_BASE}?action=query&format=json&titles=${encoded}&origin=*`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    const pages = data.query?.pages;
    const pageKey = Object.keys(pages || {})[0];
    const page = pages?.[pageKey];
    if (!page || page.missing === "") {
        throw new Error(`No page found with title "${title}"`);
    }
    return page.pageid;
}
