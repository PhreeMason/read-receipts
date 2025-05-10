// src/app/(tabs)/search.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { useDebounce } from '@/hooks/useDebounce';
import Header from '@/components/shared/Header';
import { ScanBarcodeButton } from '@/components/search/ScanBarcodeButton';
import { useSearchBooksList } from '@/hooks/useBooks';

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const router = useRouter();

    const { data: books } = useSearchBooksList(debouncedSearch.trim());

    const handleBookPress = (bookId: string | null) => {
        if (!bookId) {
            return
        }
        router.push(`/book/${bookId}/add`);
    };

    const searchText = (query: string) => {
        const trimmedQuery = query.trim();
        setSearchQuery(trimmedQuery);
    }

    return (
        <SafeAreaView style={tw`flex-1 justify-center p-4 gap-4 bg-white`}>
            <Header title="Search" />

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <ScanBarcodeButton />

            <SearchResults
                books={books?.bookList}
                onBookPress={handleBookPress}
                onTextClick={searchText}
            />
        </SafeAreaView>
    );
}