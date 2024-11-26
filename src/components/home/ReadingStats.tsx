import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import StatCard from '@/components/shared/StatCard';
import { useBooksByStatus, useUserBook } from '@/hooks/useBooks';
import { useReadingStreak } from '@/hooks/useReadingSession';

const ReadingStats = () => {
    const { data: currentlyReading } = useBooksByStatus('reading');
    const { data: userBooks } = useUserBook();

    const { data: streak, isLoading: isStreakLoading } = useReadingStreak();
    const booksCurrentlyReading = currentlyReading?.length || 0;
    const booksInLibrary = userBooks?.length || 0;

    return (
        <View style={tw`flex-row px-4 mt-6`}>
            {isStreakLoading ? null : <StatCard
                label="Reading Streak"
                value={`${streak?.current_streak} days`}
            />}
            <StatCard
                label="Currently Reading"
                value={booksCurrentlyReading}
            />
            <StatCard
                label="Books in Library"
                value={booksInLibrary}
            />
        </View>
    )
}

export default ReadingStats