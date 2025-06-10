// components/books/BookCard.jsx
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { formatAuthorName } from '@/utils/helpers';
import { mediumShadow } from '@/utils/constants';
import ReadingProgress from '@/components/books/CurrentlyReading/ReadingProgress';
import { BookStatusResponse } from '@/types/book'

type BookCardProps = {
    book: BookStatusResponse;
    onPress: (id: string) => void;
    ignoreProgress?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress, ignoreProgress }) => {
    const { log, status } = book
    const mostRecentLog = log[0];
    const mostRecentStatus = status[0];
    return (
        <TouchableOpacity
            key={book.id}
            style={tw.style(`w-36`, mediumShadow)}
            onPress={() => onPress(book.api_id)}
        >
            <View style={tw`flex flex-col rounded-lg shadow-sm bg-white`}>
                <View style={tw`relative`}>
                    <View style={tw`h-55 overflow-hidden rounded-t-lg`}>
                        <Image
                            source={{ uri: book.cover_image_url || '' }}
                            style={tw`w-full h-full`}
                            resizeMode="cover"
                        />
                    </View>
                </View>
                <View style={tw`p-3 flex-1 flex flex-col`}>
                    <Text style={tw`font-semibold text-black mb-1`} numberOfLines={1}>{book.title}</Text>
                    <Text style={tw`text-xs text-gray-600 mb-1`}>{book.authors.map(formatAuthorName)}</Text>

                    <ReadingProgress readingLog={mostRecentLog} mostRecentStatus={mostRecentStatus} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BookCard;
