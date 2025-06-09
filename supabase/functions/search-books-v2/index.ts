import axiod from "https://deno.land/x/axiod/mod.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders, generateUrl, userAgent, Logger, authenticateUser } from '../_shared/utils.ts';

// Main handler with improved structure
Deno.serve(async (req: Request): Promise<Response> => {
    const logger = new Logger();

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const startTime = performance.now();

    try {
        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase configuration');
        }

        const supabaseClient = createClient(supabaseUrl, supabaseKey);

        // Authenticate user
        const userId = await authenticateUser(req);
        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'Authentication failed', logs: logger.getLogs() }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                }
            );
        }

        // Parse and validate request
        const body = await req.json().catch(() => ({}));
        const { query } = body;

        if (!query?.trim()) {
            return new Response(
                JSON.stringify({ error: 'Query parameter is required', logs: logger.getLogs() }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                }
            );
        }

        logger.log(`Starting book search for query: "${query}"`);

        // Scrape books
        const books = await scrapeBooks(query, logger);

        logger.log(`Search completed in ${(performance.now() - startTime).toFixed(2)}ms, found ${books.length} books`);

        // Save search history (non-blocking)
        supabaseClient
            .from('user_searches')
            .insert({ user_id: userId, query, result_count: books.length })
            .then(({ error }) => {
                if (error) logger.error('Failed to save search history:', error);
            });

        return new Response(
            JSON.stringify({ bookList: books, logs: logger.getLogs() }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            }
        );

    } catch (error) {
        logger.error('Unexpected error:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
                logs: logger.getLogs()
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            }
        );
    }
});

// Book scraping with improved error handling and timeout
async function scrapeBooks(query: string, logger: Logger): Promise<unknown[]> {
    const baseUrl = generateUrl(query);
    const urls = [baseUrl, `${baseUrl}&page=2`, `${baseUrl}&page=3`];

    // Use Promise.allSettled for better error resilience
    const requests = urls.map(url =>
        axiod.get(url, {
            headers: { 'User-Agent': userAgent },
            timeout: 10000 // 10 second timeout
        }).catch(error => {
            logger.error(`Failed to fetch ${url}:`, error.message);
            return null;
        })
    );

    const results = await Promise.allSettled(requests);
    const books: unknown[] = [];
    const seenIds = new Set<string>();

    for (const result of results) {
        if (result.status === 'fulfilled' && result.value?.data) {
            try {
                const $ = cheerio.load(result.value.data);
                const pageBooks = extractBookListData($);

                for (const book of pageBooks) {
                    if (!seenIds.has(book.api_id)) {
                        books.push(book);
                        seenIds.add(book.api_id);
                    }
                }
            } catch (error) {
                logger.error('Error parsing page:', error);
            }
        }
    }

    return books;
}

function extractBookListData($: cheerio.CheerioAPI): Array<{
    api_id: string;
    api_source: string;
    bookUrl: string;
    cover_image_url: string | null;
    title: string;
    publication_date: string | null;
    rating: number | null;
    source: string;
    epub_url: string;
    metadata: Record<string, unknown>;
}> {
    const bookList: Array<{
        api_id: string;
        api_source: string;
        bookUrl: string;
        cover_image_url: string | null;
        title: string;
        publication_date: string | null;
        rating: number | null;
        source: string;
        epub_url: string;
        metadata: Record<string, unknown>;
    }> = [];

    $('tr[itemscope][itemtype="http://schema.org/Book"]').each((i, element) => {
        const $el = $(element);

        try {
            // Extract basic info with null checks
            const idDiv = $el.find('div.u-anchorTarget');
            const goodreadsId = idDiv.attr('id');
            if (!goodreadsId) return;

            const bookUrl = $el.find('a.bookTitle').attr('href')?.split('?')[0].replace('/book/show/', '') || '';
            const titleElement = $el.find('.bookTitle span[itemprop="name"]');
            const fullTitle = titleElement.text().trim();
            if (!fullTitle) return;

            // Parse title and series
            const seriesMatch = fullTitle.match(/^(.*?)\s*\(([^#]+?)\s*#([\d.]+)(?:,.*)?\)$/);
            const title = seriesMatch ? seriesMatch[1].trim() : fullTitle;
            const series = seriesMatch ? seriesMatch[2].trim() : null;
            const seriesNumber = seriesMatch ? parseFloat(seriesMatch[3]) : null;

            // Extract authors
            const authors: string[] = [];
            $el.find('.authorName span[itemprop="name"]').each((_, auth) => {
                const authorName = $(auth).text().trim();
                if (authorName) authors.push(authorName);
            });

            // Extract cover image
            let coverImage = $el.find('img.bookCover').attr('src') || null;
            if (coverImage?.includes("nophoto")) {
                coverImage = null;
            }

            // Extract rating safely
            const ratingText = $el.find('span.minirating').text().trim();
            const ratingMatch = ratingText.match(/(\d+\.\d+) avg rating/);
            const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

            // Extract ratings count
            const ratingsCountMatch = ratingText.match(/—\s+([\d,]+) ratings/);
            const ratingsCount = ratingsCountMatch ? parseInt(ratingsCountMatch[1].replace(/,/g, ''), 10) : null;

            // Extract publication year
            const publicationText = $el.find('.greyText.smallText.uitext').text();
            const publicationYearMatch = publicationText.match(/published\s+(\d{4})/);
            const publicationDate = publicationYearMatch ? `${publicationYearMatch[1]}-01-01` : null;

            // Extract edition info
            const editionText = $el.find('a.greyText[rel="nofollow"]').text();
            const editionMatch = editionText.match(/(\d+) editions/);
            const editionCount = editionMatch ? parseInt(editionMatch[1], 10) : null;

            bookList.push({
                api_id: goodreadsId,
                api_source: 'goodreads',
                bookUrl,
                cover_image_url: coverImage,
                title,
                publication_date: publicationDate,
                rating,
                source: 'api',
                epub_url: "",
                metadata: {
                    goodreads_id: goodreadsId,
                    edition_count: editionCount,
                    ratings_count: ratingsCount,
                    series,
                    series_number: seriesNumber,
                    authors
                }
            });
        } catch (error) {
            console.error('Error parsing book element:', error);
        }
    });

    return bookList;
}
