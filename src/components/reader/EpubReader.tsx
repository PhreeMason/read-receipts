// components/reader/EpubReader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Reader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { useGetBookWithSignedUrl } from '@/hooks/useBooks';

interface Props {
  bookId: string;
  userId: string;
}

export function EpubReader({ bookId, userId }: Props) {
  const { 
    data: book, 
    error, 
    isLoading 
  } = useGetBookWithSignedUrl(bookId);

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

  return (
    <View style={{ flex: 1 }}>
      <Reader
        src={book.epub_url}
        fileSystem={useFileSystem}
        initialLocation={book.reading_progress}
        onLocationChange={handleLocationChange}
      />
    </View>
  );
}