import logger from "./logger";
import axios from "axios";

export class WikipediaServices {
    private static POPULAR_THRESHOLD = 75000;
    // Number of random sample dates to pick within the last 6 months.
    private static RANDOM_SAMPLE_COUNT = 200;
    private static pagePopularity: Map<string, number> = new Map();

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
     * @param popularThreshold The minimum popularity threshold.
     * @returns A promise resolving to an array of article titles.
     */
    public static async fetchRandomPopularWikipediaPages(numberOfArticles: number, popularThreshold?: number): Promise<string[]> {
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

        this.pagePopularity = aggregated;
        // Filter popular
        const popular = Array.from(aggregated.entries())
            .filter(([, total]) => total >= (popularThreshold ?? this.POPULAR_THRESHOLD))
            .map(([a]) => a);

        if (!popular.length) {
            logger.warn("No article exceeded the popularity threshold.");
            return [];
        }

        // Shuffle and slice
        for (let i = popular.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [popular[i], popular[j]] = [popular[j], popular[i]];
        }
        return popular.slice(0, numberOfArticles);
    }

    public static getPagePopularity(pageName: string): number {
        return this.pagePopularity.get(pageName) || 0;
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
