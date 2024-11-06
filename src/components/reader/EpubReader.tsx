// components/reader/EpubReader.tsx
import React from 'react';
import { View, Text, SafeAreaView, Platform } from 'react-native';
import { Reader, Section, useReader, Location } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { useGetBookWithSignedUrl, useUpdateReadingProgress } from '@/hooks/useBooks';
import tw from 'twrnc';
import { Stack } from 'expo-router';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
    bookId: string;
}

function EpubReader({ bookId }: Props) {
    const {
        data: book,
        error,
        isLoading
    } = useGetBookWithSignedUrl(bookId);
    const { goToLocation, currentLocation } = useReader();
    const { mutate: updateReadingProgress } = useUpdateReadingProgress();

    if (isLoading) {
        return <View><Text>Loading...</Text></View>;
    }

    if (error || !book) {
        return <View><Text>Error loading book: {error?.message}</Text></View>;
    }

    const handleLocationChange = async (totalLocations: number, currentLocation: Location, progress: number, currentSection: Section | null) => {
        console.log('Location changed:', JSON.stringify({
            totalLocations,
            currentLocation,
            progress,
            currentSection
        }, null, 2));
        const { start: { cfi, percentage } } = currentLocation;
        // debounce the location update
        useDebounce(() => {
            updateReadingProgress({
                userBookId: book.id,
                progress: percentage,
                lastPosition: cfi
            });
        }, 1000);
    };
    if (Platform.OS === 'web') {
        return null
    }
    return (
        <>
            <Stack.Screen options={{ title: book.title }} />
            <Reader
                src={book.epub_url}
                fileSystem={useFileSystem}
                initialLocation={"epubcfi(/6/8!/4/4/46/1:273)"}
                onLocationChange={handleLocationChange}
                onDisplayError={(error) => console.error(error)}
                onLocationsReady={(data) => console.log('Locations ready:', data)}
                onSingleTap={() => console.log('Single tap')}
                onPress={() => console.log('Press')}
                onWebViewMessage={(message) => console.log('WebView message:', message)}
            />
        </>
    );
}

export default EpubReader;