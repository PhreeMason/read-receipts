import {
    BookAndUserBookInsert,
    AddToLibraryData,
} from '@/types/book';


export const formatAuthorName = (author: string | { name: string }) => {
    let name = '';
    if (typeof author === 'string') {
        name = author
    } else if (typeof author === 'object' && author.name) {
        name = author.name;
    }
    return name.replace(/\s+/g, ' ').trim();
}

/**
 * Separates book data into appropriate database table structures
 * @param data Combined book data object
 * @param userId The user ID for user-related records
 * @returns Object containing separated data for different tables
 */
export const separateBookData = (data: BookAndUserBookInsert, userId: string): AddToLibraryData => {
    // Extract book data
    const bookData = {
        id: data.id,
        api_id: data.api_id,
        api_source: data.api_source,
        cover_image_url: data.cover_image_url,
        created_at: data.created_at,
        description: data.description,
        edition: data.edition,
        format: Array.isArray(data.format) ? data.format[0] : data.format,
        genres: data.genres,
        isbn10: data.isbn10,
        isbn13: data.isbn13,
        language: data.language,
        metadata: data.metadata,
        publication_date: data.publication_date,
        publisher: data.publisher,
        rating: data.rating,
        title: data.title,
        total_duration: data.total_duration,
        total_pages: data.total_pages,
        updated_at: data.updated_at
    };

    // Extract book status history
    const bookStatusHistoryData = {
        user_id: userId,
        status: data.status,
        book_id: data.id
    };

    // Extract user books data (aligned with current schema)
    const userBooksData = {
        book_id: data.id,
        user_id: userId,
        cover_image_url: data.cover_image_url,
        date_added: new Date().toISOString(),
        format: Array.isArray(data.format)
            ? data.format.filter(Boolean) as ("physical" | "ebook" | "audio")[]
            : typeof data.format === 'string'
                ? [data.format as "physical" | "ebook" | "audio"]
                : null,
        genres: data.genres,
        rating: data.rating,
        target_completion_date: data.target_completion_date,
        total_duration: data.format?.includes('audio')
            ? data.hours * 60 + data.minutes
            : null,
        total_pages: data.format?.includes('physical') || data.format?.includes('ebook')
            ? null
            : data.total_pages,

        // Reading log fields (passed through to function)
        current_audio_time: data.currentHours * 60 + data.currentMinutes,
        current_page: data.currentPage,
        current_percentage: data.currentPercentage,
        note: data.note,
        start_date: data.start_date
    };

    return {
        book: bookData,
        bookStatusHistory: bookStatusHistoryData,
        userBooks: userBooksData
    };
};

