import logger from "./logger";
import axios from "axios";

export class WikipediaServices {
    private static POPULAR_THRESHOLDS = [200000, 120000, 70000, 10000, 0];
    // Number of random sample dates to pick within the last 6 months.
    private static RANDOM_SAMPLE_COUNT = 290;

    /**
     * Generates a random date between two Date objects.
     *
     * @param start The start date.
     * @param end The end date.
     * @returns A random Date between start and end.
     */
    private static getRandomDate(start: Date, end: Date): Date {
        const startTime = start.getTime();
        const endTime = end.getTime();
        const randomTime = startTime + Math.random() * (endTime - startTime);
        return new Date(randomTime);
    }

    /**
     * Retrieves a specified number of popular French Wikipedia articles by randomly sampling dates
     * between yesterday and 6 months ago. Aggregates pageviews over the sampled days and filters out
     * special pages (those with a colon in the title) as well as articles that do not pass a popularity threshold.
     *
     * @param numberOfArticles The number of articles to return.
     * @param difficulty The difficulty level.
     * @returns A promise resolving to an array of article titles and the average of all popularity pages encountered.
     */
    public static async fetchRandomPopularWikipediaPages(
        numberOfArticles: number,
        difficulty?: number,
    ): Promise<{articles: string[]; averagePopularity: number}> {
        const today = new Date();
        // Exclude today's date because API may not be up to date
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const sixMonthsAgo = new Date(yesterday);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Build random date list between sixMonthsAgo and yesterday
        const randomDates = Array.from({length: this.RANDOM_SAMPLE_COUNT}, () => {
            const d = this.getRandomDate(sixMonthsAgo, yesterday);
            return {
                year: d.getFullYear(),
                month: String(d.getMonth() + 1).padStart(2, "0"),
                day: String(d.getDate()).padStart(2, "0"),
            };
        });

        const aggregated = new Map<string, number>();

        await Promise.all(
            randomDates.map(async ({year, month, day}) => {
                try {
                    const articles = await this.fetchArticlesForDate(year, month, day);
                    for (const {article, views} of articles) {
                        if (article === "Main_Page" || article.includes(":")) continue;
                        aggregated.set(article, (aggregated.get(article) || 0) + views);
                    }
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        const status = err.response?.status;
                        const code = err.code;
                        logger.error(`Error fetching ${year}-${month}-${day}: status=${status}, code=${code}, message=${err.message}`);
                    } else {
                        logger.error(`Unknown error for ${year}-${month}-${day}: ${err}`);
                    }
                }
            }),
        );
        // Average popularity
        const allPopularities = Array.from(aggregated.values());
        const totalPop = allPopularities.reduce((sum, v) => sum + v, 0);
        const averagePopularity = allPopularities.length ? Math.round(totalPop / allPopularities.length) : 0;

        // Filter popular
        const popular = Array.from(aggregated.entries())
            .filter(([, total]) => total >= this.POPULAR_THRESHOLDS[difficulty - 1])
            .map(([a]) => a);

        if (!popular.length) {
            logger.warn("No article exceeded the popularity threshold.");
            return {articles: [], averagePopularity};
        }

        // Shuffle and slice
        for (let i = popular.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [popular[i], popular[j]] = [popular[j], popular[i]];
        }
        return {articles: popular.slice(0, numberOfArticles), averagePopularity};
    }

    /**
     * Retrieves the popularity (total number of views) of an article over the last N days.
     *
     * @param pageName The title of the Wikipedia page.
     * @returns The total number of views or 0 if there is an error.
     */
    public static async fetchPagePopularity(pageName: string): Promise<number> {
        try {
            const today = new Date();
            // Exclude today's date because API may not be up to date
            const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            const sixMonthsAgo = new Date(yesterday);
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const format = (d: Date) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;

            const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/fr.wikipedia/all-access/user/${pageName}/daily/${format(sixMonthsAgo)}/${format(yesterday)}`;

            const resp = await axios.get(url, {timeout: 7000});
            const items: {date: string; views: number}[] = resp.data?.items || [];

            return items.reduce((sum, it) => sum + (it.views || 0), 0);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                logger.error(`Error fetching popularity for ${pageName}: ${err.response?.status} ${err.message}`);
            } else {
                logger.error(`Unknown error fetching popularity for ${pageName}: ${err}`);
            }
            return 0;
        }
    }

    /**
     * Helper: fetch articles for a given date via axios and show error code
     */
    private static async fetchArticlesForDate(year: number, month: string, day: string): Promise<{article: string; views: number}[]> {
        const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/fr.wikipedia/all-access/${year}/${month}/${day}`;
        try {
            const resp = await axios.get(url, {timeout: 7000});
            return resp.data?.items?.[0]?.articles;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const code = err.code;
                logger.error(`Error fetching data for ${year}-${month}-${day}: status=${status}, code=${code}, message=${err.message}`);
            } else {
                logger.error(`Error fetching data for ${year}-${month}-${day}: ${err}`);
            }
            throw err;
        }
    }
}
