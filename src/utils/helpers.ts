import {
    BookAndUserBookInsert,
    AddToLibraryData
} from '@/types/book';

export const formatAutorName = (author: string | { name: string }) => {
    if (typeof author === 'string') {
        return author
    }
    return author.name
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

    // Extract user books data
    const userBooksData = {
        book_id: data.id,
        user_id: userId,
        completion_date: null,
        cover_image_url: data.cover_image_url,
        current_audio_time: data.currentHours * 3600 + data.currentMinutes * 60,
        current_page: data.currentPage,
        format: data.format,
        genres: data.genres,
        note: data.note,
        rating: data.rating,
        start_date: data.start_date,
        target_completion_date: data.target_completion_date,
        total_duration: data.hours * 3600 + data.minutes * 60,
        total_pages: data.total_pages,
        current_percentage: data.currentPercentage,
    };

    return {
        book: bookData,
        bookStatusHistory: bookStatusHistoryData,
        userBooks: userBooksData
    };
}
