// src/components/home/CurrentlyReading/CurrentlyReadingList.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { Book } from '@/types/book';
import tw from 'twrnc';
import { BookCard } from '@/components/book/BookCard';

interface CurrentlyReadingListProps {
  books: Book[];
  onBookPress: (bookId: string) => void;
}

export function CurrentlyReadingList({ books, onBookPress }: CurrentlyReadingListProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`space-x-4`}
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onPress={() => onBookPress(book.id)}
        />
      ))}
    </ScrollView>
  );
}