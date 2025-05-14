import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import SectionHeader from '@/components/shared/SectionHeader';
import { useGetBooksByStatus } from '@/hooks/useBooks';
import { router } from 'expo-router';
import BookList from '@/components/books/CurrentlyReading/BookList';

const RecentlyAdded = () => {
    const { data: tbrBooks, isLoading } = useGetBooksByStatus('tbr');
    const { data: completedBooks } = useGetBooksByStatus('completed');
    const { data: dnfBooks } = useGetBooksByStatus('dnf');
    const { data: puasedBooks } = useGetBooksByStatus('pause');

    const handleSeeAll = () => {
        router.push('/(tabs)/library');
    };
    const books = [
        ...(tbrBooks || []),
        ...(completedBooks || []),
        ...(dnfBooks || []),
        ...(puasedBooks || []),
    ].slice(0, 5);

    return (
        <View style={tw`mb-6 px-4`}>
            <SectionHeader title="Recently Added" onSeeAllPress={handleSeeAll} />
            <BookList
                books={books}
                isLoading={isLoading}
                onBookPress={handleSeeAll}
                ignoreProgress
            />
        </View>
    )
}

export default RecentlyAdded