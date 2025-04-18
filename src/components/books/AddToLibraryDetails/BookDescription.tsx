import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import HTML from 'react-native-render-html';
import tw from 'twrnc';
import { BookInsert } from '@/types/book';

const MemoizedRenderHtml = React.memo(HTML);

const BookDescription = ({ book }: { book: BookInsert }) => {
    const [expanded, setExpanded] = useState(false);
    const { width } = useWindowDimensions();

    if (!book.description) {
        return null;
    }

    return (
        <View style={tw`mb-6`}>
            <MemoizedRenderHtml
                source={{ html: expanded ? book.description : book.description.substring(0, 150) + '...' }}
                contentWidth={width - 48}
                tagsStyles={{
                    p: { fontSize: 14, color: '#374151', lineHeight: 20 },
                    i: { fontStyle: 'italic' },
                    br: { height: 12 }
                }}
            />
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={tw`text-sm font-semibold underline text-gray-800 mt-1`}>
                    {expanded ? 'Read less' : 'Read more'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default BookDescription;