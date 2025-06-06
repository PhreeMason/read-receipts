import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import axiod from "https://deno.land/x/axiod/mod.ts";
import { generateUrl, userAgent, corsHeaders } from '../_shared/utils.ts';

// Clerk JWT verification function
async function verifyClerkToken(token: string): Promise<{ userId: string } | null> {
  try {
    const clerkSecretKey = Deno.env.get('CLERK_SECRET_KEY');
    if (!clerkSecretKey) {
      throw new Error('CLERK_SECRET_KEY not found in environment variables');
    }

    // Verify the JWT token with Clerk
    const response = await fetch('https://api.clerk.com/v1/verify_token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.error('Clerk token verification failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    return { userId: data.sub }; // 'sub' contains the user ID in Clerk JWTs
  } catch (error) {
    console.error('Error verifying Clerk token:', error);
    return null;
  }
}

function extractBookListData($) {
  const bookList = [];
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
    const authors = [];
    $el.find('.authorName span[itemprop="name"]').each((i, auth) => {
      authors.push($(auth).text().trim());
    });
    
    // Extract cover image
    let coverImage = $el.find('img.bookCover').attr('src');
    if (coverImage.includes("nophoto")) {
      coverImage = null;
    }
    
    // Extract rating
    const ratingText = $el.find('span.minirating').text().trim();
    const ratingMatch = ratingText.match(/(\d+\.\d+) avg rating/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    
    // Extract ratings count
    const ratingsCountMatch = ratingText.match(/—\s+([\d,]+) ratings/);
    const ratingsCount = ratingsCountMatch ? parseInt(ratingsCountMatch[1].replace(/,/g, ''), 10) : null;
    
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
        goodreads_id: goodreadsId,
        edition_count: editionCount,
        ratings_count: ratingsCount,
        series,
        series_number: seriesNumber,
        authors: authors // Store authors in metadata for now
      }
    });
  });
  
  return bookList;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = performance.now();
  const authHeader = req.headers.get('Authorization');

  // Create Supabase client with service role key for database operations
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Verify Clerk authentication
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: 'Authorization header required'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const clerkUser = await verifyClerkToken(token);

    if (!clerkUser) {
      return new Response(JSON.stringify({
        error: 'Invalid or expired token'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401
      });
    }

    const user_id = clerkUser.userId;

    // Parse the request body
    const { query } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({
        error: 'Query parameter is required'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }

    console.log(`Searching for books now ${performance.now() - startTime}ms`);
    
    const scrapeUrl = generateUrl(query);
    const scrapeUrl2 = `${scrapeUrl}&page=2`;
    const scrapeUrl3 = `${scrapeUrl}&page=3`;

    // Fetch and parse HTML from Goodreads
    const request1 = axiod.get(scrapeUrl, {
      headers: { 'User-Agent': userAgent }
    });
    const request2 = axiod.get(scrapeUrl2, {
      headers: { 'User-Agent': userAgent }
    });
    const request3 = axiod.get(scrapeUrl3, {
      headers: { 'User-Agent': userAgent }
    });

    const results = await Promise.allSettled([request1, request2, request3]);

    console.log(`Searching complete ${performance.now() - startTime}ms`);

    const books = [];
    const ids = new Set();

    results.forEach((result) => {
      if (result.status !== 'fulfilled') {
        return;
      }
      
      const { value: { data: html } } = result;
      const $ = cheerio.load(html);
      const bookList = extractBookListData($);
      
      bookList.forEach((book) => {
        if (!ids.has(book.api_id)) {
          books.push(book);
        }
        ids.add(book.api_id);
      });
    });

    console.log(`Extraction complete ${performance.now() - startTime}ms`);

    // Save search history with Clerk user ID
    const { error: saveSearchError } = await supabaseClient
      .from('user_searches')
      .insert({
        user_id: user_id, // This is now the Clerk user ID
        query: query,
        result_count: books.length
      });

    if (saveSearchError) {
      console.error('Error saving search history:', saveSearchError);
    }

    return new Response(JSON.stringify({
      bookList: books
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      error: 'An error occurred',
      details: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});