// src/hooks/useReadingSession.ts
import { Location } from '@epubjs-react-native/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { MINIMUM_SESSION_TIME, MIN_READING_TIME } from '@/utils/constants';
import {
    startSession,
    getSession,
    endSession,
    deleteSession,
    getReadingStreak,
    updateReadingStreak
} from '@/services/reading-sessions';

export const useStartSession = (bookId: string) => {
    const { profile: user } = useAuth();

    return useMutation({
        mutationFn: async (location: Location) => startSession(bookId, user!.id, location),
    })
}

export const useEndSession = () => {
    const queryClient = useQueryClient();
    const userId = useAuth().profile?.id!;
    return useMutation({
        mutationFn: async (data: { sessionId: string; location: Location }) => {
            const session = await getSession(data.sessionId);
            const sessionDuration = (new Date().getTime() - new Date(session!.start_time).getTime()) / 1000;
            const pagesRead = data.location.start.location - session.start_location;

            console.log('session duration', sessionDuration)
            if (sessionDuration > MINIMUM_SESSION_TIME) {
                console.log('ending session')
                await endSession(data.sessionId, data.location, pagesRead)

                if (sessionDuration >= MIN_READING_TIME) {
                    console.log('updating reading streak')
                    await updateReadingStreak(userId);
                }
                return;
            }

            throw new Error('Session too short');
        },
        onError: (error, variables: { sessionId: string; location: Location }) => {
            console.error(error);
            console.log('deleting session');
            deleteSession(variables.sessionId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reading-streak', userId] });
        }
    })
}

// Hook to fetch reading streak
export const useReadingStreak = () => {
    const { profile: user } = useAuth();

    return useQuery({
        queryKey: ['reading-streak', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            return getReadingStreak(user.id);
        },
        enabled: !!user?.id
    })
}