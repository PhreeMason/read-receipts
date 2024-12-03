import { Location } from '@epubjs-react-native/core';
import supabase from '@/lib/supabase';
import { STREAK_RESET_HOURS } from '@/utils/constants';

export const getReadingStreak = async (userId: string) => {
    const { data, error } = await supabase
        .from('reading_streaks')
        .select()
        .eq('user_id', userId)
        .single();

    if (error) throw error;

    return data;
}

export const startSession = async (bookId: string, userId: string, location: Location) => {
    const { data, error } = await supabase
        .from('reading_sessions')
        .insert({
            user_id: userId,
            book_id: bookId,
            start_time: new Date().toISOString(),
            start_location: location.start.location,
            start_cfi: location.start.cfi,
            pages_read: 0
        })
        .select()
        .single();

    console.log('start session', { data, error });
    if (error) throw error;

    return data;
}

export const endSession = async (sessionId: string, location: Location, pages_read: number) => {
    const endTime = new Date().toISOString();
    const { data, error } = await supabase
        .from('reading_sessions')
        .update({
            end_time: endTime,
            end_location: location.end.location,
            end_cfi: location.end.cfi,
            pages_read: pages_read > 0 ? pages_read : 0
        })
        .eq('id', sessionId)
        .select()
        .single();

    console.log('end session', { data, error, sessionId, pages_read });
    if (error) throw error;

    return data;
}

export const getSession = async (sessionId: string) => {
    const { data, error } = await supabase
        .from('reading_sessions')
        .select()
        .eq('id', sessionId)
        .single();

    if (error) throw error;

    return data;
}

export const deleteSession = async (sessionId: string) => {
    const { error } = await supabase
        .from('reading_sessions')
        .delete()
        .eq('id', sessionId);

    if (error) throw error;
}

export const updateReadingStreak = async (userId: string) => {
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