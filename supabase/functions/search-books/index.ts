import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import axiod from "https://deno.land/x/axiod/mod.ts";
import { generateUrl, userAgent, corsHeaders } from '../_shared/utils.ts';


type BookMetadata = {
    api_id: string;
    api_source: 'goodreads';
    bookUrl: string | null;
    cover_image_url: string;
    title: string;
    publication_date: string | null;
    rating: number | null;
    source: 'api';
    epub_url: string;
    metadata: {
        goodreads_id: string;
        edition_count: number | null;
        ratings_count: number | null;
        series: string | null;
        series_number: number | null;
        authors: string[];
};

function extractBookListData($: cheerio.CheerioAPI): BookMetadata[] {
    const bookList: BookMetadata[] = [];
    // Select book entries
    $('tr[itemscope][itemtype="http://schema.org/Book"]').each((i, element) => {
        const $el = $(element);

        // Extract book ID
        const idDiv = $el.find('div.u-anchorTarget');
        const goodreadsId = idDiv.attr('id');

        // Extract title and series info
        const bookUrl = $el.find('a.bookTitle').attr('href')?.split('?')[0].replace('/book/show/', '');
        const titleElement = $el.find('.bookTitle span[itemprop="name"]');
        const fullTitle = titleElement.text().trim();


        // Handle series information if present
        const seriesMatch = fullTitle.match(/^(.*?)\s*\(([^#]+?)\s*#([\d.]+)(?:,.*)?\)$/);
        let title, series, seriesNumber;

        if (seriesMatch) {
            title = seriesMatch[1].trim();
            series = seriesMatch[2].trim();
            seriesNumber = parseFloat(seriesMatch[3]);
        } else {
            title = fullTitle.trim();
            series = null;
            seriesNumber = null;
        }

        // Extract authors
        const authors: string[] = [];
        $el.find('.authorName span[itemprop="name"]').each((i, auth) => {
            authors.push($(auth).text().trim());
        });

        // Extract cover image
        const coverImage = $el.find('img.bookCover').attr('src');

        // Extract rating
        const ratingText = $el.find('span.minirating').text().trim();
        const ratingMatch = ratingText.match(/(\d+\.\d+) avg rating/);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

        // Extract ratings count
        const ratingsCountMatch = ratingText.match(/—\s+([\d,]+) ratings/);
        const ratingsCount = ratingsCountMatch
            ? parseInt(ratingsCountMatch[1].replace(/,/g, ''), 10)
            : null;

        // Extract publication year
        const publicationText = $el.find('.greyText.smallText.uitext').text();
        const publicationYearMatch = publicationText.match(/published\s+(\d{4})/);
        const publicationYear = publicationYearMatch ? publicationYearMatch[1] : null;

        // Format the publication date
        const publicationDate = publicationYear ? `${publicationYear}-01-01` : null;

        // Extract edition info if available
        const editionText = $el.find('a.greyText[rel="nofollow"]').text();
        const editionMatch = editionText.match(/(\d+) editions/);
        const editionCount = editionMatch ? parseInt(editionMatch[1], 10) : null;

        // Format the book for our database schema
        bookList.push({
            api_id: goodreadsId,
            api_source: 'goodreads',
            bookUrl,
            cover_image_url: coverImage,
            title,
            publication_date: publicationDate,
            rating,
            source: 'api',
            // Required field in your schema
            epub_url: "",
            // Extra metadata
            metadata: {
                goodreads_id: goodreadsId!,
                edition_count: editionCount,
                ratings_count: ratingsCount,
                series,
                series_number: seriesNumber,
                authors: authors // Store authors in metadata for now
            },
            // We're not setting id here as it will be generated when inserting into the database
        });
    });
    return bookList;
}


Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }

    const authHeader = req.headers.get('Authorization')!;

    // Create a client with the user's token instead of service role
    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    try {
        // Get the session or user object
        const token = authHeader.replace('Bearer ', '');
        const { data: userData, error } = await supabaseClient.auth.getUser(token);
        const user = userData.user;
        const user_id = user?.id;

        if (error) {
            return new Response(JSON.stringify({ error }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            })
        }

        if (!user_id) {
            return new Response(JSON.stringify({ error: 'Authentication required' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 401,
            });
        }

        // Parse the request body
        const { query } = await req.json();

        if (!query) {
            return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        const scrapeUrl = generateUrl(query);

        // Fetch and parse HTML from Goodreads
        const { data: html } = await axiod.get(scrapeUrl, {
            headers: {
                'User-Agent': userAgent
            }
        });

        const $ = cheerio.load(html);
        // Select each book entry from the search results

        const bookList = extractBookListData($);

        // After performing the search and before returning the results
        const { data, error: saveSearchError } = await supabaseClient
            .from('user_searches')
            .insert({
                user_id: user_id,
                query: query,
                result_count: bookList.length
            });

        if (saveSearchError) {
            console.error('Error saving search history:', saveSearchError);
        }

        return new Response(JSON.stringify({ bookList }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({
            error: 'An error occurred',
            details: error.message
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
