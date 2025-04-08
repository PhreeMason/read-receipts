// src/components/search/BookCover.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import tw from 'twrnc';
import { SearchBookMetadata } from '@/types/book';
import Rating from '@/components/shared/Rating';
import Entypo from '@expo/vector-icons/Entypo';
import { BookStatusActionButton } from '@/components/shared/BookStatusActionButton'

type BookCoverProps = {
    book: SearchBookMetadata;
    onAddToLibrary?: () => void;
    onTextClick?: (text: string) => void;
};

export const BookCover: React.FC<BookCoverProps> = ({ book, onAddToLibrary, onTextClick }) => {
    const authorNames = book.metadata.authors.map((author) => author.name || author);
    const publicationYear = book.publication_date
        ? new Date(book.publication_date).getFullYear()
        : null;
    const seriesInfo = book.metadata.series
        ? `${book.metadata.series}${book.metadata.series_number ? ` #${book.metadata.series_number}` : ''}`
        : null;

    // Check if book is already in library (placeholder - implement actual check)
    const isInLibrary = false; // This should be replaced with actual library check logic
    const shadowStyle =
        Platform.OS === 'ios' ? 'shadow' : 'shadow-md shadow-black/60';
    return (
        <TouchableOpacity style={tw`rounded-xl p-3 mb-4 shadow-md flex-row`}
            onPress={onAddToLibrary}
        >
            {/* Book Cover Image */}
            <Image
                source={{ uri: book.cover_image_url }}
                style={tw`w-16 h-24 rounded-lg ${shadowStyle}`}
                resizeMode="cover"
            />
            {/* Book Information */}
            <View style={tw`ml-3 flex-1`}>
                <View
                >
                    <Text style={tw`font-semibold text-black text-base leading-tight`}>
                        {book.title}
                    </Text>
                </View>

                <View style={tw`text-black text-sm`}>
                    {authorNames.map((name, index) => (
                        <Text key={`${index}-${name}`} style={tw`mr-1`}
                            onPress={() => onTextClick?.(name)}
                        >
                            {name}
                        </Text>
                    ))}
                </View>
                {seriesInfo ? (
                    <Text style={tw`text-xs text-blue-600`} onPress={() => onTextClick?.(seriesInfo.split(',')[0])}>{seriesInfo}</Text>
                ) : null}
                {book.rating ? (<Rating rating={book.rating.toFixed(1)} />) : null}
                <Text style={tw`text-xs text-black mt-1`}>{publicationYear}</Text>
            </View>

            <BookStatusActionButton bookId={book.bookUrl} />
        </TouchableOpacity>
    );
};
