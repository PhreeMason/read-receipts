import { Book, BookInsert, BookMetadata, UserBook } from '@/types/book';
import supabase from '@/lib/supabase';

export const searchBooks = async (query: string): Promise<Book[]> => {
    if (!query.trim()) return [];

    const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .order('title', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getBookById = async (id: string): Promise<Book> => {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

export const fetch10Books = async (): Promise<Book[]> => {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .limit(10);
    if (error) throw error;
    return data || [];
};


export const getUserBookStatus = async (bookId: string, userId: string): Promise<UserBook> => {
    const { data, error } = await supabase
        .from('user_books')
        .select('*')
        .eq('book_id', bookId)
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const searchBookList = async (query: string): Promise<{ bookList: BookMetadata[] }> => {
    if (!query.trim()) return { bookList: [] };
    const { data, error } = await supabase.functions.invoke('search-books', {
        body: { query },
    });

    if (error) throw error;
    return data;
    // await Promise.resolve()
    // return mockBookSearchResponse;
};

export const fetchBookData = async (api_id: string): Promise<BookInsert> => {
    const { data, error } = await supabase.functions.invoke('book-data', {
        body: { api_id },
    });

    if (error) throw error;
    return data;
    // await Promise.resolve()
    // return mockBookDataResponse;
};