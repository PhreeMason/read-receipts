// src/components/search/SearchResults.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import tw from 'twrnc';
import { BookCard } from '../book/BookCard';
import { Book } from '@/types/book';

type SearchResultsProps = {
    books: Book[];
    onBookPress: (bookId: string) => void;
};

export const SearchResults: React.FC<SearchResultsProps> = ({ books, onBookPress }) => {

    return (
        <FlatList
            data={books}
            numColumns={2}
            keyExtractor={(item) => item.id}
            // center all items in the list


            renderItem={({ item }) => (
                <View style={tw`px-4 py-2`}>
                    <BookCard
                        book={item}
                        onPress={() => onBookPress(item.id)}
                    />
                </View>
            )}
            contentContainerStyle={tw`flex-grow pb-4`}
        />
    );
};