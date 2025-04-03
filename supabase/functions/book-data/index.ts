import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import axiod from "https://deno.land/x/axiod/mod.ts";
import { userAgent, corsHeaders } from '../_shared/utils.ts';

// Type for the book schema
type Book = {
    api_id: string | null;
    api_source: string | null;
    cover_image_url: string | null;
    created_at: string | null;
    date_added: string | null;
    description: string | null;
    edition: Record<string, unknown> | null; // JSON type
    epub_path: string | null;
    epub_url: string;
    format: 'physical' | 'ebook' | 'audiobook' | null; // Enum type
    genres: string[] | null;
    has_user_edits: boolean | null;
    id: string;
    isbn10: string | null;
    isbn13: string | null;
    language: string | null;
    metadata: Record<string, unknown> | null; // JSON type
    publication_date: string | null;
    publisher: string | null;
    rating: number | null;
    source: 'goodreads' | 'other_source' | null; // Enum type
    title: string;
    total_duration: number | null;
    total_pages: number | null;
    updated_at: string | null;
};

Deno.serve(async (req: Request) => {
    // Handle preflight first
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                ...corsHeaders,
                'Access-Control-Max-Age': '86400' // Cache preflight response
            }
        });
    }

    console.log("Request received");

    const { bookId } = await req.json();

    if (!bookId) {
        return new Response(JSON.stringify({ error: 'bookId is required' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        {
            global: {
                headers: { Authorization: req.headers.get('Authorization')! },
            },
        }
    );

    try {
        // Race between database lookup and fresh fetch
        const bookData = await Promise.any([
            fetchFromDatabase(supabaseClient, bookId),
            fetchFromGoodreads(bookId, supabaseClient)
        ]);

        return new Response(JSON.stringify(bookData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

async function fetchFromDatabase(supabaseClient: SupabaseClient, bookId: string) {
    // Check if we have this book in our cache
    const startTime = performance.now();
    const { data, error } = await supabaseClient
        .from('books')
        .select('*')
        .eq('api_id', bookId)
        .single();

    if (error || !data) {
        return Promise.reject(new Error('Not in database'));
    }

    console.log(`Book found in database, timing ${performance.now() - startTime}ms`);
    return data;
}

async function storeInDatabase(supabaseClient: SupabaseClient, bookData: Book) {
    // Check if book already exists
    const startTime = performance.now();
    const { error } = await supabaseClient
        .from('books')
        .upsert({
            ...bookData,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'api_id',
            returning: 'minimal',
            ignoreDuplicates: false
        });

    if (error) {
        console.error("Error inserting new record:", { error, bookData });
    }
    console.log(`Book stored in database, timing ${performance.now() - startTime}ms`);
}

async function fetchFromGoodreads(bookId: string, supabaseClient: SupabaseClient) {
    console.log("Fetching fresh data from Goodreads");
    const startTime = performance.now();

    // Fetch from Goodreads
    const { data: html } = await axiod.get(`https://www.goodreads.com/book/show/${bookId}`, {
        headers: { 'User-Agent': userAgent }
    });

    // Parse HTML with Cheerio
    const $ = cheerio.load(html);

    // Extract book data using your existing function
    const bookData = extractBookData($, bookId);

    // Store in database asynchronously (don't await to return result faster)
    storeInDatabase(supabaseClient, bookData).catch(err => {
        console.error("Failed to store in database:", err);
    });
    console.log(`Book fetched from goodreads, timing ${performance.now() - startTime}ms`);
    return bookData;
}

function extractBookData($: cheerio.CheerioAPI, bookId: string) {
    const startTime = performance.now();
    // Initialize book object with default values
    const book: Book = {
        api_id: bookId,
        api_source: 'goodreads',
        cover_image_url: null,
        created_at: new Date().toISOString(),
        date_added: new Date().toISOString(),
        description: null,
        edition: null,
        epub_path: null,
        epub_url: '',
        format: null,
        genres: [],
        has_user_edits: false,
        isbn10: null,
        isbn13: null,
        language: null,
        metadata: {
            extraction_method: 'html',
        },
        publication_date: null,
        publisher: null,
        rating: null,
        source: 'goodreads',
        title: '',
        total_duration: null,
        total_pages: null,
        updated_at: new Date().toISOString()
    };

    // Try to extract from NEXT_DATA script first (best data source)
    const nextDataScript = $('#__NEXT_DATA__').text();
    if (nextDataScript) {
        try {
            const nextData = JSON.parse(nextDataScript);
            extractFromNextData(nextData, book);
        } catch (e) {
            console.error('Failed to parse NEXT_DATA script:', e);
        }
    }

    // Extract from JSON-LD schema next
    const schemaScript = $('script[type="application/ld+json"]').text();
    if (schemaScript) {
        try {
            const schema = JSON.parse(schemaScript);
            if (schema) {
                extractFromSchema(schema, book);
            }
        } catch (e) {
            console.error('Failed to parse schema.org data:', e);
        }
    }

    // Finally, extract from HTML elements as fallback
    extractFromHtml($, book);
    console.log(`Book extracted from parsed data, timing ${performance.now() - startTime}ms`);
    return book;
}

function extractFromNextData(nextData: any, book: Book) {
    try {
        // Find book data in the Next.js props structure
        let bookProps = null;

        if (nextData?.props?.pageProps?.book) {
            bookProps = nextData.props.pageProps.book;
        } else if (nextData?.props?.pageProps?.apolloState) {
            // Look for book entity in Apollo cache
            const apolloState = nextData.props.pageProps.apolloState;
            for (const key in apolloState) {
                if (key.startsWith('Book:')) {
                    bookProps = apolloState[key];
                    break;
                }
            }
        }

        if (!bookProps) return;
        if (book.metadata) book.metadata.extraction_method = 'next_data';

        // Extract book properties
        if (bookProps.title) book.title = bookProps.title.replace(/\s*\(.*?\)$/, '');
        if (bookProps.imageUrl || bookProps.coverImage) {
            book.cover_image_url = bookProps.imageUrl || bookProps.coverImage;
        }
        if (bookProps.description) book.description = bookProps.description;
        if (bookProps.numPages) book.total_pages = bookProps.numPages;
        if (bookProps.language) book.language = bookProps.language;
        if (bookProps.publisher) book.publisher = bookProps.publisher;
        if (bookProps.publicationDate) {
            book.publication_date = formatDate(bookProps.publicationDate);
        }
        if (bookProps.rating) book.rating = parseFloat(bookProps.rating);

        const identifiers = nextData?.props?.pageProps?.bookDetails?.details?.details?.identifiers;
        // ISBN
        if (identifiers) {
            book.isbn10 = identifiers.isbn10 || book.isbn10;
            book.isbn13 = identifiers.isbn13 || book.isbn13;
        }

        // Format
        if (bookProps.format) {
            const format = bookProps.format.toLowerCase();
            if (format.includes('hardcover')) book.format = 'physical';
            else if (format.includes('paperback')) book.format = 'physical';
            else if (format.includes('ebook')) book.format = 'ebook';
            else if (format.includes('audio')) book.format = 'audiobook';
        }

        // Genres
        if (bookProps.genres && Array.isArray(bookProps.genres)) {
            book.genres = bookProps.genres.map((g: any) => g?.name || g);
        }

        // Additional metadata
        book.metadata = book.metadata || {};

        // Authors
        if (bookProps.authors && Array.isArray(bookProps.authors)) {
            book.metadata.authors = bookProps.authors.map((a: any) => a?.name || a);
        }

        // Series
        if (bookProps.series) {
            book.metadata.series = bookProps.series.name || bookProps.series;
        }
    } catch (e) {
        console.error('Error extracting from NEXT_DATA:', e);
    }
}

function extractFromSchema(schema: any, book: Book) {
    // Basic info
    if (book.metadata) book.metadata.extraction_method = 'schema';

    if (!book.title && schema.name) {
        book.title = schema.name.replace(/\s*\(.*?\)$/, '');
    }
    if (!book.cover_image_url && schema.image) {
        book.cover_image_url = schema.image;
    }
    if (!book.total_pages && schema.numberOfPages) {
        book.total_pages = parseInt(schema.numberOfPages);
    }
    if (!book.language && schema.inLanguage) {
        book.language = schema.inLanguage;
    }

    // ISBN
    if (schema.isbn) {
        const isbn = schema.isbn.replace(/-/g, '');
        if (isbn.length === 10) book.isbn10 = isbn;
        else if (isbn.length === 13) book.isbn13 = isbn;
    }

    // Format
    if (!book.format && schema.bookFormat) {
        if (schema.bookFormat === 'Hardcover') book.format = 'physical';
        else if (schema.bookFormat === 'Paperback') book.format = 'physical';
        else if (schema.bookFormat === 'E-book') book.format = 'ebook';
        else if (schema.bookFormat === 'Audiobook') book.format = 'audiobook';
    }

    // Author
    if (schema.author && Array.isArray(schema.author)) {
        book.metadata = book.metadata || {};
        book.metadata.authors = schema.author.map((a: any) => a.name);
    }

    // Rating
    if (!book.rating && schema.aggregateRating) {
        book.rating = parseFloat(schema.aggregateRating.ratingValue);
        book.metadata = book.metadata || {};
        book.metadata.rating_count = schema.aggregateRating.ratingCount;
        book.metadata.review_count = schema.aggregateRating.reviewCount;
    }

    // Awards
    if (schema.awards) {
        book.metadata = book.metadata || {};
        book.metadata.awards = schema.awards;
    }
}

function extractFromHtml($: cheerio.CheerioAPI, book: Book) {
    // Title
    if (!book.title) {
        book.title = $('h1.Text__title1').text().trim().replace(/\s*\(.*?\)$/, '');
    }

    // Cover image
    if (!book.cover_image_url) {
        const coverImg = $('.BookCover img.ResponsiveImage').attr('src');
        if (coverImg) book.cover_image_url = coverImg;
    }

    // Description
    if (!book.description) {
        const description = $('.BookPageMetadataSection__description .TruncatedContent__text').text().trim();
        if (description) book.description = description;
    }

    // Genres
    if (book.genres?.length === 0) {
        $('.BookPageMetadataSection__genres .Button--tag').each((_: any, el: any) => {
            const genre = $(el).text().trim();
            if (genre) book.genres?.push(genre);
        });
    }

    // Publication info
    if (!book.publication_date) {
        const publicationInfo = $('.FeaturedDetails [data-testid="publicationInfo"]').text();
        const publicationMatch = publicationInfo.match(/First published (.+)/);
        if (publicationMatch) {
            book.publication_date = formatDate(publicationMatch[1]);
        }
    }

    // Page count and format
    if (!book.total_pages) {
        const pagesFormat = $('.FeaturedDetails [data-testid="pagesFormat"]').text();
        const pagesMatch = pagesFormat.match(/(\d+)\s+pages/);
        if (pagesMatch) book.total_pages = parseInt(pagesMatch[1], 10);

        // Format
        if (!book.format) {
            if (pagesFormat.includes('Hardcover')) book.format = 'physical';
            else if (pagesFormat.includes('Paperback')) book.format = 'physical';
            else if (pagesFormat.includes('Kindle')) book.format = 'ebook';
            else if (pagesFormat.includes('Audiobook')) book.format = 'audiobook';
        }
    }

    // Rating
    if (!book.rating) {
        const ratingText = $('.RatingStatistics__rating').text().trim();
        if (ratingText) book.rating = parseFloat(ratingText);
    }

    // Author
    if (!book.metadata?.authors) {
        const authorNames: string[] = [];
        $('.ContributorLink__name').each((_: any, el: any) => {
            const name = $(el).text().trim();
            if (name) authorNames.push(name);
        });

        if (authorNames.length > 0) {
            book.metadata = book.metadata || {};
            book.metadata.authors = authorNames;
        }
    }

    // Series info
    if (!book.metadata?.series) {
        const seriesText = $('.Text__title3.Text__italic').text().trim();
        const seriesMatch = seriesText.match(/(.+?)(?:\s*#\d+)?$/);
        if (seriesMatch) {
            book.metadata = book.metadata || {};
            book.metadata.series = seriesMatch[1];
        }
    }

    // ISBN
    if (!book.isbn10 || !book.isbn13) {
        // Fallback to HTML scraping if not found in JSON
        const isbnSection = $('[data-testid="bookDetails"]').text();

        // Match ISBN patterns (ISBN-10: 10 digits, ISBN-13: 978/979 prefix + 10 digits)
        const isbn10Match = isbnSection.match(/ISBN-10: (\d{10})/);
        const isbn13Match = isbnSection.match(/ISBN-13: (\d{13})/);

        if (isbn10Match) book.isbn10 = isbn10Match[1];
        if (isbn13Match) book.isbn13 = isbn13Match[1];
    }
}


function formatDate(dateString: string) {
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toISOString();
        }
        return dateString;
    } catch (e) {
        return dateString;
    }
}
