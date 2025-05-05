import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import tw from 'twrnc';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useFetchBookData } from '@/hooks/useBooks';
import BookHeader from '@/components/books/AddToLibraryDetails/BookHeader';
import BookDescription from '@/components/books/AddToLibraryDetails/BookDescription';
import ReadingLogs from '@/components/books/ReadingLogs';

const display = () => {
    const { api_id } = useLocalSearchParams();
    const { data: book, isLoading: isLoadingBook } = useFetchBookData(api_id as string);
    console.log({ book })

    if (!book) {
        return <Text>No Book</Text>
    }
    return (
        <SafeAreaView style={tw`flex-1 bg-white p-6`}>
            {/* Header Section */}
            <Stack.Screen options={{
                title: book?.title || "Book details"
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
            {book.id ? <ReadingLogs bookID={book.id} /> : null}

            {/* Notes & Quotes */}
            <View style={tw`mb-8`}>
                <View style={tw`flex justify-between items-center mb-2`}>
                    <Text style={tw`text-sm font-semibold text-black`}>Notes & Quotes</Text>
                    <TouchableOpacity>
                        <Text style={tw`text-xs text-black`}>Add New</Text>
                    </TouchableOpacity>
                </View>
                <View style={tw`bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-3`}>
                    <View style={tw`flex justify-between items-start mb-2`}>
                        <Text style={tw`text-xs font-medium text-black`}>Quote on p.87</Text>
                        <Text style={tw`text-xs text-black`}>3 days ago</Text>
                    </View>
                    <Text style={tw`text-xs text-black italic mb-2`}>
                        "The only way to learn is to live."
                    </Text>
                    <View style={tw`flex-row gap-2`}>
                        <Text style={tw`px-2 py-1 bg-gray-100 rounded-full text-xs text-black`}>inspiration</Text>
                        <Text style={tw`px-2 py-1 bg-gray-100 rounded-full text-xs text-black`}>favorite</Text>
                    </View>
                </View>
                <View style={tw`bg-white rounded-xl p-4 border border-gray-100 shadow-sm`}>
                    <View style={tw`flex justify-between items-start mb-2`}>
                        <Text style={tw`text-xs font-medium text-black`}>Note on Chapter 5</Text>
                        <Text style={tw`text-xs text-black`}>1 week ago</Text>
                    </View>
                    <Text style={tw`text-xs text-black mb-2`}>
                        Interesting parallel between Nora's choices and the quantum physics concept mentioned earlier.
                    </Text>
                    <View style={tw`flex-row gap-2`}>
                        <Text style={tw`px-2 py-1 bg-gray-100 rounded-full text-xs text-black`}>analysis</Text>
                    </View>
                </View>
            </View>


            {/* Reading Stats */}
            <View style={tw`mb-20`}>
                <Text style={tw`text-sm font-semibold text-black mb-2`}>Reading Stats</Text>
                <View style={tw`grid grid-cols-2 gap-3`}>
                    <View style={tw`bg-white rounded-xl p-3 border border-gray-100 shadow-sm`}>
                        <View style={tw`flex-row items-center gap-2 mb-1`}>
                            {/* You'll need to import an icon library or create SVG components */}
                            <Text style={tw`text-xs font-medium text-black`}>Avg. Pages/Day</Text>
                        </View>
                        <Text style={tw`text-lg font-bold text-black`}>18</Text>
                    </View>
                    <View style={tw`bg-white rounded-xl p-3 border border-gray-100 shadow-sm`}>
                        <View style={tw`flex-row items-center gap-2 mb-1`}>
                            <Text style={tw`text-xs font-medium text-black`}>Total Time</Text>
                        </View>
                        <Text style={tw`text-lg font-bold text-black`}>7.5 hrs</Text>
                    </View>
                    <View style={tw`bg-white rounded-xl p-3 border border-gray-100 shadow-sm`}>
                        <View style={tw`flex-row items-center gap-2 mb-1`}>
                            <Text style={tw`text-xs font-medium text-black`}>Reading Streak</Text>
                        </View>
                        <Text style={tw`text-lg font-bold text-black`}>5 days</Text>
                    </View>
                    <View style={tw`bg-white rounded-xl p-3 border border-gray-100 shadow-sm`}>
                        <View style={tw`flex-row items-center gap-2 mb-1`}>
                            <Text style={tw`text-xs font-medium text-black`}>Est. Completion</Text>
                        </View>
                        <Text style={tw`text-lg font-bold text-black`}>6 days</Text>
                    </View>
                </View>
            </View>

        </SafeAreaView>
    )
}

export default display;