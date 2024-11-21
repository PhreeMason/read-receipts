// src/components/book/BookCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Book } from '@/types/book';
import tw from 'twrnc';
import { ProgressBar } from '@/components/shared/ProgressBar';

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export function BookCard({ book, onPress }: BookCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`mr-4 w-32`}
    >
      <Image
        source={{ uri: book.cover_url || 'https://picsum.photos/200/300' }}
        style={tw`w-32 h-48 rounded-lg`}
        resizeMode="contain"
      />
      <Text style={tw`text-gray-900 font-semibold mt-2 text-sm`} numberOfLines={1}>
        {book.title}
      </Text>
      <Text style={tw`text-gray-600 text-xs`} numberOfLines={1}>
        {book.author}
      </Text>
      <View style={tw`mt-1`}>
        <ProgressBar progress={book.reading_progress} />
      </View>
    </TouchableOpacity>
  );
}