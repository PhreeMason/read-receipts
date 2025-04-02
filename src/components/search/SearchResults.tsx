// src/components/search/SearchResults.tsx
import React from 'react';
import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { SearchBookMetadata } from '@/types/book';
import { BookCover } from '@/components/search/BookCover';

type SearchResultsProps = {
    books: SearchBookMetadata[];
    onBookPress: (bookId: string) => void;
};

export const SearchResults: React.FC<SearchResultsProps> = ({ books, onBookPress }) => {
    if (!books || books.length === 0) {
        return (
            <View style={tw`flex-1 items-center justify-center`}>
                <Text style={tw`text-gray-500 text-lg`}>No results found</Text>
            </View>
        );
    }
    console.log({books})
    return (
        <View style={tw`flex-1`}>
            <Text style={tw`text-sm text-gray-500 mb-4`}>{`${books?.length} results found`}</Text>
            <FlatList
                data={books}
                numColumns={1}
                keyExtractor={(item) => item.api_id}
                renderItem={({ item }) => (
                    <BookCover
                        book={item}
                        onAddToLibrary={() => onBookPress(item.bookUrl)}
                    />
                )}
                contentContainerStyle={tw`flex-grow pb-4`}
            />
        </View>
    );
};
// http://localhost:8081/book/68428.Mistborn/details