// src/hooks/useBooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../lib/supabase';
import { uploadEpub, getSignedEpubUrl, getPublicUrl } from '../utils/supabase-storage';
import { Book, BookStatus, UserBook } from '@/types/book';
import { Location } from '@epubjs-react-native/core';
import {
    searchBooks,
    getBookById,
    fetch10Books,
    fetchBookDetailsWithUserData,
    updateUserBookStatus,
    getCurrentLocation,
    saveCurrentLocation
} from '@/services/books';

export const useGetBookWithSignedUrl = (bookId: string) => {
    return useQuery({
        queryKey: ['book', bookId],
        queryFn: async () => {
            const book = await getBookById(bookId);
            if (!book) throw new Error('Book not found');

            const signedUrl = await getPublicUrl(book.epub_path);
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
                    *,
                    book:books(*)
                `)
                .eq('status', status)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });
};

/**
 * Returns user books except the ones with status 'did-not-finish'
 * @returns UserBook[]
 */
export const useUserBook = () => {
    return useQuery({
        queryKey: ['user-book'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_books')
                .select(`*`)
                .neq('status', 'did-not-finish');
            if (error) throw error;
            return data;
        },
    })
};

export const useRecentlyAddedBooks = () => {
    return useQuery({
        queryKey: ['books', 'recently-added'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_books')
                .select(`
                    *,
                    book:books(*)
                `)
                .neq('status', 'reading')
                .order('created_at', { ascending: false })
                .limit(10);
            if (error) throw error;
            return data;
        },
    });
};

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

export const useUpdateBookStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userBookId, status }: { userBookId: string; status: BookStatus }) =>
            updateUserBookStatus(userBookId, status),
        onSuccess: ({ id: userBookId, book_id: bookId }) => {
            queryClient.invalidateQueries({ queryKey: ['book-status-history', userBookId] });
            queryClient.invalidateQueries({ queryKey: ['user-book', bookId] });
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
            const epubUrl = await getPublicUrl(path);

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

export const useGetCurrentLocation = (bookId: string) => {
    return useQuery({
        queryKey: ['books', 'reading'],
        queryFn: async () => getCurrentLocation(bookId),
    })
};

export const useSaveCurrentLocation = (bookId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (location: Location) => saveCurrentLocation(bookId, location),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['book-details', bookId] });
        },
    });
};