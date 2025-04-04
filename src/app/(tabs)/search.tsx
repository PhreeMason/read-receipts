// src/app/(tabs)/search.tsx
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { useDebounce } from '@/hooks/useDebounce';
import SearchHeader from '@/components/search/SearchHeader';
import { ScanBarcodeButton } from '@/components/search/ScanBarcodeButton';
import { useSearchBooksList } from '@/hooks/useBooks';

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const router = useRouter();

    const { data: books = [], isLoading } = useSearchBooksList(debouncedSearch.trim());
    const handleBookPress = (bookId: string) => {
        router.push(`/book/${bookId}/details`);
    };

    const handleScanPress = () => {
        console.log('Scan Book Barcode button pressed');
    };

    const searchText = (query: string) => {
        const trimmedQuery = query.trim();
        setSearchQuery(trimmedQuery);
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`flex-1 justify-center m-4 gap-4 bg-white`}>
                <SearchHeader />

                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <ScanBarcodeButton onPress={handleScanPress} />

                <SearchResults
                    books={books.bookList}
                    onBookPress={handleBookPress}
                    onTextClick={searchText}
                />
            </View>
        </SafeAreaView>
    );
}