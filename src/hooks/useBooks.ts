// src/hooks/useBooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    searchBookList,
    fetchBookData,
    addBookToLibrary,
} from '@/services/books';
import { BookAndUserBookInsert } from '@/types/book';
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
            queryClient.invalidateQueries({ queryKey: ['books', 'userbooks', 'bookStatusHistory'] });
        }
    })
}
