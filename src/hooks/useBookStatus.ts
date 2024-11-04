// src/hooks/useBookStatus.ts
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import supabase from '../lib/supabase';
import { createUserBook, getUserBookStatus } from '@/services/books';
import { useAuth } from '@/providers/AuthProvider';
import { BookStatus, BookStatusDates } from '@/types/book';

export function useBookStatus(bookId: string) {
    // Query for current status
    const { data: book } = useQuery({
        queryKey: ['user-book', bookId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_books')
                .select('*')
                .eq('book_id', bookId)
                .single();

            if (error) throw error;
            return data;
        },
    });

    // Query for status history
    const { data: statusHistory } = useQuery({
        queryKey: ['book-status-history', bookId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_book_status_history')
                .select('*')
                .eq('user_book_id', bookId)
                .order('changed_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    // Get important dates
    const statusDates: BookStatusDates = {
        started_at: statusHistory?.find(h => h.status === 'reading')?.changed_at ?? null,
        finished_at: statusHistory?.find(h => h.status === 'read')?.changed_at ?? null,
        dnf_at: statusHistory?.find(h => h.status === 'did-not-finish')?.changed_at ?? null,
        added_at: statusHistory?.[statusHistory.length - 1]?.changed_at ?? book?.created_at,
    };

    return {
        currentStatus: book?.status,
        progress: book?.reading_progress,
        statusHistory,
        statusDates,
    };
}

export const useCreateUserBook = () => {
    const queryClient = useQueryClient();
    const { profile: user } = useAuth();

    return useMutation({
        mutationFn: ({ bookId, status }: { bookId: string; status: BookStatus }) =>
            createUserBook(bookId, user?.id || '', status),
        onSuccess: (_, { status }) => {
            queryClient.invalidateQueries({ queryKey: ['books', status] });
            queryClient.invalidateQueries({ queryKey: ['book-status-history'] });
            queryClient.invalidateQueries({ queryKey: ['user-book'] });
        },
    });
};

export const useUserBookStatus = (bookId: string) => {
    const { profile: user } = useAuth();

    return useQuery({
        queryKey: ['user-book', bookId, user?.id],
        queryFn: () => getUserBookStatus(bookId, user?.id || ''),
        enabled: !!user?.id && !!bookId,
    });
};