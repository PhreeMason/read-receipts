// src/hooks/useBooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    searchBookList,
    fetchBookData,
    addBookToLibrary,
    getBookStatusHistory,
    getBooksByStatus,
    getReadingLogs
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
    const { profile: user } = useAuth();
    return useQuery({
        queryKey: ['bookStatusHistory', api_id, user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            return getBookStatusHistory(api_id, user.id);
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.id,
    });
}

export const useSaveUserBook = () => {
    const queryClient = useQueryClient();
    const { profile: user } = useAuth();

    return useMutation({
        mutationFn: async (userBookData: BookAndUserBookInsert) => {
            if (!user?.id) return null;
            const separatedUserBookInfo = separateBookData(userBookData, user.id);
            return addBookToLibrary(separatedUserBookInfo, user.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['bookStatusHistory'] });
            queryClient.invalidateQueries({ queryKey: ['userbooks'] });
        }
    })
}

export const useGetBooksByStatus = (status: BookStatusHistory['status']) => {
    const { profile: user } = useAuth();
    const userId = user?.id;

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

export const useGetReadingLogs = (bookId: string) => {
    const { profile: user } = useAuth();
    const userId = user?.id;

    return useQuery({
        queryKey: ['readingLogss', bookId, userId],
        queryFn: async () => {
            if (bookId === 'last') return ({})
            if (!userId) return null;
            return getReadingLogs(bookId, userId);
        },
        // staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
}