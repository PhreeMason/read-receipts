// src/hooks/useBooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    searchBookList,
    fetchBookData,
    addBookToLibrary,
    getBookStatusHistory,
    getBooksByStatus,
    getReadingLogs,
    getBookReadingProgress,
    getUserBookCurrentStateData,
} from '@/services/books';
import { BookAndUserBookInsert, BookStatusHistory } from '@/types/book';
import { useAuth } from '@/providers/AuthProvider';
import { separateBookData } from '@/utils/helpers';

export const useSearchBooksList = (query: string) => {
    return useQuery({
        queryKey: ['books', 'search', query],
        queryFn: async () => searchBookList(query),
        staleTime: 1000 * 60 * 5,
    });
};

export const useFetchBookData = (bookId: string) => {
    return useQuery({
        queryKey: ['book', bookId],
        queryFn: async () => fetchBookData(bookId),
        staleTime: 1000 * 60 * 5,
    });
}

export const useFetchBookStatusHistory = (api_id: string) => {
    const { profile, session } = useAuth();
    const userId = profile?.id || session?.user?.id;
    return useQuery({
        queryKey: ['bookStatusHistory', api_id, userId],
        queryFn: async () => {
            if (!userId) return null;
            return getBookStatusHistory(api_id, userId);
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
}

export const useSaveUserBook = () => {
    const queryClient = useQueryClient();
    const { profile, session } = useAuth();
    const userId = profile?.id || session?.user?.id;

    return useMutation({
        mutationFn: async (userBookData: BookAndUserBookInsert) => {
            if (!userId) return null;
            const separatedUserBookInfo = separateBookData(userBookData, userId);
            return addBookToLibrary(separatedUserBookInfo, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['bookStatusHistory'] });
            queryClient.invalidateQueries({ queryKey: ['userbooks'] });
        }
    })
}

export const useGetBooksByStatus = (status: BookStatusHistory['status']) => {
    const { profile, session } = useAuth();
    const userId = profile?.id || session?.user?.id;
    return useQuery({
        queryKey: ['bookStatusHistory', userId, status],
        queryFn: async () => {
            if (!userId) return null;
            return getBooksByStatus(status, userId);
        },
        // staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
};

export const useGetReadingLogs = (bookId?: string) => {
    const { profile, session } = useAuth();
    const userId = profile?.id || session?.user?.id;

    return useQuery({
        queryKey: ['readingLogss', bookId, userId],
        queryFn: async () => {
            if (bookId === 'last') return ({})
            if (!bookId || !userId) return null;
            return getReadingLogs(bookId, userId);
        },
        // staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
}

export const useGetBookReadingProgress = (bookId: string) => {
    const { profile, session } = useAuth();
    const userId = profile?.id || session?.user?.id;

    return useQuery({
        queryKey: ['bookReadingProgress', bookId, userId],
        queryFn: async () => {
            if (!userId) return null;
            return getBookReadingProgress(bookId, userId);
        },
        // staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
}

export const useGetUserBookCurrentStateData = (bookId: string | null) => {
    const { profile, session } = useAuth();
    const userId = profile?.id || session?.user?.id;

    return useQuery({
        queryKey: ['userBookCurrentStateData', bookId, userId],
        queryFn: async () => {
            if (!userId) return null;
            if (!bookId) return null;
            return getUserBookCurrentStateData({ bookId, userId });
        },
        // staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
}