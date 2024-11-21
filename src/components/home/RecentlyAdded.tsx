import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { BookCard } from '@/components/book/BookCard';
import { useRecentlyAddedBooks } from '@/hooks/useBooks';
import { router } from 'expo-router';

const RecentlyAdded = () => {
    const { data: recentlyAdded, error } = useRecentlyAddedBooks();

    if (!recentlyAdded || error || recentlyAdded.length === 0) {
        return null;
    }
    return (
        <View style={tw`mt-8 pb-8`}>
            <View style={tw`px-4 flex-row justify-between items-center`}>
                <Text style={tw`text-lg font-semibold text-gray-900`}>Recently Added</Text>
                <TouchableOpacity>
                    <Text style={tw`text-blue-600`}>See All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`mt-4 pl-4`}
            >
                {recentlyAdded.map(({ book }) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onPress={() => router.push(`/book/${book.id}/details`)}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

export default RecentlyAdded