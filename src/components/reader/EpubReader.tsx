// components/reader/EpubReader.tsx
import React from 'react';
import { View, Text, SafeAreaView, Platform } from 'react-native';
import { Reader, useReader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { useGetBookWithSignedUrl } from '@/hooks/useBooks';
import tw from 'twrnc';
import { Stack } from 'expo-router';

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
    if (isLoading) {
        return <View><Text>Loading...</Text></View>;
    }

    if (error || !book) {
        return <View><Text>Error loading book: {error?.message}</Text></View>;
    }

    const handleLocationChange = async (loc: number) => {
        // You might want to create a separate mutation hook for this
        // await bookService.updateReadingProgress(userId, book.id, loc);
        console.log('Location changed:', loc);
    };
    console.log('currentLocation:', currentLocation);
    if (Platform.OS === 'web') {
        return null
    }
    return (
        <Reader
            src={book.epub_url}
            // src="https://epubjs-react-native.s3.amazonaws.com/failing-forward.epub"
            fileSystem={useFileSystem}
            // initialLocation={book.reading_progress}
            onLocationChange={handleLocationChange}
            onDisplayError={(error) => console.error(error)}
            onLocationsReady={(data) => console.log('Locations ready:', data)}
            onSingleTap={() => console.log('Single tap')}
            onWebViewMessage={(message) => console.log('WebView message:', message)}
        />
    );
}

export default EpubReader;