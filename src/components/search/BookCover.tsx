// src/components/search/BookCover.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { BookMetadata } from '@/types/book';
import Rating from '@/components/shared/Rating';
import { BookStatusActionButton } from '@/components/shared/BookStatusActionButton'
import { mediumShadow } from '@/utils/constants';
import { formatAuthorName } from '@/utils/helpers';

type BookCoverProps = {
    book: BookMetadata;
    onAddToLibrary?: () => void;
    onTextClick?: (text: string) => void;
};

export const BookCover: React.FC<BookCoverProps> = ({ book, onAddToLibrary, onTextClick }) => {
    // @ts-ignore  Property 'name' does not exist on type 'string'
    const authorNames = book.metadata.authors.map(formatAuthorName);
    const publicationYear = book.publication_date
        ? new Date(book.publication_date).getFullYear()
        : null;
    const seriesInfo = book.metadata.series
        ? `${book.metadata.series}${book.metadata.series_number ? ` #${book.metadata.series_number}` : ''}`
        : null;

    return (
        <TouchableOpacity style={tw.style(`rounded-xl p-3 mb-4 flex-row`, mediumShadow)}
            onPress={onAddToLibrary}
        >
            {/* Book Cover Image */}
            <Image
                source={{ uri: book.cover_image_url }}
                style={tw.style(`w-16 h-24 rounded-lg`, mediumShadow)}
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
                    {authorNames.map((name: string, index: number) => (
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

            {book.bookUrl && <BookStatusActionButton book_api_id={book.bookUrl} />}
        </TouchableOpacity>
    );
};
