import { Tables, TablesInsert } from '@/types/supabase'

export type Book = Tables<'books'>
export type BookInsert = TablesInsert<'books'>

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

export type StatusEnum = "tbr" | "current" | "completed" | "dnf" | 'paused';

export type UserBook = Tables<'user_books'>
export type UserBookInsert = TablesInsert<'user_books'>
