// CurrentlyReading.jsx
import { View } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { useGetBooksByStatus } from '@/hooks/useBooks';
import { router } from 'expo-router';
import SectionHeader from '@/components/shared/SectionHeader';
import BookList from '@/components/books/CurrentlyReading/BookList';

const CurrentlyReading = () => {
    const { data: readingBooks, isLoading } = useGetBooksByStatus('current');

    const handleSeeAll = () => {
        router.push('/(tabs)/library');
    };

    const handleBookPress = (bookId: string) => {
        router.push(`/book/${bookId}/display`); // Fixed typo in "display"
    };

    return (
        <View style={tw`mb-6 px-4`}>
            <SectionHeader title="Currently Reading" onSeeAllPress={handleSeeAll} />
            <BookList
                books={readingBooks || []}
                isLoading={isLoading}
                onBookPress={handleBookPress}
            />
        </View>
    );
};

export default CurrentlyReading;
