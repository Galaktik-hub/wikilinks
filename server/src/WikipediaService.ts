import logger from "./logger";

export class WikipediaServices {
    private static POPULAR_THRESHOLD = 75000;
    // Number of random sample dates to pick within the last 6 months.
    private static RANDOM_SAMPLE_COUNT = 200;

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
     * between today and 6 months ago. Aggregates pageviews over the sampled days and filters out
     * special pages (those with a colon in the title) as well as articles that do not pass a popularity threshold.
     *
     * @param numberOfArticles The number of articles to return.
     * @returns A promise resolving to an array of article titles.
     */
    public static async fetchRandomPopularWikipediaPages(numberOfArticles: number): Promise<string[]> {
        try {
            // Calculate date range: from 6 months ago to today.
            const today = new Date();
            const sixMonthsAgo = new Date(today.getTime());
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            // Build a list of random dates (we pick RANDOM_SAMPLE_COUNT dates).
            const randomDates: {year: number; month: string; day: string}[] = [];
            for (let i = 0; i < WikipediaServices.RANDOM_SAMPLE_COUNT; i++) {
                const randomDate = WikipediaServices.getRandomDate(sixMonthsAgo, today);
                // Using the day of the random date; alternatively, you could round the date if needed.
                const year = randomDate.getFullYear();
                const month = String(randomDate.getMonth() + 1).padStart(2, "0");
                const day = String(randomDate.getDate()).padStart(2, "0");
                randomDates.push({year, month, day});
            }

            // A Map is used to sum up the view counts for each article.
            const aggregatedArticles = new Map<string, number>();

            // Using Promise.all to fetch each date in parallel.
            await Promise.all(
                randomDates.map(async ({year, month, day}) => {
                    try {
                        const articlesForDate = await WikipediaServices.fetchArticlesForDate(year, month, day);
                        for (const item of articlesForDate) {
                            if (item.article === "Main_Page" || item.article.includes(":")) continue;

                            const currentViews = aggregatedArticles.get(item.article) || 0;
                            aggregatedArticles.set(item.article, currentViews + item.views);
                        }
                    } catch (error) {
                        logger.error(`Error processing date ${year}-${month}-${day}: ${error}`);
                    }
                }),
            );

            // Convert the Map to an array and filter to keep only those articles surpassing the threshold.
            const popularArticles = Array.from(aggregatedArticles.entries())
                .filter(([_, totalViews]) => totalViews >= WikipediaServices.POPULAR_THRESHOLD)
                .map(([article]) => article);

            if (popularArticles.length === 0) {
                logger.warn("No article exceeded the popularity threshold.");
                return [];
            }

            // Shuffle the articles
            for (let i = popularArticles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [popularArticles[i], popularArticles[j]] = [popularArticles[j], popularArticles[i]];
            }

            // Return the requested number of articles
            return popularArticles.slice(0, numberOfArticles);
        } catch (error) {
            logger.error(`Error fetching popular Wikipedia pages: ${error}`);
            return [];
        }
    }

    // Helper function to fetch articles for a given date.
    public static fetchArticlesForDate = async (year: number, month: string, day: string) => {
        const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/fr.wikipedia/all-access/${year}/${month}/${day}`;
        const response = await fetch(url);
        if (!response.ok) {
            logger.error(`Error fetching data for ${year}-${month}-${day}: ${response.statusText}`);
        }
        const data = await response.json();
        return data?.items?.[0]?.articles || [];
    };
}
