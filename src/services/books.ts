import { Book, BookInsert, BookMetadata, UserBook, AddToLibraryData, Profile, BookStatusHistory } from '@/types/book';
import supabase from '@/lib/supabase';

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

export const getBookStatusHistory = async (api_id: string, userId: string): Promise<BookStatusHistory | undefined> => {
    const { data, error } = await supabase
        .from('book_status_history')
        .select(`
      id,
      user_id,
      status,
      created_at,
      book_id,
      books!inner(api_id)
    `)
        .eq('books.api_id', api_id)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(`Error fetching book status history: ${error.message}`);
    }
    return data[0] || null;
}

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

export const addBookToLibrary = async (addToLibraryDetails: AddToLibraryData, user_id: Profile['id']) => {
    const {
        book,
        bookStatusHistory,
        userBooks
    } = addToLibraryDetails

    const { data, error } = await supabase
        .rpc('add_book_to_library', {
            book_data: book,
            book_status_history_data: bookStatusHistory,
            user_books_data: userBooks,
            user_id: user_id
        });
    if (error) throw error;
    return data;
};