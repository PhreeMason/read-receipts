import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import ReadingLogs from '@/components/books/ReadingLogs';
import { useFetchBookData } from '@/hooks/useBooks';
import BookHeader from '@/components/books/AddToLibraryDetails/BookHeader';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const log = () => {
    const { api_id } = useLocalSearchParams();
    const apiId = api_id as string;
    const { data: book } = useFetchBookData(api_id as string);

    const AddButton = () => <Link href={`/book/${apiId}/log-form`} style={tw`mr-4`}>
        <MaterialIcons name="add" size={24} color="black" />
    </Link>
    return (
        <SafeAreaView style={tw`flex-1 bg-white p-6`}>
            <Stack.Screen options={{
                title: "Reading Sessions",
                headerRight: () => <AddButton />,
            }} />
            {book ? <BookHeader book={book} /> : null}
            <ReadingLogs apiId={apiId} bookID={book?.id} hideSeeAll hideTitle />
        </SafeAreaView>
    )
}

export default log