import { UserBook } from './../types/book';
// src/hooks/useBooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../lib/supabase';
import { uploadEpub, getSignedEpubUrl } from '../utils/supabase-storage';
import { Book, BookStatus } from '@/types/book';
import { searchBooks, getBookById, fetch10Books, fetchBookDetailsWithUserData, updateUserBookStatus } from '@/services/books';

export const useGetBookWithSignedUrl = (bookId: string) => {
    return useQuery({
        queryKey: ['book', bookId],
        queryFn: async () => {
            const book = await getBookById(bookId);
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
        mutationFn: ({ userBookId, status }: { userBookId: string; status: BookStatus }) =>
          updateUserBookStatus(userBookId, status),
        onSuccess: ({id: userBookId, book_id: bookId}) => {
          queryClient.invalidateQueries({ queryKey: ['book-status-history', userBookId] });
          queryClient.invalidateQueries({ queryKey: ['user-book', bookId] });
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


export const useBookDetails = (bookId: string) => {
    return useQuery({
        queryKey: ['book-details', bookId],
        queryFn: async () => fetchBookDetailsWithUserData(bookId),
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

export const useSearchBooks = (query: string) => {
    return useQuery({
        queryKey: ['books', 'search', query],
        queryFn: async () => {
            if (!query) return fetch10Books();

            return searchBooks(query);
        },
        // Cache for 5 minutes
        staleTime: 1000 * 60 * 5,
    });
};
