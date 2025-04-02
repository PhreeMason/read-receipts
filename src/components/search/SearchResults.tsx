// src/components/search/SearchResults.tsx
import React from 'react';
import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { SearchBookMetadata } from '@/types/book';
import Rating from '@/components/shared/Rating';
import Entypo from '@expo/vector-icons/Entypo';

// TODO: REMOVE BOOKCOVER AND MOVE IT TO ANOTHER COMPONENT
type BookCoverProps = {
    book: SearchBookMetadata;
    onAddToLibrary?: () => void;
};

export const BookCover: React.FC<BookCoverProps> = ({ book, onAddToLibrary }) => {
    const authorNames = book.metadata.authors.map(author => author.name || author).join(', ');
    const publicationYear = book.publication_date
        ? new Date(book.publication_date).getFullYear()
        : null;
    const seriesInfo = book.metadata.series
        ? `${book.metadata.series}${book.metadata.series_number ? ` #${book.metadata.series_number}` : ''}`
        : null;

    // Check if book is already in library (placeholder - implement actual check)
    const isInLibrary = false; // This should be replaced with actual library check logic

    return (
        <View style={tw`rounded-xl p-3 mb-4 shadow-md flex-row`}>
            {/* Book Cover Image */}
            <Image
                source={{ uri: book.cover_image_url }}
                style={tw`w-16 h-24 rounded-lg shadow-sm`}
                resizeMode="cover"
            />
            {/* Book Information */}
            <View style={tw`ml-3 flex-1`}>
                <Text style={tw`font-semibold text-black text-base leading-tight`}>
                    {book.title}
                </Text>
                <Text style={tw`text-black text-sm`}>{authorNames}</Text>
                {seriesInfo ? (
                    <Text style={tw`text-xs text-blue-600`}>{seriesInfo}</Text>
                ): null}
                {book.rating ? (<Rating rating={book.rating.toFixed(1)} />) : null}
                <Text style={tw`text-xs text-black mt-1`}>{publicationYear}</Text>
            </View>

            <TouchableOpacity style={tw`self-center p-2 rounded-full hover:bg-gray-100`}>
                <Entypo name="plus" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
};

type SearchResultsProps = {
    books: SearchBookMetadata[];
    onBookPress: (bookId: string) => void;
};

export const SearchResults: React.FC<SearchResultsProps> = ({ books, onBookPress }) => {
    console.log('SearchResults books:', books);
    if (!books || books.length === 0) {
        return (
            <View style={tw`flex-1 items-center justify-center`}>
                <Text style={tw`text-gray-500 text-lg`}>No results found</Text>
            </View>
        );
    }
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
                        onAddToLibrary={() => onBookPress(item.id)}
                    />
                )}
                contentContainerStyle={tw`flex-grow pb-4`}
            />
        </View>
    );
};