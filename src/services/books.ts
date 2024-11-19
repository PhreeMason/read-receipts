import { Book, BookStatus, StatusHistory, UserBook } from '@/types/book';
import supabase from '@/lib/supabase';
import { getPublicUrl, getSignedEpubUrl } from '@/utils/supabase-storage';
import { useAuth } from '@/providers/AuthProvider';

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


// Get book with all related status info
type BookWithUserDetails = Book & {
    userDetails?: {
        id: string
        status: BookStatus;
        reading_progress: string | null
        last_position: string | null
        status_history: StatusHistory[]
    }[]
}

export const fetchBookDetailsWithUserData = async (id: string): Promise<BookWithUserDetails> => {
    const { data: book, error: bookError } = await supabase
        .from('books')
        .select(`
            *,
            userDetails:user_books(*,
            status_history:user_book_status_history(*))
          `)
        .eq('id', id)
        .returns<BookWithUserDetails[]>()
        .single();
    if (bookError) throw bookError;
    // Get signed URL if needed
    if (book?.epub_path) {
        // const signedUrl = await getSignedEpubUrl(book.epub_path);
        const signedUrl = await getPublicUrl(book.epub_path);

        return {
            ...book,
            epub_url: signedUrl,
        };
    }

    return book;
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

export const createUserBook = async (bookId: string, userId: string, status: BookStatus) => {
    const { data, error } = await supabase
        .from('user_books')
        .insert([
            {
                book_id: bookId,
                user_id: userId,
                status,
                reading_progress: '0',
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateUserBookStatus = async (userBookId: string, status: BookStatus, reading_progress: number = 0): Promise<UserBook> => {
    const { data, error } = await supabase
        .from('user_books')
        .update({ status, reading_progress})
        .eq('id', userBookId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const saveCurrentLocation = async (bookId: string, cfi: string) => {
    console.log({bookId, cfi})
    const { data, error } = await supabase
        .from('user_books')
        .update({ last_position: cfi })
        .eq('book_id', bookId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const getCurrentLocation = async (bookId: string): Promise<string | null> => {
    const {profile} = useAuth()
    const userId = profile?.id

    const { data, error } = await supabase
        .from('user_books')
        .select('*')
        .eq('book_id', bookId)
        .eq('user_id', userId)
        .single();

    if (error) throw error;
    return data?.last_position;
};
// bunx supabase gen types --lang=typescript --project-id "nevezioullmxffvdlgyq" --schema public > src/types/supabase.ts
