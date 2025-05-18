import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import HTML from 'react-native-render-html';
import tw from 'twrnc';
import { BookInsert } from '@/types/book';

const BookDescription = ({ book }: { book: BookInsert }) => {
    const [expanded, setExpanded] = useState(false);
    const { width } = useWindowDimensions();


    const text = book.description
    // Memoize the HTML component to prevent re-renders when other state changes
    const htmlContent = () => {
        if (!text) {
            return null;
        }
        const content = expanded ? text : text.substring(0, 150) + '...';
        return (
            <HTML
                source={{ html: content }}
                contentWidth={width - 48}
                tagsStyles={{
                    p: { fontSize: 14, color: '#374151', lineHeight: 20 },
                    i: { fontStyle: 'italic' },
                    br: { height: 12 }
                }}
            />
        );
    };

    if (!book.description) {
        return null;
    }


    return (
        <View style={tw`mb-6`}>
            {htmlContent()}
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={tw`text-sm font-semibold underline text-gray-800 mt-1`}>
                    {expanded ? 'Read less' : 'Read more'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default BookDescription;