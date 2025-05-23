// Type for the book schema
export type Book = {
    api_id: string | null;
    api_source: string | null;
    cover_image_url: string | null;
    created_at: Date | null;
    description: string | null;
    edition: Record<string, unknown> | null; // JSON type
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
    updated_at: Date | null;
};