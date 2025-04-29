import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react'
import tw from 'twrnc';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useFetchBookData } from '@/hooks/useBooks';
import BookHeader from '@/components/books/AddToLibraryDetails/BookHeader';
import BookDescription from '@/components/books/AddToLibraryDetails/BookDescription';

const display = () => {
    const { api_id } = useLocalSearchParams();
    const { data: bookDetails, isLoading: isLoadingBook } = useFetchBookData(api_id as string);
    console.log({ bookDetails })

    if (!bookDetails) {
        return <Text>No Book</Text>
    }
    const book = bookDetails
    return (
        <SafeAreaView style={tw`flex-1 bg-white p-6`}>
            {/* Header Section */}
            <Stack.Screen options={{
                title: bookDetails?.title || "Book details"
            }} />

            <BookHeader book={book} />

            {/* Format Selection */}
            <View style={tw`mb-8`}>
                <View style={tw`flex-row gap-3`}>
                    <TouchableOpacity style={tw`flex-1 py-2 bg-gray-800 text-white text-xs rounded-lg`}>
                        <Text style={tw`text-center text-white`}>Physical</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`flex-1 py-2 bg-white border border-gray-300 text-black text-xs rounded-lg`}>
                        <Text style={tw`text-center text-black`}>E-book</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`flex-1 py-2 bg-white border border-gray-300 text-black text-xs rounded-lg`}>
                        <Text style={tw`text-center text-black`}>Audiobook</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <BookDescription book={book} />


            {/* Reading Sessions */}
            {/* Add similar sections for Reading Sessions, Notes & Quotes, and Reading Stats */}
        </SafeAreaView>
    )
}

export default display;