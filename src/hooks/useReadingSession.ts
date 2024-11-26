import { useEffect, useRef, useState } from 'react';
import { Location, useReader } from '@epubjs-react-native/core';
import supabase from '@/lib/supabase';
import type { ReadingStats, ReadingStreak, ReadingSession } from '@/types/readdingSession';

const MINIMUM_SESSION_TIME = 10; // Minimum 5 seconds to count as a reading session
const STREAK_RESET_HOURS = 36; // Reset streak if no reading in 36 hours
const MIN_READING_TIME = 60; // Minimum 1 minute of reading to count towards streak

interface UseReadingSessionProps {
    bookId: string;
    userId: string;
}

export function useReadingSession({ bookId, userId }: UseReadingSessionProps) {
    const startTimeRef = useRef<Date | null>(null);
    const currentSessionRef = useRef<ReadingSession | null>(null);
    const isTracking = useRef<boolean>(false);

    const startSession = async (location: Location) => {
        if (isTracking.current) return;

        const startTime = new Date();

        const { data, error } = await supabase
            .from('reading_sessions')
            .insert({
                user_id: userId,
                book_id: bookId,
                start_time: startTime.toISOString(),
                start_location: location.start.location,
                start_cfi: location.start.cfi,
                pages_read: 0
            })
            .select()
            .single();

        if (!error) {
            startTimeRef.current = startTime;
            currentSessionRef.current = data;
            isTracking.current = true;
        }
    };

    // End the current reading session
    const endSession = async (location: Location) => {
        if (!isTracking.current || !currentSessionRef.current || !startTimeRef.current) return;

        const endTime = new Date();
        const sessionDuration = (endTime.getTime() - startTimeRef.current.getTime()) / 1000;

        // Only save sessions longer than minimum duration
        if (sessionDuration >= MINIMUM_SESSION_TIME) {
            const pagesRead = location.start.location - currentSessionRef.current.start_location;
            // Update session
            await supabase
                .from('reading_sessions')
                .update({
                    end_time: endTime.toISOString(),
                    end_location: location.end.location,
                    end_cfi: location.end.cfi,
                    pages_read: pagesRead > 0 ? pagesRead : 0
                })
                .eq('id', currentSessionRef.current.id);

            // Update total stats
            await updateReadingStats(sessionDuration, pagesRead);

            // Update streak if session was long enough
            if (sessionDuration >= MIN_READING_TIME) {
                await updateReadingStreak();
            }
        } else {
            // Delete short sessions
            await supabase
                .from('reading_sessions')
                .delete()
                .eq('id', currentSessionRef.current.id);
        }

        // Reset tracking state
        currentSessionRef.current = null;
        startTimeRef.current = null;
        isTracking.current = false;
    };

    const updateReadingStats = async (duration: number, pagesRead: number) => {
        const { data } = await supabase
            .from('reading_stats')
            .select()
            .eq('user_id', userId)
            .eq('book_id', bookId)
            .single();

        if (data) {
            await supabase
                .from('reading_stats')
                .update({
                    total_time_read: data.total_time_read + duration,
                    total_pages_read: data.total_pages_read + pagesRead,
                    last_read_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', data.id);
        } else {
            await supabase
                .from('reading_stats')
                .insert({
                    user_id: userId,
                    book_id: bookId,
                    total_time_read: duration,
                    total_pages_read: pagesRead,
                    last_read_at: new Date().toISOString()
                });
        }
    };

    const updateReadingStreak = async () => {
        const today = new Date().toISOString().split('T')[0];

        const { data: streak } = await supabase
            .from('reading_streaks')
            .select()
            .eq('user_id', userId)
            .single();

        if (streak) {
            const lastReadDate = new Date(streak.last_read_date);
            const hoursSinceLastRead = (new Date().getTime() - lastReadDate.getTime()) / (1000 * 60 * 60);

            let currentStreak = streak.current_streak;
            const lastReadDay = lastReadDate.toISOString().split('T')[0];

            if (hoursSinceLastRead >= STREAK_RESET_HOURS) {
                // Reset streak if too much time has passed
                currentStreak = 1;
            } else if (today > lastReadDay) {
                // Increment streak for new day
                currentStreak += 1;
            }

            await supabase
                .from('reading_streaks')
                .update({
                    current_streak: currentStreak,
                    longest_streak: Math.max(currentStreak, streak.longest_streak),
                    last_read_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', streak.id);
        } else {
            // Create first streak record
            await supabase
                .from('reading_streaks')
                .insert({
                    user_id: userId,
                    current_streak: 1,
                    longest_streak: 1,
                    last_read_date: new Date().toISOString()
                });
        }
    };

    return {
        startSession,
        endSession,
        isTracking
    };
}

// Hook to fetch reading stats
export function useReadingStats(userId: string, bookId: string) {
    const [stats, setStats] = useState<ReadingStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            const { data, error } = await supabase
                .from('reading_stats')
                .select()
                .eq('user_id', userId)
                .eq('book_id', bookId)
                .single();

            if (!error && data) {
                setStats(data);
            }
            setIsLoading(false);
        }

        fetchStats();
    }, [userId, bookId]);

    return { stats, isLoading };
}

// Hook to fetch reading streak
export function useReadingStreak(userId: string) {
    const [streak, setStreak] = useState<ReadingStreak | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStreak() {
            const { data, error } = await supabase
                .from('reading_streaks')
                .select()
                .eq('user_id', userId)
                .single();

            if (!error && data) {
                setStreak(data);
            }
            setIsLoading(false);
        }

        fetchStreak();
    }, [userId]);

    return { streak, isLoading };
}