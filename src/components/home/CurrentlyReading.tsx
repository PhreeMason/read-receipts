import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { BookCard } from '@/components/book/BookCard';
import { useBooksByStatus } from '@/hooks/useBooks';
import { router } from 'expo-router';

const CurrentlyReading = () => {
  const { data: currentlyReading, error } = useBooksByStatus('reading');
  if (!currentlyReading || currentlyReading.length === 0 || error) {
    return null;
  }

  return (
    <View style={tw`mt-8`}>
      <View style={tw`px-4 flex-row justify-between items-center`}>
        <Text style={tw`text-lg font-semibold text-gray-900`}>Currently Reading</Text>
        <TouchableOpacity>
          <Text style={tw`text-blue-600`}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mt-4 pl-4`}
      >
        {currentlyReading.map(item => {
          const book = item.book;
          const bookId = book.id;
          return <BookCard
            key={book.id}
            book={{ ...book, reading_progress: item.reading_progress }}
            onPress={() => router.push(`/book/${bookId}/details`)}
          />
        })}
      </ScrollView>
    </View>
  )
}

export default CurrentlyReading