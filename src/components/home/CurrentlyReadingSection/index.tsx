// src/components/home/CurrentlyReading/CurrentlyReadingSection.tsx
import React from 'react';
import { View } from 'react-native';
import { Book } from '@/types/book';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

import { SectionTitle } from '@/components/shared/SectionTitle';
import { CurrentlyReadingList } from './CurrentlyReadingList';
import { EmptyReadingState } from './EmptyReadingState';

interface CurrentlyReadingSectionProps {
  books: Book[];
}

// Container component that handles logic
export default function CurrentlyReadingSection({ books }: CurrentlyReadingSectionProps) {
  const router = useRouter();

  const handleBookPress = (bookId: string) => {
    // router.push(`/book/${bookId}/read`);
    console.log('Book pressed:', bookId);
  };

  return (
    <View style={tw`py-4`}>
      <SectionTitle>Currently Reading</SectionTitle>
      {!books?.length ? (
        <EmptyReadingState onPress={() => router.push('/search')} />
      ) : (
        <CurrentlyReadingList 
          books={books} 
          onBookPress={handleBookPress}
        />
      )}
    </View>
  );
}