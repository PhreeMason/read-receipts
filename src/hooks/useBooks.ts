import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../lib/supabase';
import { uploadEpub, getSignedEpubUrl } from '../utils/supabase-storage';
import { Book, BookStatus } from '@/types/book';

export const useGetBookWithSignedUrl = (bookId: string) => {
    return useQuery({
        queryKey: ['book', bookId],
        queryFn: async () => {
            const { data: book, error } = await supabase
                .from('books')
                .select('*')
                .eq('id', bookId)
                .single();

            if (error) throw error;
            if (!book) throw new Error('Book not found');

            const signedUrl = await getSignedEpubUrl(book.epub_path);
            return { ...book, epub_url: signedUrl };
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useBooksByStatus = (status: BookStatus) => {
    return useQuery({
        queryKey: ['books', status],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_books')
                .select(`
            id,
            status,
            reading_progress,
            last_position,
            book:books(*)
          `)
                .eq('status', status)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });
};

// Get currently reading books with progress
export const useCurrentlyReading = () => {
    return useQuery({
        queryKey: ['books', 'reading'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_books')
                .select(`
            id,
            status,
            reading_progress,
            last_position,
            book:books(*)
          `)
                .eq('status', 'reading')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });
};

// Get book status history
export const useBookStatusHistory = (userBookId: string) => {
    return useQuery({
        queryKey: ['book-status-history', userBookId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_book_status_history')
                .select('*')
                .eq('user_book_id', userBookId)
                .order('changed_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });
};

// Update book status
export const useUpdateBookStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userBookId,
            status,
            progress,
            note,
        }: {
            userBookId: string;
            status: BookStatus;
            progress?: number;
            note?: string;
        }) => {
            // Update user_books table
            const { error: updateError } = await supabase
                .from('user_books')
                .update({
                    status,
                    reading_progress: progress,
                })
                .eq('id', userBookId);

            if (updateError) throw updateError;

            // History is handled by trigger automatically
            if (note) {
                const { error: historyError } = await supabase
                    .from('user_book_status_history')
                    .update({ note })
                    .eq('user_book_id', userBookId)
                    .order('changed_at', { ascending: false })
                    .limit(1);

                if (historyError) throw historyError;
            }
        },
        onSuccess: (_, { status }) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['books', status] });
            queryClient.invalidateQueries({ queryKey: ['book-status-history'] });
        },
    });
};

// Add a book to user's library
export const useAddBookToLibrary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bookId,
            initialStatus = 'to-read' as BookStatus,
        }: {
            bookId: string;
            initialStatus?: BookStatus;
        }) => {
            const { data, error } = await supabase
                .from('user_books')
                .insert({
                    book_id: bookId,
                    status: initialStatus,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, { initialStatus }) => {
            queryClient.invalidateQueries({ queryKey: ['books', initialStatus] });
        },
    });
};

// Update reading progress
export const useUpdateReadingProgress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userBookId,
            progress,
            lastPosition,
        }: {
            userBookId: string;
            progress: number;
            lastPosition?: string;
        }) => {
            const { error } = await supabase
                .from('user_books')
                .update({
                    reading_progress: progress,
                    last_position: lastPosition,
                })
                .eq('id', userBookId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books', 'reading'] });
        },
    });
};

// Get book with all related status info
type UserBook = {
    id: string;
    status: string;
    reading_progress: number;
    last_position: string;
    book: {
        id: string;
        title: string;
        author: string;
        epub_path?: string;
    };
    status_history: Array<{
        id: string;
        user_book_id: string;
        status: string;
        progress: number;
        changed_at: string;
        note?: string;
    }>;
}
export const useBookDetails = (bookId: string) => {
    return useQuery({
        queryKey: ['book-details', bookId],
        queryFn: async () => {
            // Get book and current status
            const { data: userBook, error: userBookError } = await supabase
                .from('user_books')
                .select(`
            id,
            status,
            reading_progress,
            last_position,
            book:books(*),
            status_history:user_book_status_history(*)
          `)
                .eq('book_id', bookId)
                .returns<UserBook[]>()
                .single();

            if (userBookError) throw userBookError;

            // Get signed URL if needed
            if (userBook?.book?.epub_path) {
                const signedUrl = await getSignedEpubUrl(userBook.book.epub_path);
                return {
                    ...userBook,
                    book: { ...userBook.book, epub_url: signedUrl },
                };
            }

            return userBook;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

// Keep your existing useAddBook hook
export const useAddBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bookData,
            epubFile,
        }: {
            bookData: Partial<Book>;
            epubFile: File;
        }) => {
            const fileName = `${Date.now()}-${epubFile.name}`;
            const { path } = await uploadEpub(epubFile, fileName);
            const epubUrl = await getSignedEpubUrl(path);

            const { data, error } = await supabase
                .from('books')
                .insert({
                    ...bookData,
                    epub_path: path,
                    epub_url: epubUrl,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
};

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

export const useSearchBooks = (query: string) => {
    return useQuery({
        queryKey: ['books', 'search', query],
        queryFn: () => searchBooks(query),
        // Cache for 5 minutes
        staleTime: 1000 * 60 * 5,
    });
};