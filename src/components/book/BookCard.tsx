// src/components/book/BookCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Book } from '@/types/book';
import tw from 'twrnc';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { ContinueReadingButton } from '@/components/home/CurrentlyReadingSection/ContinueReadingButton';
import { BookCover } from './BookCover';
import { BookInfo } from './BookInfo';

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export function BookCard({ book, onPress }: BookCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`w-64 bg-white rounded-lg overflow-hidden border border-gray-200`}
    >
      <BookCover url={book.cover_url} />
      <BookInfo 
        title={book.title}
        author={book.author}
        progress={book.reading_progress}
        onContinuePress={onPress}
      />
    </TouchableOpacity>
  );
}