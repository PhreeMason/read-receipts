import React from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import tw from 'twrnc';

// Hooks
import { useCurrentlyReading, useBooksByStatus } from '@/hooks/useBooks';
import { useAuth } from '@/providers/AuthProvider';

// Components
import HomeHeader from '@/components/home/Header';
import CurrentlyReadingSection from '@/components/home/CurrentlyReadingSection';
// import ActivityFeed from '@/components/home/ActivityFeed';
// import LibraryQuickAccess from '@/components/home/LibraryQuickAccess';
// import ReadingStats from '@/components/home/ReadingStats';
import { Loading, LoadingMessages } from '@/components/shared/Loading';
import { Book } from '@/types/book';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const queryClient = useQueryClient();
    const { profile: user } = useAuth();
    const [refreshing, setRefreshing] = React.useState(false);

    // Fetch data
    const { data: currentlyReading, isLoading: loadingCurrentReads } = useCurrentlyReading();
    const { data: toReadBooks } = useBooksByStatus('to-read');

    // Handle pull-to-refresh
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['books'] }),
            queryClient.invalidateQueries({ queryKey: ['reading-activity'] }),
        ]);
        setRefreshing(false);
    }, [queryClient]);

    if (loadingCurrentReads) {
        return <Loading message={LoadingMessages.BOOKS} />;
    }

    return (
        <SafeAreaView style={tw`flex-1`}>
            <ScrollView
                style={tw`flex-1 bg-gray-50`}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header with greeting */}
                <HomeHeader />

                {/* Main content container */}
                <View style={tw`px-4 pb-6 space-y-6`}>
                    {/* Currently reading section */}
                    <View style={tw`space-y-4`}>
                        {currentlyReading ? <CurrentlyReadingSection books={currentlyReading as unknown as Book[]} /> : null}
                    </View>

                    {/* Recent activity feed */}
                    <View style={tw`space-y-4`}>
                        {/* <ActivityFeed /> */}
                    </View>

                    {/* Library quick access */}
                    <View style={tw`space-y-4`}>
                        {/* <LibraryQuickAccess toReadBooks={toReadBooks} /> */}
                    </View>

                    {/* Reading stats (Optional for MVP) */}
                    <View style={tw`space-y-4`}>
                        {/* <ReadingStats /> */}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}