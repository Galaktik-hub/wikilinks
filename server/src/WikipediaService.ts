export class WikipediaService {
    /**
     * Fetches random Wikipedia page titles using the MediaWiki API.
     * Returns an array of page titles.
     */
    public static async fetchRandomWikipediaPages(count: number): Promise<string[]> {
        interface WikipediaResponse {
            query: {
                random: { title: string }[];
            };
        }

        try {
            // Use &origin=* to allow CORS if needed.
            const response = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=${count}&rnnamespace=0&origin=*`);
            const data = (await response.json()) as WikipediaResponse;

            if (!data.query || !data.query.random) {
                throw new Error("Unexpected API response format");
            }

            return data.query.random.map((page) => page.title);
        } catch (error) {
            console.error("Error fetching Wikipedia articles:", error);
            return [];
        }
    }

    /**
     * Retrieves the total page views for a given Wikipedia page between the specified dates.
     * Dates must be in YYYYMMDD format.
     */
    public static async getPageViews(title: string, startDate: string, endDate: string): Promise<number> {
        try {
            const encodedTitle = encodeURIComponent(title);
            const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/fr.wikipedia.org/all-access/user/${encodedTitle}/daily/${startDate}/${endDate}`;
            const response = await fetch(url);
            const data = await response.json();

            let totalViews = 0;
            if (data.items && Array.isArray(data.items)) {
                for (const item of data.items) {
                    totalViews += item.views;
                }
            }
            return totalViews;
        } catch (error) {
            console.error(`Error fetching page views for "${title}":`, error);
            return 0;
        }
    }

    /**
     * Fetches random Wikipedia pages and returns a list of titles that meet a minimum view threshold
     * over the given date range.
     * Dates must be in YYYYMMDD format.
     */
    public static async fetchRandomPopularWikipediaPages(
        requiredCount: number,
        minViews: number,
        startDate: string,
        endDate: string,
        batchSize: number = requiredCount * 2
    ): Promise<string[]> {
        const validTitles = new Set<string>();

        while (validTitles.size < requiredCount) {
            const titles = await this.fetchRandomWikipediaPages(batchSize);
            console.log(`Batch fetched: ${titles.join(', ')}`);

            for (const title of titles) {
                const views = await this.getPageViews(title, startDate, endDate);
                if (views >= minViews) {
                    console.log(`Page "${title}" has ${views} views between ${startDate} and ${endDate}`);
                    validTitles.add(title);
                    if (validTitles.size >= requiredCount) {
                        break;
                    }
                }
            }
        }
        validTitles.forEach((title) => console.log("Result : " + title));
        return Array.from(validTitles);
    }
}