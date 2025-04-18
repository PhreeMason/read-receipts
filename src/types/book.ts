import {
    Tables,
    TablesInsert
} from '@/types/supabase'

export type Book = Tables<'books'>
export type BookInsert = TablesInsert<'books'>

export type UserBook = Tables<'user_books'>
export type UserBookInsert = TablesInsert<'user_books'>

export type BookStatusHistory = Tables<'book_status_history'>
export type BookStatusHistoryInsert = TablesInsert<'book_status_history'>

export type Author = Tables<'authors'>
export type AuthorInsert = TablesInsert<'authors'>

export type BookAuthor = Tables<'book_authors'>
export type BookAuthorInsert = TablesInsert<'book_authors'>

export type BookFormat = Book['format']

export type BookMetadata = {
    api_id: string;
    api_source: string;
    bookUrl: string | null;
    cover_image_url: string;
    title: string;
    publication_date: string | null;
    rating: number | null;
    source: string;
    epub_url: string;
    metadata: {
        goodreads_id: string;
        edition_count: number | null;
        ratings_count: number | null;
        series: string | null;
        series_number: number | null;
        authors: string[] | { name: string }[];
    };
};

export type StatusEnum = "tbr" | "current" | "completed" | "dnf" | 'pause';

export type BookAndUserBookInsert = UserBookInsert & BookInsert &
{
    status: StatusEnum;
    currentHours: number;
    currentMinutes: number;
    currentPage: number;
    hours: number;
    minutes: number;
};
export type Profile = Tables<'profiles'>

