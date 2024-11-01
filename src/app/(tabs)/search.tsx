// src/app/(tabs)/search.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { useSearchBooks } from '@/hooks/useBooks';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const router = useRouter();

  const { data: books = [], isLoading } = useSearchBooks(debouncedSearch);
  const handleBookPress = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <SearchResults
        books={books}
        onBookPress={handleBookPress}
      />
    </SafeAreaView>
  );
}