import {
    BookInsert,
    BookMetadata,
    UserBook,
    AddToLibraryData,
    Profile,
    BookStatusHistory,
    BookStatusResponse,
    UserBookCurrentState,
    ReadingProgress
} from '@/types/book';
import supabase from '@/lib/supabase';
import {
    Database
} from '@/types/supabase'
type RPCFunctions = Database['public']['Functions'];

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

export const addBookToLibrary = async (addToLibraryDetails: AddToLibraryData, userId: Profile['id']) => {
    const {
        book,
        bookStatusHistory,
        userBooks
    } = addToLibraryDetails;

    const { data, error } = await supabase
        .rpc<
            RPCFunctions['add_book_to_library']['Returns'],
            RPCFunctions['add_book_to_library']['Args']
        >('add_book_to_library', {
            book_data: book,
            book_status_history_data: bookStatusHistory,
            user_books_data: userBooks,
            user_id: userId
        });
    if (error) throw error;
    return data;
};

export const getBooksByStatus =
    async (status: BookStatusHistory['status'], userId: string): Promise<BookStatusResponse[]> => {

        const { data, error } = await supabase.rpc('get_books_by_status', {
            p_status: status,
            p_user_id: userId
        })

        if (error) {
            console.error('Error fetching books:', error);
            throw error;
        }

        return data;
    }

export const getReadingLogs = async (bookID: string, userId: string): Promise<any> => {
    const userBook = supabase
        .from('user_books')
        .select('*')
        .eq('book_id', bookID)
        .eq('user_id', userId)
        .single();

    const readingLogs = supabase
        .from('book_reading_logs')
        .select('*')
        .eq('book_id', bookID)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    const primises = await Promise.allSettled([userBook, readingLogs])

    const userBookData = primises[0].status === 'fulfilled' ? primises[0].value.data : null;
    const readingLogsData = primises[1].status === 'fulfilled' ? primises[1].value.data : null;
    if (!userBookData) {
        throw new Error('User book data not found');
    }
    if (!readingLogsData) {
        throw new Error('Reading logs data not found');
    }

    return ({ userBookData, readingLogsData });
}

export const getUserBookCurrentStateData = async ({ userId, bookId }: { userId: string, bookId: string }): Promise<UserBookCurrentState | null> => {
    const { data, error } = await supabase
        .rpc('get_user_book_current_state_fn', {
            p_user_id: userId,
            p_book_id: bookId,
        });

    if (error) {
        // 'PGRST116' is the code for "Query returned 0 rows" when .single() is used.
        // In this case, it means no current state record exists for this user/book, which is not an application error.
        if (error.code === 'PGRST116') {
            return null;
        }
        // For other errors, log and re-throw.
        console.error('Error fetching user book current state:', error);
        throw error;
    }
    return data;
};


export const getBookReadingProgress = async (userId: string, bookId: string): Promise<ReadingProgress | null> => {
    const { data, error } = await supabase.rpc('get_reading_progress', {
        p_user_id: userId,
        p_book_id: bookId,
    });

    if (error) {
        console.error('Error fetching book reading progress:', error);
        throw error;
    }

    // The RPC function `get_reading_progress` returns TABLE(...), which results in an array.
    // Since it has a LIMIT 1, it will be an array of 0 or 1 elements.
    return data && data.length > 0 ? data[0] : null;
};
